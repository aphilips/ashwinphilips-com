/**
 * Optimized Runtime - Lightweight performance features
 * - Scroll-driven depth effects (only if depth classes present)
 * - Performance monitoring (dev mode only)
 * Note: Image lazy loading handled by Astro's <Image> component
 */

// Lazy load scroll depth effects only if elements with depth classes exist
function initScrollDepth() {
  const depthElements = document.querySelectorAll('[class*="depth-"]');
  if (depthElements.length === 0) return;

  let rafId: number | null = null;
  const elements: Array<{el: HTMLElement, base: number}> = [];

  depthElements.forEach((el) => {
    const base = el.classList.contains('depth-primary') ? 1.2 :
                 el.classList.contains('depth-medium') ? 0.8 : 0.5;
    elements.push({ el: el as HTMLElement, base });
  });

  function update() {
    const vh = window.innerHeight;
    elements.forEach(({ el, base }) => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const dist = Math.abs(center - vh / 2) / vh;
      const intensity = dist * base;
      const layers = Math.ceil(base * 3);
      const shadows = [];

      for (let i = 0; i < layers; i++) {
        const y = (i + 1) * 2 * (1 + intensity);
        const b = (i + 1) * 4 * (1 + intensity);
        const a = 0.08 * (1 + intensity * 0.5);
        shadows.push(`0 ${y}px ${Math.min(b, 48)}px rgba(0,0,0,${a})`);
      }

      el.style.boxShadow = shadows.join(',');
      el.style.transform = `scale(${Math.max(0.95, 1 - intensity * 0.05)}) translateZ(0)`;
      el.style.opacity = `${Math.max(0.8, 1 - dist * 0.1)}`;
    });
    rafId = null;
  }

  function onScroll() {
    if (rafId === null) rafId = requestAnimationFrame(update);
  }

  // Reduced motion check
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }
}

// Performance monitoring only in dev
function initPerfMonitor() {
  if (!import.meta.env.DEV) return;

  const metrics: Record<string, number> = {};

  try {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (nav) metrics.ttfb = nav.responseStart - nav.requestStart;
  } catch {}

  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') metrics.fcp = entry.startTime;
      }
    }).observe({ entryTypes: ['paint'] });
  } catch {}

  window.addEventListener('beforeunload', () => {
    if (Object.keys(metrics).length > 0) {
      console.group('🎯 Performance');
      Object.entries(metrics).forEach(([k, v]) => console.log(`${k}:`, v.toFixed(2), 'ms'));
      console.groupEnd();
    }
  });
}

// Scroll progress indicator
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress') as HTMLElement | null;
  if (!progressBar) return;

  let rafId: number | null = null;
  const bar = progressBar; // Capture in closure for type narrowing

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
    rafId = null;
  }

  function onScroll() {
    if (rafId === null) rafId = requestAnimationFrame(updateProgress);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateProgress();
}

// Back to top button
function initBackToTop() {
  const btn = document.getElementById('back-to-top') as HTMLElement | null;
  if (!btn) return;

  const button = btn; // Capture in closure for type narrowing
  const showThreshold = 300;
  let rafId: number | null = null;

  function updateVisibility() {
    const isVisible = window.scrollY > showThreshold;
    if (isVisible) {
      button.classList.remove('opacity-0', 'invisible');
      button.classList.add('opacity-100', 'visible');
    } else {
      button.classList.remove('opacity-100', 'visible');
      button.classList.add('opacity-0', 'invisible');
    }
    rafId = null;
  }

  function onScroll() {
    if (rafId === null) rafId = requestAnimationFrame(updateVisibility);
  }

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  updateVisibility();
}

// Initialize only what's needed
function init() {
  initScrollDepth();
  initScrollProgress();
  initBackToTop();
  initPerfMonitor();
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Re-init on Astro page transitions
document.addEventListener('astro:page-load', init);
