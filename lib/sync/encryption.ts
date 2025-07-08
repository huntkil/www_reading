import crypto from 'crypto';

export interface EncryptionConfig {
  algorithm: 'AES-256-GCM' | 'ChaCha20-Poly1305';
  keyLength: number;
  saltLength: number;
  iterations: number;
}

export class EncryptionManager {
  private config: EncryptionConfig;
  private key?: Buffer;

  constructor(config?: Partial<EncryptionConfig>) {
    this.config = {
      algorithm: 'AES-256-GCM',
      keyLength: 32,
      saltLength: 16,
      iterations: 100000,
      ...config
    };
  }

  async deriveKey(password: string, salt: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, this.config.iterations, 32, 'sha256', (err, key) => {
        if (err) reject(err);
        else resolve(key);
      });
    });
  }

  async encrypt(data: string, password: string): Promise<string> {
    const salt = crypto.randomBytes(this.config.saltLength);
    const iv = crypto.randomBytes(12);
    const key = await this.deriveKey(password, salt);

    if (this.config.algorithm === 'AES-256-GCM') {
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      cipher.setAAD(Buffer.from('subvocalization-coaching', 'utf8'));
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    } else {
      // ChaCha20-Poly1305 implementation
      const cipher = crypto.createCipheriv('chacha20-poly1305', key, iv);
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    }
  }

  async decrypt(encryptedData: string, password: string): Promise<string> {
    try {
      const data = Buffer.from(encryptedData, 'base64');
      // ... (기존 로직)
      let decrypted = '';
      // ... (복호화 로직)
      return decrypted;
    } catch (error) {
      throw new Error('Failed to decrypt data');
    }
  }

  generateSecurePassword(length: number = 32): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(crypto.randomInt(charset.length));
    }
    return password;
  }

  hashPassword(password: string): { hash: string; salt: string } {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return { hash, salt };
  }

  verifyPassword(password: string, hash: string, salt: string): boolean {
    const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(verifyHash, 'hex'));
  }

  generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  validateSessionToken(token: string): boolean {
    return /^[a-f0-9]{64}$/.test(token);
  }
}

export const createEncryptionManager = (config: EncryptionConfig): EncryptionManager => {
  return new EncryptionManager(config);
}; 