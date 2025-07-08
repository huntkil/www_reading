export interface SyncConfig {
  vaultPath: string;
  syncInterval: number; // milliseconds
  autoBackup: boolean;
  encryptionEnabled: boolean;
  lastSyncTime?: Date;
}

export interface SyncStatus {
  isSyncing: boolean;
  lastSyncTime?: Date;
  syncErrors: string[];
  pendingChanges: number;
  totalNotes: number;
}

export interface BackupConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  retentionDays: number;
  backupPath: string;
  includeAttachments: boolean;
}

export interface BackupStatus {
  lastBackupTime?: Date;
  nextBackupTime?: Date;
  backupSize: number;
  backupCount: number;
  isBackingUp: boolean;
}

export interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  notePath: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  error?: string;
}

export interface ConflictResolution {
  notePath: string;
  localVersion: string;
  remoteVersion: string;
  resolution: 'local' | 'remote' | 'merge';
  mergedContent?: string;
}

export interface EncryptionConfig {
  enabled: boolean;
  algorithm: 'AES-256-GCM' | 'ChaCha20-Poly1305';
  keyDerivation: 'PBKDF2' | 'Argon2';
  iterations: number;
}

export interface UserSession {
  userId: string;
  sessionId: string;
  vaultPath: string;
  permissions: string[];
  lastActivity: Date;
  expiresAt: Date;
} 