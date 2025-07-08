import { 
  User, 
  AuthSession, 
  LoginCredentials, 
  RegisterData, 
  PasswordResetRequest, 
  PasswordResetConfirm,
} from './types';
import { EncryptionManager } from '../sync/encryption';

export class AuthService {
  private encryptionManager: EncryptionManager;
  private users: Map<string, User> = new Map();
  private sessions: Map<string, AuthSession> = new Map();
  private resetTokens: Map<string, { email: string; expiresAt: Date }> = new Map();

  constructor(encryptionManager: EncryptionManager) {
    this.encryptionManager = encryptionManager;
    this.loadUsers();
  }

  async login(credentials: LoginCredentials): Promise<{ user: User; session: AuthSession }> {
    const user = this.findUserByUsername(credentials.username);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // In a real implementation, you would verify against hashed password
    // For now, we'll use a simple check
    const isValidPassword = await this.verifyPassword(credentials.password, user.id);
    if (!isValidPassword) {
      throw new Error('비밀번호가 올바르지 않습니다.');
    }

    // Create session
    const session = await this.createSession(user.id, credentials.rememberMe || false);
    
    // Update last login
    user.lastLoginAt = new Date();
    this.users.set(user.id, user);
    this.saveUsers();

    return { user, session };
  }

  async register(data: RegisterData): Promise<{ user: User; session: AuthSession }> {
    // Validate input
    if (data.password !== data.confirmPassword) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    if (this.findUserByUsername(data.username)) {
      throw new Error('이미 사용 중인 사용자명입니다.');
    }

    if (this.findUserByEmail(data.email)) {
      throw new Error('이미 사용 중인 이메일입니다.');
    }

    // Create user
    const user: User = {
      id: this.generateUserId(),
      username: data.username,
      email: data.email,
      vaultPath: data.vaultPath,
      createdAt: new Date(),
      preferences: {
        theme: 'system',
        language: 'ko',
        syncInterval: 300000, // 5 minutes
        autoBackup: true,
        notifications: {
          email: true,
          push: true,
          sessionReminders: true,
          progressUpdates: true,
          communityUpdates: true
        }
      },
      permissions: ['user'] // Default permissions
    };

    // Hash and store password
    await this.hashAndStorePassword(data.password, user.id);

    // Save user
    this.users.set(user.id, user);
    this.saveUsers();

    // Create session
    const session = await this.createSession(user.id, false);

    return { user, session };
  }

  async logout(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
    this.saveSessions();
  }

  async validateSession(token: string): Promise<AuthSession | null> {
    const session = this.findSessionByToken(token);
    if (!session) {
      return null;
    }

    if (session.expiresAt < new Date()) {
      this.sessions.delete(session.id);
      this.saveSessions();
      return null;
    }

    // Update last activity
    session.lastActivity = new Date();
    this.sessions.set(session.id, session);
    this.saveSessions();

    return session;
  }

  async resetPassword(request: PasswordResetRequest): Promise<void> {
    const user = this.findUserByEmail(request.email);
    if (!user) {
      // Don't reveal if email exists or not
      return;
    }

    const token = this.encryptionManager.generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

    this.resetTokens.set(token, {
      email: request.email,
      expiresAt
    });

    this.saveResetTokens();

    // In a real implementation, send email with reset link
    console.log(`Password reset token for ${request.email}: ${token}`);
  }

  async confirmPasswordReset(data: PasswordResetConfirm): Promise<void> {
    const resetData = this.resetTokens.get(data.token);
    if (!resetData || resetData.expiresAt < new Date()) {
      throw new Error('유효하지 않거나 만료된 토큰입니다.');
    }

    if (data.newPassword !== data.confirmPassword) {
      throw new Error('새 비밀번호가 일치하지 않습니다.');
    }

    const user = this.findUserByEmail(resetData.email);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // Update password
    await this.hashAndStorePassword(data.newPassword, user.id);

    // Remove reset token
    this.resetTokens.delete(data.token);
    this.saveResetTokens();

    // Invalidate all sessions for this user
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.userId === user.id) {
        this.sessions.delete(sessionId);
      }
    }
    this.saveSessions();
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const updatedUser = { ...user, ...updates };
    this.users.set(userId, updatedUser);
    this.saveUsers();

    return updatedUser;
  }

  private async createSession(userId: string, rememberMe: boolean): Promise<AuthSession> {
    const session: AuthSession = {
      id: this.generateSessionId(),
      userId,
      token: this.encryptionManager.generateSessionToken(),
      createdAt: new Date(),
      lastActivity: new Date(),
      expiresAt: new Date(Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)), // 30 days or 1 day
      userAgent: 'web', // In real implementation, get from request
      ipAddress: '127.0.0.1' // In real implementation, get from request
    };

    this.sessions.set(session.id, session);
    this.saveSessions();

    return session;
  }

  private findUserByUsername(username: string): User | undefined {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  private findUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  private findSessionByToken(token: string): AuthSession | undefined {
    return Array.from(this.sessions.values()).find(session => session.token === token);
  }

  private async verifyPassword(password: string, userId: string): Promise<boolean> {
    // In a real implementation, you would verify against stored hash
    // For now, use a simple check
    const storedHash = localStorage.getItem(`password_${userId}`);
    if (!storedHash) {
      return false;
    }

    // This is a simplified check - in real implementation use proper password verification
    return password === 'password123'; // Demo password
  }

  private async hashAndStorePassword(password: string, userId: string): Promise<void> {
    const { hash, salt } = this.encryptionManager.hashPassword(password);
    // In a real implementation, store hash and salt securely
    localStorage.setItem(`password_${userId}`, hash);
    localStorage.setItem(`salt_${userId}`, salt);
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadUsers(): void {
    try {
      const usersData = localStorage.getItem('users');
      if (usersData) {
        const users = JSON.parse(usersData);
        this.users = new Map(Object.entries(users));
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }

  private saveUsers(): void {
    try {
      const usersData = Object.fromEntries(this.users);
      localStorage.setItem('users', JSON.stringify(usersData));
    } catch (error) {
      console.error('Failed to save users:', error);
    }
  }

  private saveSessions(): void {
    try {
      const sessionsData = Object.fromEntries(this.sessions);
      localStorage.setItem('sessions', JSON.stringify(sessionsData));
    } catch (error) {
      console.error('Failed to save sessions:', error);
    }
  }

  private saveResetTokens(): void {
    try {
      const tokensData = Object.fromEntries(this.resetTokens);
      localStorage.setItem('resetTokens', JSON.stringify(tokensData));
    } catch (error) {
      console.error('Failed to save reset tokens:', error);
    }
  }
}

export const createAuthService = (encryptionManager: EncryptionManager): AuthService => {
  return new AuthService(encryptionManager);
}; 