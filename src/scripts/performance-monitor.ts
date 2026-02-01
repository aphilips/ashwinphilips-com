/**
 * Performance Monitor - Track Core Web Vitals
 *
 * Monitors:
 * - LCP (Largest Contentful Paint)
 * - FID (First Input Delay)
 * - CLS (Cumulative Layout Shift)
 * - TTFB (Time to First Byte)
 * - FCP (First Contentful Paint)
 */

export {};

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

const metrics: PerformanceMetric[] = [];

// Thresholds based on Web Vitals standards
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 },
  FCP: { good: 1800, poor: 3000 }
};

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

function recordMetric(name: string, value: number) {
  const metric: PerformanceMetric = {
    name,
    value,
    rating: getRating(name, value),
    timestamp: Date.now()
  };

  metrics.push(metric);

  // Log to console in dev mode
  if (import.meta.env.DEV) {
    const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌';
    console.log(`${emoji} ${name}: ${value.toFixed(2)}ms (${metric.rating})`);
  }

  // Send to analytics endpoint (optional)
  sendToAnalytics(metric);
}

function sendToAnalytics(metric: PerformanceMetric) {
  // Only send in production
  if (import.meta.env.DEV) return;

  // Use sendBeacon for reliability (doesn't block page unload)
  if ('sendBeacon' in navigator) {
    const data = JSON.stringify({
      type: 'web-vital',
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
      url: window.location.pathname,
      timestamp: metric.timestamp,
      userAgent: navigator.userAgent
    });

    navigator.sendBeacon('/api/analytics/vitals', data);
  }
}

// Monitor LCP (Largest Contentful Paint)
function monitorLCP() {
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
      const value = lastEntry.renderTime || lastEntry.loadTime || 0;

      recordMetric('LCP', value);
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    console.warn('LCP monitoring not supported');
  }
}

// Monitor FID (First Input Delay)
function monitorFID() {
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        recordMetric('FID', entry.processingStart - entry.startTime);
      });
    });

    observer.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    console.warn('FID monitoring not supported');
  }
}

// Monitor CLS (Cumulative Layout Shift)
function monitorCLS() {
  try {
    let clsValue = 0;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
    });

    observer.observe({ type: 'layout-shift', buffered: true });

    // Report CLS on visibility change or page unload
    const reportCLS = () => {
      recordMetric('CLS', clsValue * 1000); // Convert to ms equivalent for consistency
    };

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        reportCLS();
      }
    });

    window.addEventListener('pagehide', reportCLS);
  } catch (e) {
    console.warn('CLS monitoring not supported');
  }
}

// Monitor TTFB (Time to First Byte)
function monitorTTFB() {
  try {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      recordMetric('TTFB', ttfb);
    }
  } catch (e) {
    console.warn('TTFB monitoring not supported');
  }
}

// Monitor FCP (First Contentful Paint)
function monitorFCP() {
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          recordMetric('FCP', entry.startTime);
        }
      });
    });

    observer.observe({ type: 'paint', buffered: true });
  } catch (e) {
    console.warn('FCP monitoring not supported');
  }
}

// Monitor custom navigation timing
function monitorNavigation() {
  if (!('navigation' in performance.getEntriesByType('navigation')[0])) return;

  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

  if (import.meta.env.DEV) {
    console.group('📊 Navigation Timing');
    console.log('DNS:', (nav.domainLookupEnd - nav.domainLookupStart).toFixed(2), 'ms');
    console.log('TCP:', (nav.connectEnd - nav.connectStart).toFixed(2), 'ms');
    console.log('Request:', (nav.responseStart - nav.requestStart).toFixed(2), 'ms');
    console.log('Response:', (nav.responseEnd - nav.responseStart).toFixed(2), 'ms');
    console.log('DOM Processing:', (nav.domInteractive - nav.responseEnd).toFixed(2), 'ms');
    console.log('DOM Complete:', (nav.domComplete - nav.domInteractive).toFixed(2), 'ms');
    console.groupEnd();
  }
}

// Initialize all monitors
function init() {
  // Wait for page to be interactive
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
    return;
  }

  // Start monitoring
  monitorLCP();
  monitorFID();
  monitorCLS();
  monitorTTFB();
  monitorFCP();
  monitorNavigation();

  // Export metrics for debugging
  if (import.meta.env.DEV) {
    (window as any).__webVitals = {
      getMetrics: () => metrics,
      getLatest: () => metrics[metrics.length - 1],
      getByName: (name: string) => metrics.filter(m => m.name === name)
    };
  }
}

// Run
init();

// Re-init on Astro page transitions
document.addEventListener('astro:page-load', init);
