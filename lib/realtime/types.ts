export interface WebSocketMessage {
  id: string;
  type: 'session_update' | 'note_sync' | 'user_activity' | 'collaboration' | 'notification';
  timestamp: Date;
  userId: string;
  data: any;
  metadata?: {
    sessionId?: string;
    notePath?: string;
    roomId?: string;
  };
}

export interface CollaborationSession {
  id: string;
  name: string;
  hostUserId: string;
  participants: CollaborationParticipant[];
  status: 'waiting' | 'active' | 'paused' | 'completed';
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  settings: CollaborationSettings;
}

export interface CollaborationParticipant {
  userId: string;
  username: string;
  role: 'host' | 'participant' | 'observer';
  joinedAt: Date;
  lastActivity: Date;
  status: 'online' | 'away' | 'offline';
  avatar?: string;
  currentActivity?: string;
}

export interface CollaborationSettings {
  maxParticipants: number;
  allowChat: boolean;
  allowScreenShare: boolean;
  allowNoteEditing: boolean;
  autoRecord: boolean;
  privacy: 'public' | 'private' | 'invite-only';
}

export interface RealTimeNote {
  id: string;
  path: string;
  content: string;
  version: number;
  lastModified: Date;
  lastModifiedBy: string;
  collaborators: string[];
  changes: NoteChange[];
}

export interface NoteChange {
  id: string;
  userId: string;
  timestamp: Date;
  type: 'insert' | 'delete' | 'format';
  position: number;
  length: number;
  content?: string;
  metadata?: any;
}

export interface UserActivity {
  userId: string;
  username: string;
  activity: 'reading' | 'writing' | 'editing' | 'idle';
  currentPage?: string;
  lastSeen: Date;
  sessionId?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  metadata?: any;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system' | 'file';
  attachments?: ChatAttachment[];
}

export interface ChatAttachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'audio';
  url: string;
  size: number;
}

export interface ScreenShare {
  id: string;
  userId: string;
  username: string;
  startedAt: Date;
  endedAt?: Date;
  streamUrl?: string;
  isActive: boolean;
}

export interface CollaborationRoom {
  id: string;
  name: string;
  description?: string;
  hostUserId: string;
  participants: CollaborationParticipant[];
  status: 'open' | 'closed' | 'full';
  maxParticipants: number;
  createdAt: Date;
  lastActivity: Date;
  tags: string[];
}

export interface RealTimeStats {
  activeUsers: number;
  activeSessions: number;
  totalCollaborations: number;
  systemLoad: number;
  networkLatency: number;
} 