import { WebSocketMessage, UserActivity, Notification } from './types';

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageQueue: WebSocketMessage[] = [];
  private eventListeners: Map<string, Function[]> = new Map();
  private isConnected = false;
  private userId: string;
  private url: string;

  constructor(url: string, userId: string) {
    this.url = url;
    this.userId = userId;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(`${this.url}?userId=${this.userId}`);
        
        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.processMessageQueue();
          this.emit('connected');
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.isConnected = false;
          this.emit('disconnected', event);
          
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.emit('error', error);
          reject(error);
        };

      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'User disconnected');
      this.ws = null;
    }
    this.isConnected = false;
  }

  send(message: Omit<WebSocketMessage, 'id' | 'timestamp'>): void {
    const fullMessage: WebSocketMessage = {
      ...message,
      id: this.generateMessageId(),
      timestamp: new Date()
    };

    if (this.isConnected && this.ws) {
      this.ws.send(JSON.stringify(fullMessage));
    } else {
      this.messageQueue.push(fullMessage);
    }
  }

  sendSessionUpdate(sessionId: string, data: any): void {
    this.send({
      type: 'session_update',
      userId: this.userId,
      data,
      metadata: { sessionId }
    });
  }

  sendNoteSync(notePath: string, data: any): void {
    this.send({
      type: 'note_sync',
      userId: this.userId,
      data,
      metadata: { notePath }
    });
  }

  sendUserActivity(activity: UserActivity): void {
    this.send({
      type: 'user_activity',
      userId: this.userId,
      data: activity
    });
  }

  sendCollaborationMessage(roomId: string, data: any): void {
    this.send({
      type: 'collaboration',
      userId: this.userId,
      data,
      metadata: { roomId }
    });
  }

  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'session_update':
        this.emit('sessionUpdate', message);
        break;
      case 'note_sync':
        this.emit('noteSync', message);
        break;
      case 'user_activity':
        this.emit('userActivity', message);
        break;
      case 'collaboration':
        this.emit('collaboration', message);
        break;
      case 'notification':
        this.emit('notification', message);
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  private processMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message && this.ws) {
        this.ws.send(JSON.stringify(message));
      }
    }
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      if (!this.isConnected) {
        this.connect().catch(error => {
          console.error('Reconnect failed:', error);
        });
      }
    }, delay);
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getConnectionStatus(): { isConnected: boolean; reconnectAttempts: number } {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  // 유틸리티 메서드들
  updateUserActivity(activity: Partial<UserActivity>): void {
    const userActivity: UserActivity = {
      userId: this.userId,
      username: '', // 실제 구현에서는 사용자 정보에서 가져옴
      activity: 'idle',
      lastSeen: new Date(),
      ...activity
    };
    this.sendUserActivity(userActivity);
  }

  sendNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    this.send({
      type: 'notification',
      userId: this.userId,
      data: notification
    });
  }
}

export const createWebSocketManager = (url: string, userId: string): WebSocketManager => {
  return new WebSocketManager(url, userId);
}; 