import { BackupConfig, BackupStatus } from './types';
import { EncryptionManager } from './encryption';
import fs from 'fs/promises';
import path from 'path';

export class BackupManager {
  private config: BackupConfig;
  private status: BackupStatus;
  private encryptionManager: EncryptionManager;

  constructor(config: BackupConfig, encryptionManager: EncryptionManager) {
    this.config = config;
    this.encryptionManager = encryptionManager;
    this.status = {
      backupSize: 0,
      backupCount: 0,
      isBackingUp: false
    };
  }

  async createBackup(vaultPath: string, password?: string): Promise<string> {
    if (!this.config.enabled) {
      throw new Error('Backup is disabled');
    }

    this.status.isBackingUp = true;

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `backup-${timestamp}.zip`;
      const backupPath = path.join(this.config.backupPath, backupFileName);

      // Ensure backup directory exists
      await fs.mkdir(this.config.backupPath, { recursive: true });

      // Create backup archive
      const backupData = await this.createBackupArchive(vaultPath);
      
      // Encrypt backup if password provided
      let finalBackupData: Buffer;
      if (password) {
        const encrypted = await this.encryptionManager.encrypt(backupData.toString('base64'), password);
        finalBackupData = Buffer.from(JSON.stringify(encrypted));
      } else {
        finalBackupData = backupData;
      }

      // Write backup file
      await fs.writeFile(backupPath, finalBackupData);

      // Update status
      this.status.lastBackupTime = new Date();
      this.status.backupSize = finalBackupData.length;
      this.status.backupCount++;
      this.calculateNextBackupTime();

      // Clean old backups
      await this.cleanOldBackups();

      console.log(`Backup created successfully: ${backupPath}`);
      return backupPath;
    } catch (error) {
      console.error('Backup failed:', error);
      throw error;
    } finally {
      this.status.isBackingUp = false;
    }
  }

  private async createBackupArchive(vaultPath: string): Promise<Buffer> {
    // This is a simplified backup implementation
    // In a real implementation, you would use a proper archiving library like 'archiver'
    
    const files: { path: string; content: string }[] = [];
    
    // Recursively read all files in the vault
    await this.readDirectoryRecursive(vaultPath, files);
    
    // Create a simple JSON backup (in real implementation, use proper ZIP)
    const backupData = {
      timestamp: new Date().toISOString(),
      vaultPath,
      files,
      metadata: {
        totalFiles: files.length,
        includeAttachments: this.config.includeAttachments
      }
    };

    return Buffer.from(JSON.stringify(backupData, null, 2));
  }

  private async readDirectoryRecursive(dirPath: string, files: { path: string; content: string }[]): Promise<void> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          await this.readDirectoryRecursive(fullPath, files);
        } else if (entry.isFile()) {
          // Skip attachments if not included
          if (!this.config.includeAttachments && this.isAttachment(entry.name)) {
            continue;
          }
          
          try {
            const content = await fs.readFile(fullPath, 'utf8');
            const relativePath = path.relative(dirPath, fullPath);
            files.push({
              path: relativePath,
              content
            });
          } catch (error) {
            console.warn(`Failed to read file: ${fullPath}`, error);
          }
        }
      }
    } catch (error) {
      console.error(`Failed to read directory: ${dirPath}`, error);
    }
  }

  private isAttachment(filename: string): boolean {
    const attachmentExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.pdf', '.mp3', '.mp4', '.wav'];
    const ext = path.extname(filename).toLowerCase();
    return attachmentExtensions.includes(ext);
  }

  async restoreBackup(backupPath: string, targetPath: string, password?: string): Promise<void> {
    try {
      // Read backup file
      const backupData = await fs.readFile(backupPath);
      
      // Decrypt if password provided
      let decryptedData: string;
      if (password) {
        const encrypted = JSON.parse(backupData.toString());
        const decrypted = await this.encryptionManager.decrypt(encrypted.encrypted, password);
        decryptedData = decrypted;
      } else {
        decryptedData = backupData.toString();
      }

      // Parse backup data
      const backup = JSON.parse(decryptedData);
      
      // Create target directory
      await fs.mkdir(targetPath, { recursive: true });
      
      // Restore files
      for (const file of backup.files) {
        const filePath = path.join(targetPath, file.path);
        const dirPath = path.dirname(filePath);
        
        // Create directory if it doesn't exist
        await fs.mkdir(dirPath, { recursive: true });
        
        // Write file
        await fs.writeFile(filePath, file.content);
      }

      console.log(`Backup restored successfully to: ${targetPath}`);
    } catch (error) {
      console.error('Backup restore failed:', error);
      throw error;
    }
  }

  private async cleanOldBackups(): Promise<void> {
    if (this.config.retentionDays <= 0) return;

    try {
      const files = await fs.readdir(this.config.backupPath);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);

      for (const file of files) {
        if (file.startsWith('backup-') && file.endsWith('.zip')) {
          const filePath = path.join(this.config.backupPath, file);
          const stats = await fs.stat(filePath);
          
          if (stats.mtime < cutoffDate) {
            await fs.unlink(filePath);
            console.log(`Deleted old backup: ${file}`);
          }
        }
      }
    } catch (error) {
      console.error('Failed to clean old backups:', error);
    }
  }

  private calculateNextBackupTime(): void {
    if (!this.status.lastBackupTime) return;

    const nextBackup = new Date(this.status.lastBackupTime);
    
    switch (this.config.frequency) {
      case 'daily':
        nextBackup.setDate(nextBackup.getDate() + 1);
        break;
      case 'weekly':
        nextBackup.setDate(nextBackup.getDate() + 7);
        break;
      case 'monthly':
        nextBackup.setMonth(nextBackup.getMonth() + 1);
        break;
    }

    this.status.nextBackupTime = nextBackup;
  }

  getStatus(): BackupStatus {
    return { ...this.status };
  }

  getConfig(): BackupConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<BackupConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  async listBackups(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.config.backupPath);
      return files.filter(file => file.startsWith('backup-') && file.endsWith('.zip'));
    } catch (error) {
      console.error('Failed to list backups:', error);
      return [];
    }
  }
}

export const createBackupManager = (config: BackupConfig, encryptionManager: EncryptionManager): BackupManager => {
  return new BackupManager(config, encryptionManager);
}; 