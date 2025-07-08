import { noteService } from '@/lib/notes/noteService';
import { EncryptionManager } from '@/lib/sync/encryption';

export interface SyncItem {
  id: string;
  type: 'session' | 'plan' | 'achievement' | 'note';
  data: any;
  timestamp: Date;
  synced: boolean;
  path?: string;
}

export interface SyncConfig {
  autoSync: boolean;
  syncInterval: number; // minutes
  encryptionEnabled: boolean;
  encryptionPassword?: string;
  vaultPath: string;
}

export class SyncManager {
  private items: SyncItem[] = [];
  private config: SyncConfig;
  private encryptionManager: EncryptionManager;
  private isSyncing = false;
  private lastSyncTime?: Date;

  constructor(config: SyncConfig) {
    this.config = config;
    this.encryptionManager = new EncryptionManager();
  }

  // 아이템 추가
  addItem(item: Omit<SyncItem, 'id' | 'timestamp' | 'synced'>): string {
    const newItem: SyncItem = {
      ...item,
      id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      synced: false
    };

    this.items.push(newItem);
    return newItem.id;
  }

  // 아이템 업데이트
  updateItem(id: string, data: any): boolean {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.data = data;
      item.timestamp = new Date();
      item.synced = false;
      return true;
    }
    return false;
  }

  // 아이템 삭제
  removeItem(id: string): boolean {
    const index = this.items.findIndex(i => i.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  // 동기화 실행
  async sync(): Promise<SyncResult> {
    if (this.isSyncing) {
      return { success: false, syncedItems: 0, errors: [{ itemId: 'general', error: 'Already syncing' }] };
    }

    this.isSyncing = true;
    const result: SyncResult = {
      success: true,
      syncedItems: 0,
      errors: []
    };

    try {
      // 동기화되지 않은 아이템들 처리
      const unsyncedItems = this.items.filter(item => !item.synced);
      
      for (const item of unsyncedItems) {
        try {
          await this.syncItem(item);
          item.synced = true;
          result.syncedItems++;
        } catch (error) {
          result.errors.push({
            itemId: item.id,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      // 데이터베이스에서 변경사항 확인
      await this.checkForRemoteChanges();

      this.lastSyncTime = new Date();
    } catch (error) {
      result.success = false;
      result.errors.push({
        itemId: 'general',
        error: error instanceof Error ? error.message : 'Sync failed'
      });
    } finally {
      this.isSyncing = false;
    }

    return result;
  }

  // 개별 아이템 동기화
  private async syncItem(item: SyncItem): Promise<void> {
    const path = this.generatePath(item);
    const content = this.serializeItem(item);

    // 암호화 적용
    let finalContent = content;
    if (this.config.encryptionEnabled && this.config.encryptionPassword) {
      finalContent = await this.encryptionManager.encrypt(content, this.config.encryptionPassword!);
    }

    // 데이터베이스에 저장
    if (item.path) {
      // 기존 노트 업데이트
      await noteService.updateNote(item.path, finalContent);
    } else {
      // 새 노트 생성
      const note = await noteService.createNote({
        userId: 'system', // 시스템 노트
        content: finalContent,
        title: path
      });
      item.path = note.id;
    }
  }

  // 원격 변경사항 확인 (데이터베이스에서)
  private async checkForRemoteChanges(): Promise<void> {
    try {
      const notes = await noteService.getUserNotes('system', 100, 0);

      for (const note of notes) {
        const existingItem = this.items.find(item => item.path === note.id);
        
        if (!existingItem) {
          // 새로운 원격 아이템 발견
          const content = note.content;
          let decryptedContent = content;
          
          if (this.config.encryptionEnabled && this.config.encryptionPassword) {
            decryptedContent = await this.encryptionManager.decrypt(content, this.config.encryptionPassword!);
          }

          const item = this.deserializeItem(decryptedContent, note.id);
          if (item) {
            this.items.push(item);
          }
        }
      }
    } catch (error) {
      console.error('Failed to check remote changes:', error);
    }
  }

  // 경로 생성
  private generatePath(item: SyncItem): string {
    const date = new Date().toISOString().split('T')[0];
    const safeId = item.id.replace(/[^a-zA-Z0-9]/g, '-');
    return `${this.config.vaultPath}/${item.type}/${date}-${safeId}.md`;
  }

  // 아이템 직렬화
  private serializeItem(item: SyncItem): string {
    return JSON.stringify({
      id: item.id,
      type: item.type,
      data: item.data,
      timestamp: item.timestamp.toISOString()
    }, null, 2);
  }

  // 아이템 역직렬화
  private deserializeItem(content: string, path: string): SyncItem | null {
    try {
      const parsed = JSON.parse(content);
      return {
        id: parsed.id,
        type: parsed.type,
        data: parsed.data,
        timestamp: new Date(parsed.timestamp),
        synced: true,
        path
      };
    } catch (error) {
      console.error('Failed to deserialize item:', error);
      return null;
    }
  }

  // 설정 업데이트
  updateConfig(newConfig: Partial<SyncConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // 상태 조회
  getStatus(): SyncStatus {
    return {
      totalItems: this.items.length,
      syncedItems: this.items.filter(i => i.synced).length,
      lastSyncTime: this.lastSyncTime,
      isSyncing: this.isSyncing,
      config: { ...this.config }
    };
  }

  // 동기화 통계
  getStats(): SyncStats {
    const now = new Date();
    const last24Hours = this.items.filter(item => 
      now.getTime() - item.timestamp.getTime() < 24 * 60 * 60 * 1000
    );

    return {
      totalItems: this.items.length,
      syncedItems: this.items.filter(i => i.synced).length,
      itemsLast24Hours: last24Hours.length,
      syncSuccessRate: this.items.length > 0 
        ? (this.items.filter(i => i.synced).length / this.items.length) * 100 
        : 100
    };
  }
}

export interface SyncResult {
  success: boolean;
  syncedItems: number;
  errors: Array<{
    itemId: string;
    error: string;
  }>;
}

export interface SyncStatus {
  totalItems: number;
  syncedItems: number;
  lastSyncTime?: Date;
  isSyncing: boolean;
  config: SyncConfig;
}

export interface SyncStats {
  totalItems: number;
  syncedItems: number;
  itemsLast24Hours: number;
  syncSuccessRate: number;
}

// 기본 설정으로 SyncManager 생성
export const createSyncManager = (config: Partial<SyncConfig> = {}): SyncManager => {
  const defaultConfig: SyncConfig = {
    autoSync: true,
    syncInterval: 30,
    encryptionEnabled: false,
    vaultPath: 'subvocalization-coaching'
  };

  return new SyncManager({ ...defaultConfig, ...config });
}; 