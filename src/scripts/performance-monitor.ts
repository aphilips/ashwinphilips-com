/**
 * Performance Monitoring and Optimization
 *
 * Tracks Core Web Vitals and provides performance insights.
 * Optional lightweight monitoring for production.
 */

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observer: PerformanceObserver | null = null;

  constructor() {
    if (typeof window === 'undefined') return;
    this.init();
  }

  private init(): void {
    // Measure Time to First Byte
    this.measureTTFB();

    // Observe paint timing
    this.observePaintTiming();

    // Observe layout shifts
    this.observeLayoutShift();

    // Observe largest contentful paint
    this.observeLCP();

    // Log metrics on page unload (optional)
    if (import.meta.env.DEV) {
      window.addEventListener('beforeunload', () => this.logMetrics());
    }
  }

  private measureTTFB(): void {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
    }
  }

  private observePaintTiming(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
          }
        }
      });

      observer.observe({ entryTypes: ['paint'] });
    } catch (e) {
      // Browser doesn't support Performance Observer
    }
  }

  private observeLayoutShift(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        let cls = 0;
        for (const entry of list.getEntries()) {
          if ((entry as any).hadRecentInput) continue;
          cls += (entry as any).value;
        }
        this.metrics.cls = cls;
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // Browser doesn't support Layout Shift
    }
  }

  private observeLCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observer = observer;
    } catch (e) {
      // Browser doesn't support LCP
    }
  }

  private logMetrics(): void {
    console.group('🎯 Performance Metrics');
    console.log('TTFB:', this.metrics.ttfb?.toFixed(2), 'ms');
    console.log('FCP:', this.metrics.fcp?.toFixed(2), 'ms');
    console.log('LCP:', this.metrics.lcp?.toFixed(2), 'ms');
    console.log('CLS:', this.metrics.cls?.toFixed(4));
    console.groupEnd();

    // Performance budget warnings
    if (this.metrics.lcp && this.metrics.lcp > 2500) {
      console.warn('⚠️ LCP is above 2.5s - consider optimizing largest content');
    }

    if (this.metrics.cls && this.metrics.cls > 0.1) {
      console.warn('⚠️ CLS is above 0.1 - reduce layout shifts');
    }

    if (this.metrics.fcp && this.metrics.fcp > 1800) {
      console.warn('⚠️ FCP is above 1.8s - optimize critical rendering path');
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

// Lazy Loading Images with Intersection Observer
class LazyImageLoader {
  private observer: IntersectionObserver | null = null;
  private images: Set<HTMLImageElement> = new Set();

  constructor() {
    if (typeof window === 'undefined') return;
    this.init();
  }

  private init(): void {
    // Create Intersection Observer
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
            this.observer?.unobserve(img);
            this.images.delete(img);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01
      }
    );

    // Observe all images with data-src
    this.observeImages();
  }

  private observeImages(): void {
    const images = document.querySelectorAll<HTMLImageElement>('img[data-src]');
    images.forEach((img) => {
      this.images.add(img);
      this.observer?.observe(img);
    });
  }

  private loadImage(img: HTMLImageElement): void {
    const src = img.dataset.src;
    if (src) {
      // Add fade-in class
      img.classList.add('fade-in-lazy');

      img.onload = () => {
        img.classList.add('visible');
        img.removeAttribute('data-src');
      };

      img.src = src;
    }
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.images.clear();
  }
}

// Initialize in development mode only
let perfMonitor: PerformanceMonitor | null = null;
let lazyLoader: LazyImageLoader | null = null;

function initPerformanceMonitoring() {
  // Always enable lazy loading
  lazyLoader = new LazyImageLoader();

  // Only enable performance monitoring in dev
  if (import.meta.env.DEV) {
    perfMonitor = new PerformanceMonitor();
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPerformanceMonitoring);
} else {
  initPerformanceMonitoring();
}

// Re-initialize on Astro page transitions
document.addEventListener('astro:page-load', initPerformanceMonitoring);

// Cleanup on page unload
document.addEventListener('astro:before-preparation', () => {
  if (perfMonitor) {
    perfMonitor.destroy();
    perfMonitor = null;
  }

  if (lazyLoader) {
    lazyLoader.destroy();
    lazyLoader = null;
  }
});

// Export for manual access if needed
export { PerformanceMonitor, LazyImageLoader };
