/**
 * =================================================================
 * SHARED TYPES
 * =================================================================
 * 이 파일은 애플리케이션 전체에서 공유되는 TypeScript 타입들을 정의합니다.
 * 중복을 피하고 일관성을 유지하기 위해 이곳에서 타입을 관리합니다.
 */

// From app/page.tsx
export interface DashboardStats {
  totalSessions: number;
  avgWpm: number;
  totalHours: number;
}

// From app/page.tsx & components/Dashboard/ProgressChart.tsx
export interface Session {
  id: string;
  createdAt: string;
  readingSpeed: number;
  [key: string]: any;
}

// From components/Training/TrainingModal.tsx
export interface TrainingPlan {
  title: string;
  targetWpm: number;
  duration: number;
  content: string;
}

// From components/Community/types.ts - 개인 기록용으로 단순화
export interface Comment {
  id: string;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  content: string;
  createdAt: string;
  comments: Comment[];
  _count: {
    likes: number;
    comments: number;
  };
  likedByMe: boolean;
} 