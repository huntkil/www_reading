import {
  PerformanceMetrics,
  CacheConfig,
  CacheEntry,
  MonitoringConfig,
  PerformanceAlert,
  OptimizationReport,
  OptimizationRecommendation,
  LazyLoadingConfig,
  VirtualScrollingConfig,
  ServiceWorkerConfig
} from './types';

export class PerformanceOptimizer {
  private cache: Map<string, CacheEntry> = new Map();
  private cacheConfig: CacheConfig;
  private monitoringConfig: MonitoringConfig;
  private metrics: PerformanceMetrics[] = [];
  private alerts: PerformanceAlert[] = [];
  private monitoringInterval?: NodeJS.Timeout;

  constructor(cacheConfig?: Partial<CacheConfig>, monitoringConfig?: Partial<MonitoringConfig>) {
    this.cacheConfig = {
      maxSize: 100, // 100MB
      ttl: 3600, // 1 hour
      strategy: 'lru',
      enableCompression: true,
      ...cacheConfig
    };

    this.monitoringConfig = {
      enabled: true,
      interval: 30, // 30 seconds
      alertThresholds: {
        memoryUsage: 80, // 80%
        cpuUsage: 70, // 70%
        responseTime: 1000, // 1 second
        errorRate: 5 // 5%
      },
      logLevel: 'info',
      ...monitoringConfig
    };

    if (this.monitoringConfig.enabled) {
      this.startMonitoring();
    }
  }

  // 캐시 관리
  setCache(key: string, value: any, ttl?: number): void {
    const expiresAt = new Date(Date.now() + (ttl || this.cacheConfig.ttl) * 1000);
    const size = this.calculateSize(value);
    
    const entry: CacheEntry = {
      key,
      value,
      timestamp: new Date(),
      expiresAt,
      accessCount: 0,
      size
    };

    // 캐시 크기 제한 확인
    if (this.getCacheSize() + size > this.cacheConfig.maxSize * 1024 * 1024) {
      this.evictCache();
    }

    this.cache.set(key, entry);
  }

  getCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // 만료 확인
    if (new Date() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // 접근 횟수 증가
    entry.accessCount++;
    entry.timestamp = new Date();

    return entry.value as T;
  }

  clearCache(): void {
    this.cache.clear();
  }

  // 성능 모니터링
  startMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
      this.checkAlerts();
    }, this.monitoringConfig.interval * 1000);
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
  }

  private collectMetrics(): void {
    const metrics: PerformanceMetrics = {
      timestamp: new Date(),
      memoryUsage: this.getMemoryUsage(),
      cpuUsage: this.getCpuUsage(),
      networkLatency: this.getNetworkLatency(),
      responseTime: this.getResponseTime(),
      errorRate: this.getErrorRate(),
      activeConnections: this.getActiveConnections()
    };

    this.metrics.push(metrics);
    
    // 메트릭 히스토리 제한 (최근 1000개만 유지)
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  private checkAlerts(): void {
    if (this.metrics.length === 0) return;

    const latestMetrics = this.metrics[this.metrics.length - 1];
    const thresholds = this.monitoringConfig.alertThresholds;

    // 메모리 사용량 알림
    if (latestMetrics.memoryUsage > thresholds.memoryUsage) {
      this.createAlert('memory', 'high', `메모리 사용량이 ${latestMetrics.memoryUsage}%로 임계값을 초과했습니다.`);
    }

    // CPU 사용량 알림
    if (latestMetrics.cpuUsage > thresholds.cpuUsage) {
      this.createAlert('cpu', 'high', `CPU 사용량이 ${latestMetrics.cpuUsage}%로 임계값을 초과했습니다.`);
    }

    // 응답 시간 알림
    if (latestMetrics.responseTime > thresholds.responseTime) {
      this.createAlert('network', 'medium', `응답 시간이 ${latestMetrics.responseTime}ms로 임계값을 초과했습니다.`);
    }

    // 오류율 알림
    if (latestMetrics.errorRate > thresholds.errorRate) {
      this.createAlert('error', 'critical', `오류율이 ${latestMetrics.errorRate}%로 임계값을 초과했습니다.`);
    }
  }

  private createAlert(type: PerformanceAlert['type'], severity: PerformanceAlert['severity'], message: string): void {
    const alert: PerformanceAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      message,
      timestamp: new Date(),
      metrics: this.metrics[this.metrics.length - 1],
      resolved: false
    };

    this.alerts.push(alert);
    this.logAlert(alert);
  }

  // 최적화 추천 생성
  generateOptimizationRecommendations(): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    // 캐시 최적화 추천
    if (this.getCacheHitRate() < 0.7) {
      recommendations.push({
        id: `rec_${Date.now()}_1`,
        type: 'cache',
        title: '캐시 전략 개선',
        description: '캐시 적중률이 낮습니다. 캐시 전략을 개선하여 성능을 향상시킬 수 있습니다.',
        priority: 'medium',
        estimatedImpact: 15,
        implementationEffort: 'low',
        status: 'pending'
      });
    }

    // 메모리 최적화 추천
    const avgMemoryUsage = this.getAverageMemoryUsage();
    if (avgMemoryUsage > 70) {
      recommendations.push({
        id: `rec_${Date.now()}_2`,
        type: 'code',
        title: '메모리 사용량 최적화',
        description: '평균 메모리 사용량이 높습니다. 메모리 누수나 비효율적인 메모리 사용을 확인해보세요.',
        priority: 'high',
        estimatedImpact: 25,
        implementationEffort: 'medium',
        status: 'pending'
      });
    }

    // 네트워크 최적화 추천
    const avgResponseTime = this.getAverageResponseTime();
    if (avgResponseTime > 500) {
      recommendations.push({
        id: `rec_${Date.now()}_3`,
        type: 'network',
        title: '네트워크 응답 시간 개선',
        description: '평균 응답 시간이 느립니다. 네트워크 최적화를 통해 사용자 경험을 개선할 수 있습니다.',
        priority: 'high',
        estimatedImpact: 30,
        implementationEffort: 'medium',
        status: 'pending'
      });
    }

    return recommendations;
  }

  // 최적화 보고서 생성
  generateOptimizationReport(): OptimizationReport {
    const recommendations = this.generateOptimizationRecommendations();
    const implemented = this.alerts
      .filter(alert => alert.resolved)
      .map(alert => alert.id);

    const impact = this.calculateOptimizationImpact();

    return {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      recommendations,
      implemented,
      impact
    };
  }

  // 지연 로딩 설정
  configureLazyLoading(config: Partial<LazyLoadingConfig>): LazyLoadingConfig {
    const defaultConfig: LazyLoadingConfig = {
      enabled: true,
      threshold: 100,
      batchSize: 10,
      preloadDistance: 200
    };

    return { ...defaultConfig, ...config };
  }

  // 가상 스크롤링 설정
  configureVirtualScrolling(config: Partial<VirtualScrollingConfig>): VirtualScrollingConfig {
    const defaultConfig: VirtualScrollingConfig = {
      enabled: true,
      itemHeight: 50,
      bufferSize: 20,
      overscan: 5
    };

    return { ...defaultConfig, ...config };
  }

  // 서비스 워커 설정
  configureServiceWorker(config: Partial<ServiceWorkerConfig>): ServiceWorkerConfig {
    const defaultConfig: ServiceWorkerConfig = {
      enabled: true,
      cacheStrategy: 'cache-first',
      cacheName: 'app-cache',
      version: '1.0.0',
      updateInterval: 24
    };

    return { ...defaultConfig, ...config };
  }

  // 유틸리티 메서드들
  private evictCache(): void {
    switch (this.cacheConfig.strategy) {
      case 'lru':
        this.evictLRU();
        break;
      case 'fifo':
        this.evictFIFO();
        break;
      case 'lfu':
        this.evictLFU();
        break;
    }
  }

  private evictLRU(): void {
    let oldestKey = '';
    let oldestTime = new Date();

    for (const [key, entry] of this.cache) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private evictFIFO(): void {
    const firstKey = this.cache.keys().next().value;
    if (firstKey) {
      this.cache.delete(firstKey);
    }
  }

  private evictLFU(): void {
    let leastUsedKey = '';
    let minAccessCount = Infinity;

    for (const [key, entry] of this.cache) {
      if (entry.accessCount < minAccessCount) {
        minAccessCount = entry.accessCount;
        leastUsedKey = key;
      }
    }

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
    }
  }

  private calculateSize(value: any): number {
    return new Blob([JSON.stringify(value)]).size;
  }

  private getCacheSize(): number {
    let totalSize = 0;
    for (const entry of this.cache.values()) {
      totalSize += entry.size;
    }
    return totalSize;
  }

  private getCacheHitRate(): number {
    // 실제 구현에서는 캐시 히트/미스 통계 필요
    return 0.8;
  }

  private getMemoryUsage(): number {
    // 브라우저 환경에서는 performance.memory 사용
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory;
      return (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
    }
    return Math.random() * 50 + 20; // 임시 구현
  }

  private getCpuUsage(): number {
    // 실제 구현에서는 CPU 사용량 측정 필요
    return Math.random() * 30 + 10; // 임시 구현
  }

  private getNetworkLatency(): number {
    // 실제 구현에서는 네트워크 지연 시간 측정 필요
    return Math.random() * 100 + 50; // 임시 구현
  }

  private getResponseTime(): number {
    // 실제 구현에서는 응답 시간 측정 필요
    return Math.random() * 200 + 100; // 임시 구현
  }

  private getErrorRate(): number {
    // 실제 구현에서는 오류율 측정 필요
    return Math.random() * 2; // 임시 구현
  }

  private getActiveConnections(): number {
    // 실제 구현에서는 활성 연결 수 측정 필요
    return Math.floor(Math.random() * 10) + 1; // 임시 구현
  }

  private getAverageMemoryUsage(): number {
    if (this.metrics.length === 0) return 0;
    const sum = this.metrics.reduce((acc, m) => acc + m.memoryUsage, 0);
    return sum / this.metrics.length;
  }

  private getAverageResponseTime(): number {
    if (this.metrics.length === 0) return 0;
    const sum = this.metrics.reduce((acc, m) => acc + m.responseTime, 0);
    return sum / this.metrics.length;
  }

  private calculateOptimizationImpact(): { performance: number; memory: number; network: number } {
    // 실제 구현에서는 최적화 효과 계산 필요
    return {
      performance: 15,
      memory: 20,
      network: 25
    };
  }

  private logAlert(alert: PerformanceAlert): void {
    const logMessage = `[${alert.severity.toUpperCase()}] ${alert.type}: ${alert.message}`;
    
    switch (this.monitoringConfig.logLevel) {
      case 'debug':
        console.debug(logMessage, alert);
        break;
      case 'info':
        console.info(logMessage);
        break;
      case 'warn':
        console.warn(logMessage);
        break;
      case 'error':
        console.error(logMessage);
        break;
    }
  }

  // 데이터 접근 메서드들
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  getCacheStats(): { size: number; entries: number; hitRate: number } {
    return {
      size: this.getCacheSize(),
      entries: this.cache.size,
      hitRate: this.getCacheHitRate()
    };
  }

  resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = new Date();
    }
  }
}

export const createPerformanceOptimizer = (
  cacheConfig?: Partial<CacheConfig>,
  monitoringConfig?: Partial<MonitoringConfig>
): PerformanceOptimizer => {
  return new PerformanceOptimizer(cacheConfig, monitoringConfig);
}; 