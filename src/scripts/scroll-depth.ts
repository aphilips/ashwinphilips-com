/**
 * Scroll-Driven Depth Effects
 *
 * Creates dynamic shadow and depth changes based on scroll position.
 * Implements the user's request: "when we scroll, i want to see depth"
 *
 * Features:
 * - Dynamic multi-layer shadows that intensify/fade with scroll
 * - Progressive blur for background layers (depth of field)
 * - Scale and opacity transitions for depth perception
 * - Respects reduced motion preferences
 */

interface ScrollDepthElement {
  element: HTMLElement;
  baseDepth: number;
  scrollMultiplier: number;
  maxShadow: number;
}

class ScrollDepthManager {
  private elements: ScrollDepthElement[] = [];
  private rafId: number | null = null;
  private prefersReducedMotion: boolean = false;

  constructor() {
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.init();
  }

  private init(): void {
    if (this.prefersReducedMotion) {
      return;
    }

    // Find all elements with scroll-depth attributes
    this.discoverElements();

    // Start scroll listener
    this.startScrollListener();

    // Initial update
    this.updateDepth();
  }

  private discoverElements(): void {
    // Find elements with data-scroll-depth attribute
    const depthElements = document.querySelectorAll<HTMLElement>('[data-scroll-depth]');

    depthElements.forEach(element => {
      const depthStr = element.dataset.scrollDepth || '1';
      const depth = parseFloat(depthStr);

      this.elements.push({
        element,
        baseDepth: depth,
        scrollMultiplier: depth * 0.5, // How much scroll affects this element
        maxShadow: depth * 100 // Maximum shadow blur in pixels
      });
    });

    // Also find all cards with depth classes
    const depthCards = document.querySelectorAll<HTMLElement>('.depth-shallow, .depth-medium, .depth-deep, .depth-primary, .depth-accent');

    depthCards.forEach(element => {
      // Skip if already tracked
      if (this.elements.some(e => e.element === element)) {
        return;
      }

      let depth = 1;
      if (element.classList.contains('depth-shallow')) depth = 0.5;
      if (element.classList.contains('depth-medium')) depth = 1;
      if (element.classList.contains('depth-deep')) depth = 2;
      if (element.classList.contains('depth-primary')) depth = 1.5;
      if (element.classList.contains('depth-accent')) depth = 1.5;

      this.elements.push({
        element,
        baseDepth: depth,
        scrollMultiplier: depth * 0.3,
        maxShadow: depth * 80
      });
    });
  }

  private startScrollListener(): void {
    window.addEventListener('scroll', () => {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }

      this.rafId = requestAnimationFrame(() => this.updateDepth());
    }, { passive: true });

    // Also update on resize
    window.addEventListener('resize', () => {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }

      this.rafId = requestAnimationFrame(() => this.updateDepth());
    }, { passive: true });
  }

  private updateDepth(): void {
    const windowHeight = window.innerHeight;

    this.elements.forEach(({ element, baseDepth, scrollMultiplier, maxShadow }) => {
      const rect = element.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;

      // Distance from viewport center (-1 to 1, negative = above, positive = below)
      const distanceFromCenter = (elementCenter - viewportCenter) / viewportCenter;

      // Element visibility (0 to 1, 1 = fully in view)
      const visibility = this.calculateVisibility(rect, windowHeight);

      // Calculate depth intensity based on scroll position and element position
      const depthIntensity = Math.abs(distanceFromCenter) * scrollMultiplier * visibility;

      // Generate dynamic shadows based on depth
      this.applyShadows(element, baseDepth, depthIntensity, maxShadow);

      // Apply scale transformation for depth perception
      const scale = 1 - (depthIntensity * 0.05); // Subtle scale reduction
      const opacity = 1 - (Math.abs(distanceFromCenter) * 0.1); // Fade when far from center

      element.style.transform = `scale(${Math.max(0.9, scale)}) translateZ(0)`;
      element.style.opacity = `${Math.max(0.7, Math.min(1, opacity))}`;
    });
  }

  private calculateVisibility(rect: DOMRect, windowHeight: number): number {
    const elementTop = rect.top;
    const elementBottom = rect.bottom;

    // Element is completely above viewport
    if (elementBottom < 0) return 0;

    // Element is completely below viewport
    if (elementTop > windowHeight) return 0;

    // Calculate visible percentage
    const visibleHeight = Math.min(elementBottom, windowHeight) - Math.max(elementTop, 0);
    const totalHeight = rect.height;

    return Math.max(0, Math.min(1, visibleHeight / totalHeight));
  }

  private applyShadows(
    element: HTMLElement,
    baseDepth: number,
    intensity: number,
    maxShadow: number
  ): void {
    // Generate multi-layer shadows based on depth intensity
    const layers: string[] = [];
    const layerCount = Math.ceil(baseDepth * 3); // 3 layers per depth unit

    for (let i = 0; i < layerCount; i++) {
      const offsetY = (i + 1) * 2 * (1 + intensity);
      const blur = (i + 1) * 4 * (1 + intensity);
      const opacity = 0.08 * (1 + intensity * 0.5);

      // Clamp blur to maxShadow
      const clampedBlur = Math.min(blur, maxShadow);

      layers.push(`0 ${offsetY}px ${clampedBlur}px rgba(0, 0, 0, ${opacity})`);
    }

    element.style.boxShadow = layers.join(', ');
  }

  public destroy(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    // Reset all elements
    this.elements.forEach(({ element }) => {
      element.style.boxShadow = '';
      element.style.transform = '';
      element.style.opacity = '';
    });

    this.elements = [];
  }
}

// Initialize on DOM ready
let scrollDepthManager: ScrollDepthManager | null = null;

function initScrollDepth() {
  // Destroy existing instance if any
  if (scrollDepthManager) {
    scrollDepthManager.destroy();
  }

  // Create new instance
  scrollDepthManager = new ScrollDepthManager();
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollDepth);
} else {
  initScrollDepth();
}

// Re-initialize on Astro page transitions (View Transitions API)
document.addEventListener('astro:page-load', initScrollDepth);

// Cleanup on page unload
document.addEventListener('astro:before-preparation', () => {
  if (scrollDepthManager) {
    scrollDepthManager.destroy();
    scrollDepthManager = null;
  }
});
