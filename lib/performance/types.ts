export interface PerformanceMetrics {
  timestamp: Date;
  memoryUsage: number; // MB
  cpuUsage: number; // percentage
  networkLatency: number; // ms
  responseTime: number; // ms
  errorRate: number; // percentage
  activeConnections: number;
}

export interface CacheConfig {
  maxSize: number; // MB
  ttl: number; // seconds
  strategy: 'lru' | 'fifo' | 'lfu';
  enableCompression: boolean;
}

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  timestamp: Date;
  expiresAt: Date;
  accessCount: number;
  size: number; // bytes
}

export interface DatabaseOptimization {
  queryOptimization: boolean;
  indexOptimization: boolean;
  connectionPooling: boolean;
  queryCaching: boolean;
  batchOperations: boolean;
}

export interface NetworkOptimization {
  compression: boolean;
  minification: boolean;
  bundling: boolean;
  cdn: boolean;
  http2: boolean;
  caching: boolean;
}

export interface MonitoringConfig {
  enabled: boolean;
  interval: number; // seconds
  alertThresholds: {
    memoryUsage: number;
    cpuUsage: number;
    responseTime: number;
    errorRate: number;
  };
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export interface PerformanceAlert {
  id: string;
  type: 'memory' | 'cpu' | 'network' | 'error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  metrics: Partial<PerformanceMetrics>;
  resolved: boolean;
  resolvedAt?: Date;
}

export interface OptimizationReport {
  id: string;
  timestamp: Date;
  recommendations: OptimizationRecommendation[];
  implemented: string[];
  impact: {
    performance: number; // percentage improvement
    memory: number;
    network: number;
  };
}

export interface OptimizationRecommendation {
  id: string;
  type: 'cache' | 'database' | 'network' | 'code';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedImpact: number; // percentage
  implementationEffort: 'low' | 'medium' | 'high';
  status: 'pending' | 'implemented' | 'rejected';
}

export interface LazyLoadingConfig {
  enabled: boolean;
  threshold: number; // pixels from viewport
  batchSize: number;
  preloadDistance: number; // pixels
}

export interface VirtualScrollingConfig {
  enabled: boolean;
  itemHeight: number; // pixels
  bufferSize: number; // number of items
  overscan: number; // number of items
}

export interface ServiceWorkerConfig {
  enabled: boolean;
  cacheStrategy: 'cache-first' | 'network-first' | 'stale-while-revalidate';
  cacheName: string;
  version: string;
  updateInterval: number; // hours
}

export interface BundleAnalysis {
  totalSize: number; // bytes
  gzippedSize: number; // bytes
  modules: BundleModule[];
  chunks: BundleChunk[];
  optimization: BundleOptimization;
}

export interface BundleModule {
  name: string;
  size: number; // bytes
  gzippedSize: number; // bytes
  dependencies: string[];
}

export interface BundleChunk {
  name: string;
  size: number; // bytes
  modules: string[];
}

export interface BundleOptimization {
  treeShaking: boolean;
  codeSplitting: boolean;
  minification: boolean;
  compression: boolean;
  unusedCodeElimination: boolean;
} 