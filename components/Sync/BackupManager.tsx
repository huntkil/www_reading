import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { BackupConfig, BackupStatus } from '@/lib/sync/types';
import { Save, Download, Upload, Settings, Shield, HardDrive } from 'lucide-react';

interface BackupManagerProps {
  config: BackupConfig;
  status: BackupStatus;
  onBackup: (password?: string) => Promise<void>;
  onRestore: (backupPath: string, password?: string) => Promise<void>;
  onConfigChange: (config: Partial<BackupConfig>) => void;
}

export const BackupManager: React.FC<BackupManagerProps> = ({
  config,
  status,
  onBackup,
  onRestore,
  onConfigChange
}) => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupPassword, setBackupPassword] = useState('');
  const [restorePassword, setRestorePassword] = useState('');
  const [selectedBackup, setSelectedBackup] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      await onBackup(backupPassword || undefined);
      setBackupPassword('');
    } catch (error) {
      console.error('Backup failed:', error);
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedBackup) return;
    
    setIsRestoring(true);
    try {
      await onRestore(selectedBackup, restorePassword || undefined);
      setRestorePassword('');
      setSelectedBackup('');
    } catch (error) {
      console.error('Restore failed:', error);
    } finally {
      setIsRestoring(false);
    }
  };

  const formatBackupSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatNextBackupTime = () => {
    if (!status.nextBackupTime) return '예약되지 않음';
    
    const now = new Date();
    const diff = status.nextBackupTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}일 후`;
    } else if (hours > 0) {
      return `${hours}시간 후`;
    } else {
      return '곧';
    }
  };

  return (
    <div className="space-y-6">
      {/* Backup Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5" />
              <CardTitle>백업 상태</CardTitle>
            </div>
            <Badge variant={status.isBackingUp ? "default" : "secondary"}>
              {status.isBackingUp ? '백업 중...' : '대기 중'}
            </Badge>
          </div>
          <CardDescription>
            데이터 백업 상태 및 설정을 관리하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">마지막 백업</div>
              <div className="text-lg font-semibold">
                {status.lastBackupTime ? 
                  new Date(status.lastBackupTime).toLocaleDateString() : 
                  '없음'
                }
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">다음 백업</div>
              <div className="text-lg font-semibold">{formatNextBackupTime()}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">백업 크기</div>
              <div className="text-lg font-semibold">{formatBackupSize(status.backupSize)}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">백업 개수</div>
              <div className="text-lg font-semibold">{status.backupCount}개</div>
            </div>
          </div>

          {status.isBackingUp && (
            <div className="space-y-2">
              <div className="text-sm">백업 진행 중...</div>
              <Progress value={50} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backup Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Save className="h-5 w-5" />
            <CardTitle>백업 관리</CardTitle>
          </div>
          <CardDescription>
            수동 백업 생성 및 복원을 수행하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Manual Backup */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="backup-password">백업 암호 (선택사항)</Label>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              id="backup-password"
              type="password"
              placeholder="백업 파일을 암호화할 비밀번호를 입력하세요"
              value={backupPassword}
              onChange={(e) => setBackupPassword(e.target.value)}
            />
            <Button 
              onClick={handleBackup} 
              disabled={isBackingUp || !config.enabled}
              className="w-full"
            >
              {isBackingUp ? (
                <>
                  <Save className="h-4 w-4 mr-2 animate-spin" />
                  백업 중...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  백업 생성
                </>
              )}
            </Button>
          </div>

          {/* Restore Backup */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label htmlFor="restore-backup">백업 파일 선택</Label>
              <Download className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              id="restore-backup"
              type="file"
              accept=".zip"
              onChange={(e) => setSelectedBackup(e.target.files?.[0]?.name || '')}
            />
            <Input
              type="password"
              placeholder="백업 파일 암호 (있는 경우)"
              value={restorePassword}
              onChange={(e) => setRestorePassword(e.target.value)}
            />
            <Button 
              onClick={handleRestore} 
              disabled={isRestoring || !selectedBackup}
              variant="outline"
              className="w-full"
            >
              {isRestoring ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  복원 중...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  백업 복원
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <CardTitle>백업 설정</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? '간단히' : '고급'}
            </Button>
          </div>
          <CardDescription>
            자동 백업 설정을 구성하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>자동 백업</Label>
              <div className="text-sm text-muted-foreground">
                정기적인 자동 백업을 활성화합니다
              </div>
            </div>
            <Switch
              checked={config.enabled}
              onCheckedChange={(checked) => onConfigChange({ enabled: checked })}
            />
          </div>

          {config.enabled && (
            <>
              <div className="space-y-2">
                <Label>백업 빈도</Label>
                <Select
                  value={config.frequency}
                  onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                    onConfigChange({ frequency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">매일</SelectItem>
                    <SelectItem value="weekly">매주</SelectItem>
                    <SelectItem value="monthly">매월</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>보관 기간 (일)</Label>
                <Input
                  type="number"
                  min="1"
                  max="365"
                  value={config.retentionDays}
                  onChange={(e) => onConfigChange({ retentionDays: parseInt(e.target.value) })}
                />
              </div>

              {showAdvanced && (
                <>
                  <div className="space-y-2">
                    <Label>백업 경로</Label>
                    <Input
                      value={config.backupPath}
                      onChange={(e) => onConfigChange({ backupPath: e.target.value })}
                      placeholder="/path/to/backup"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>첨부파일 포함</Label>
                      <div className="text-sm text-muted-foreground">
                        이미지, 오디오 등 첨부파일을 백업에 포함합니다
                      </div>
                    </div>
                    <Switch
                      checked={config.includeAttachments}
                      onCheckedChange={(checked) => onConfigChange({ includeAttachments: checked })}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 