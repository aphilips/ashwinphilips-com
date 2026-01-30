/**
 * WOW Performance - Makes the site feel instant and delightful
 *
 * Features:
 * - Prefetch on hover for instant navigation
 * - Optimistic UI updates
 * - Smooth micro-interactions
 * - Smart resource prioritization
 */

// Prefetch links on hover for instant navigation
function initPrefetch() {
  const prefetchedUrls = new Set<string>();
  let prefetchTimer: number | null = null;

  function prefetchLink(url: string) {
    if (prefetchedUrls.has(url)) return;
    prefetchedUrls.add(url);

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'document';
    document.head.appendChild(link);
  }

  // Prefetch on mouseenter (desktop) and touchstart (mobile)
  document.addEventListener('mouseenter', (e) => {
    const target = (e.target as HTMLElement).closest('a');
    if (!target) return;

    const href = target.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.includes('://')) return;

    // Delay slightly to avoid prefetching during fast mouse movements
    if (prefetchTimer) clearTimeout(prefetchTimer);
    prefetchTimer = window.setTimeout(() => prefetchLink(href), 100);
  }, { capture: true, passive: true });

  document.addEventListener('touchstart', (e) => {
    const target = (e.target as HTMLElement).closest('a');
    if (!target) return;

    const href = target.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.includes('://')) return;

    prefetchLink(href);
  }, { capture: true, passive: true });
}

// Add ripple effect to buttons/links for tactile feedback
function initRippleEffect() {
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('button, a, .clickable');
    if (!target || target.classList.contains('no-ripple')) return;

    const ripple = document.createElement('span');
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
    `;

    // Ensure target has position context
    const pos = getComputedStyle(target).position;
    if (pos === 'static') {
      (target as HTMLElement).style.position = 'relative';
    }
    (target as HTMLElement).style.overflow = 'hidden';

    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, { passive: true });

  // Add ripple animation
  if (!document.getElementById('ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
      @keyframes ripple-animation {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Optimistic loading states for organism data
function initOptimisticUI() {
  const ecosystemEl = document.getElementById('live-ecosystem');
  if (!ecosystemEl) return;

  // Add shimmer effect while loading
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          const el = node as HTMLElement;
          if (el.classList?.contains('loading')) {
            el.style.animation = 'shimmer 1.5s infinite linear';
          }
        }
      });
    });
  });

  observer.observe(ecosystemEl, { childList: true, subtree: true });
}

// Smart image loading with fade-in
function initSmartImages() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  images.forEach((img) => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      }, { once: true });
    }
  });

  // Add fade-in styles if not present
  if (!document.getElementById('image-fade-styles')) {
    const style = document.createElement('style');
    style.id = 'image-fade-styles';
    style.textContent = `
      img[loading="lazy"] {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
      }
      img[loading="lazy"].loaded {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }
}

// Intersection observer for scroll animations
function initScrollAnimations() {
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  if (animateElements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  animateElements.forEach((el) => observer.observe(el));
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('a[href^="#"]');
    if (!target) return;

    const href = target.getAttribute('href');
    if (!href || href === '#') return;

    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Update URL without triggering navigation
      history.pushState(null, '', href);
    }
  });
}

// Preload critical resources
function preloadCriticalResources() {
  // Preconnect to organism APIs
  const preconnects = [
    'https://noqnoq.emergenthq.net',
    'https://fulqrum.emergenthq.net'
  ];

  preconnects.forEach((origin) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

// Initialize all WOW features
function init() {
  // Critical path optimizations
  preloadCriticalResources();

  // Progressive enhancement
  requestIdleCallback(() => {
    initPrefetch();
    initRippleEffect();
    initOptimisticUI();
    initSmartImages();
    initScrollAnimations();
    initSmoothScroll();
  }, { timeout: 2000 });
}

// Run immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Re-init on page transitions
document.addEventListener('astro:page-load', init);

// Add requestIdleCallback polyfill for older browsers
if (!('requestIdleCallback' in window)) {
  (window as any).requestIdleCallback = (cb: IdleRequestCallback) => {
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => 50
      } as IdleDeadline);
    }, 1);
  };
}
