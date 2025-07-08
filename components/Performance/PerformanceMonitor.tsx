'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Cpu, 
  HardDrive, 
  Network, 
  Clock,
  Settings,
  RefreshCw
} from 'lucide-react';
import { PerformanceMetrics, PerformanceAlert } from '@/lib/performance/types';

interface PerformanceMonitorProps {
  metrics: PerformanceMetrics[];
  alerts: PerformanceAlert[];
  onRefresh: () => void;
  onSettings: () => void;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  metrics,
  alerts,
  onRefresh,
  onSettings
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const latestMetrics = metrics[metrics.length - 1];
  const activeAlerts = alerts.filter(alert => !alert.resolved);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  const getStatusColor = (value: number, threshold: number) => {
    if (value >= threshold) return 'text-red-600';
    if (value >= threshold * 0.8) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusIcon = (value: number, threshold: number) => {
    if (value >= threshold) return <AlertTriangle className="h-4 w-4 text-red-600" />;
    if (value >= threshold * 0.8) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <CheckCircle className="h-4 w-4 text-green-600" />;
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('ko-KR');
  };

  if (!latestMetrics) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-gray-500">성능 데이터를 불러오는 중...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <h2 className="text-xl font-semibold">성능 모니터링</h2>
          <Badge variant="outline">
            {activeAlerts.length}개 알림
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
          <Button variant="outline" size="sm" onClick={onSettings}>
            <Settings className="h-4 w-4 mr-2" />
            설정
          </Button>
        </div>
      </div>

      {/* 실시간 메트릭 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 메모리 사용량 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-4 w-4" />
                <span>메모리 사용량</span>
              </div>
              {getStatusIcon(latestMetrics.memoryUsage, 80)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              <span className={getStatusColor(latestMetrics.memoryUsage, 80)}>
                {latestMetrics.memoryUsage.toFixed(1)}%
              </span>
            </div>
            <Progress value={latestMetrics.memoryUsage} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              임계값: 80%
            </p>
          </CardContent>
        </Card>

        {/* CPU 사용량 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Cpu className="h-4 w-4" />
                <span>CPU 사용량</span>
              </div>
              {getStatusIcon(latestMetrics.cpuUsage, 70)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              <span className={getStatusColor(latestMetrics.cpuUsage, 70)}>
                {latestMetrics.cpuUsage.toFixed(1)}%
              </span>
            </div>
            <Progress value={latestMetrics.cpuUsage} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              임계값: 70%
            </p>
          </CardContent>
        </Card>

        {/* 네트워크 지연 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Network className="h-4 w-4" />
                <span>네트워크 지연</span>
              </div>
              {getStatusIcon(latestMetrics.networkLatency, 1000)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              <span className={getStatusColor(latestMetrics.networkLatency, 1000)}>
                {latestMetrics.networkLatency}ms
              </span>
            </div>
            <Progress value={Math.min(latestMetrics.networkLatency / 10, 100)} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              임계값: 1000ms
            </p>
          </CardContent>
        </Card>

        {/* 응답 시간 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>응답 시간</span>
              </div>
              {getStatusIcon(latestMetrics.responseTime, 1000)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              <span className={getStatusColor(latestMetrics.responseTime, 1000)}>
                {latestMetrics.responseTime}ms
              </span>
            </div>
            <Progress value={Math.min(latestMetrics.responseTime / 10, 100)} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              임계값: 1000ms
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 성능 알림 */}
      {activeAlerts.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">활성 알림</h3>
          <div className="space-y-3">
            {activeAlerts.map((alert) => (
              <Alert key={alert.id} className={getAlertSeverityColor(alert.severity)}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatTime(alert.timestamp)}
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {alert.severity}
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* 추가 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {latestMetrics.activeConnections}
              </div>
              <div className="text-sm text-gray-600">활성 연결</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {latestMetrics.errorRate.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-600">오류율</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {metrics.length}
              </div>
              <div className="text-sm text-gray-600">수집된 메트릭</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 마지막 업데이트 */}
      <div className="text-xs text-gray-500 text-center">
        마지막 업데이트: {formatTime(latestMetrics.timestamp)}
      </div>
    </div>
  );
}; 