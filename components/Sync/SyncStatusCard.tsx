import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SyncStatus } from '@/lib/sync/types';
import { RefreshCw, CheckCircle, AlertCircle, Clock, Database } from 'lucide-react';

interface SyncStatusCardProps {
  status: SyncStatus;
  onSync: () => void;
  onStop: () => void;
}

export const SyncStatusCard: React.FC<SyncStatusCardProps> = ({
  status,
  onSync,
  onStop
}) => {
  const getStatusIcon = () => {
    if (status.isSyncing) {
      return <RefreshCw className="h-4 w-4 animate-spin" />;
    }
    if (status.syncErrors.length > 0) {
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
    if (status.lastSyncTime) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    return <Clock className="h-4 w-4 text-muted-foreground" />;
  };

  const getStatusText = () => {
    if (status.isSyncing) {
      return '동기화 중...';
    }
    if (status.syncErrors.length > 0) {
      return '동기화 오류';
    }
    if (status.lastSyncTime) {
      return '동기화 완료';
    }
    return '동기화 대기 중';
  };

  const getStatusColor = () => {
    if (status.isSyncing) {
      return 'bg-blue-100 text-blue-800';
    }
    if (status.syncErrors.length > 0) {
      return 'bg-red-100 text-red-800';
    }
    if (status.lastSyncTime) {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const formatLastSyncTime = () => {
    if (!status.lastSyncTime) return '없음';
    
    const now = new Date();
    const diff = now.getTime() - status.lastSyncTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}일 전`;
    } else if (hours > 0) {
      return `${hours}시간 전`;
    } else if (minutes > 0) {
      return `${minutes}분 전`;
    } else {
      return '방금 전';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <CardTitle className="text-lg">동기화 상태</CardTitle>
          </div>
          <Badge className={getStatusColor()}>
            {getStatusText()}
          </Badge>
        </div>
        <CardDescription>
          데이터 동기화 상태를 확인하세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Database className="h-4 w-4" />
              <span>총 노트 수</span>
            </div>
            <div className="text-2xl font-bold">{status.totalNotes.toLocaleString()}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>마지막 동기화</span>
            </div>
            <div className="text-sm font-medium">{formatLastSyncTime()}</div>
          </div>
        </div>

        {status.pendingChanges > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>대기 중인 변경사항</span>
              <span className="font-medium">{status.pendingChanges}개</span>
            </div>
            <Progress value={(status.pendingChanges / Math.max(status.totalNotes, 1)) * 100} />
          </div>
        )}

        {status.syncErrors.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-destructive">동기화 오류</div>
            <div className="space-y-1">
              {status.syncErrors.slice(0, 3).map((error, index) => (
                <div key={index} className="text-xs text-destructive bg-red-50 p-2 rounded">
                  {error}
                </div>
              ))}
              {status.syncErrors.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  외 {status.syncErrors.length - 3}개의 오류 더...
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Button
            onClick={onSync}
            disabled={status.isSyncing}
            className="flex-1"
          >
            {status.isSyncing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                동기화 중...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                동기화 시작
              </>
            )}
          </Button>
          {status.isSyncing && (
            <Button
              variant="outline"
              onClick={onStop}
              className="flex-1"
            >
              중지
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 