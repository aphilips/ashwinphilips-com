/**
 * Advanced Multi-Depth Parallax Scroll System
 *
 * Sophisticated parallax implementation with:
 * - Multi-layer depth control via data attributes
 * - Intersection Observer for performance
 * - RequestAnimationFrame for smooth 60fps
 * - Fade-in and slide-up animations on scroll
 * - Mobile-responsive with reduced effects on small screens
 */

interface ParallaxElement {
  element: HTMLElement;
  speed: number;
  initialY: number;
  isVisible: boolean;
}

interface FadeElement {
  element: HTMLElement;
  delay: number;
  direction: 'up' | 'down' | 'left' | 'right';
  distance: number;
}

export class ParallaxController {
  private parallaxElements: ParallaxElement[] = [];
  private fadeElements: FadeElement[] = [];
  private observer: IntersectionObserver | null = null;
  private rafId: number | null = null;
  private lastScrollY = 0;
  private ticking = false;
  private isMobile = false;
  private isReducedMotion = false;

  constructor() {
    this.checkMobile();
    this.checkReducedMotion();
    this.init();
  }

  private checkMobile(): void {
    this.isMobile = window.innerWidth < 768;
    window.addEventListener('resize', () => {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth < 768;

      // Reset transforms if switching between mobile/desktop
      if (wasMobile !== this.isMobile) {
        this.resetAllTransforms();
      }
    });
  }

  private checkReducedMotion(): void {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.isReducedMotion = mediaQuery.matches;

    mediaQuery.addEventListener('change', (e) => {
      this.isReducedMotion = e.matches;
      if (this.isReducedMotion) {
        this.resetAllTransforms();
      }
    });
  }

  private init(): void {
    this.setupIntersectionObserver();
    this.discoverElements();
    this.attachScrollListener();
  }

  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;

          // Handle parallax elements
          const parallaxItem = this.parallaxElements.find(
            (item) => item.element === element
          );
          if (parallaxItem) {
            parallaxItem.isVisible = entry.isIntersecting;

            // Reset position when out of view for performance
            if (!entry.isIntersecting) {
              element.style.transform = '';
            }
          }

          // Handle fade-in elements
          const fadeItem = this.fadeElements.find(
            (item) => item.element === element
          );
          if (fadeItem && entry.isIntersecting) {
            this.triggerFadeIn(fadeItem);
          }
        });
      },
      {
        rootMargin: '100px 0px', // Start animating slightly before entering viewport
        threshold: [0, 0.1, 0.5, 1.0],
      }
    );
  }

  private discoverElements(): void {
    // Discover parallax elements
    const parallaxNodes = document.querySelectorAll<HTMLElement>(
      '[data-parallax], [data-parallax-speed], .parallax-slow, .parallax-medium, .parallax-fast'
    );

    parallaxNodes.forEach((element) => {
      let speed = 0.5; // Default medium speed

      // Priority: data-parallax-speed > data-parallax > class
      if (element.hasAttribute('data-parallax-speed')) {
        speed = parseFloat(element.getAttribute('data-parallax-speed') || '0.5');
      } else if (element.hasAttribute('data-parallax')) {
        speed = parseFloat(element.getAttribute('data-parallax') || '0.5');
      } else if (element.classList.contains('parallax-slow')) {
        speed = 0.3;
      } else if (element.classList.contains('parallax-medium')) {
        speed = 0.5;
      } else if (element.classList.contains('parallax-fast')) {
        speed = 0.7;
      }

      // Reduce speed on mobile for performance
      if (this.isMobile) {
        speed *= 0.5;
      }

      const rect = element.getBoundingClientRect();
      const initialY = rect.top + window.scrollY;

      this.parallaxElements.push({
        element,
        speed,
        initialY,
        isVisible: false,
      });

      // Add will-change for performance
      element.style.willChange = 'transform';

      this.observer?.observe(element);
    });

    // Discover fade-in elements
    const fadeNodes = document.querySelectorAll<HTMLElement>(
      '[data-fade-in], .fade-in-on-scroll'
    );

    fadeNodes.forEach((element, index) => {
      const delay = parseInt(element.getAttribute('data-fade-delay') || '0', 10);
      const direction = (element.getAttribute('data-fade-direction') || 'up') as FadeElement['direction'];
      const distance = parseInt(element.getAttribute('data-fade-distance') || '30', 10);

      this.fadeElements.push({
        element,
        delay: delay || index * 100, // Auto-stagger if no delay specified
        direction,
        distance,
      });

      // Set initial state
      element.style.opacity = '0';
      element.style.transition = `opacity 0.6s cubic-bezier(0.4, 0.0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)`;
      this.setFadeInitialTransform(element, direction, distance);

      this.observer?.observe(element);
    });
  }

  private setFadeInitialTransform(element: HTMLElement, direction: FadeElement['direction'], distance: number): void {
    switch (direction) {
      case 'up':
        element.style.transform = `translateY(${distance}px)`;
        break;
      case 'down':
        element.style.transform = `translateY(-${distance}px)`;
        break;
      case 'left':
        element.style.transform = `translateX(${distance}px)`;
        break;
      case 'right':
        element.style.transform = `translateX(-${distance}px)`;
        break;
    }
  }

  private triggerFadeIn(fadeItem: FadeElement): void {
    if (this.isReducedMotion) {
      fadeItem.element.style.opacity = '1';
      fadeItem.element.style.transform = 'none';
      return;
    }

    setTimeout(() => {
      fadeItem.element.style.opacity = '1';
      fadeItem.element.style.transform = 'translateY(0) translateX(0)';
    }, fadeItem.delay);
  }

  private attachScrollListener(): void {
    window.addEventListener('scroll', () => {
      this.lastScrollY = window.scrollY;

      if (!this.ticking) {
        this.rafId = window.requestAnimationFrame(() => {
          this.updateParallax();
          this.ticking = false;
        });
        this.ticking = true;
      }
    }, { passive: true });
  }

  private updateParallax(): void {
    if (this.isReducedMotion) return;

    const scrollY = this.lastScrollY;

    this.parallaxElements.forEach((item) => {
      if (!item.isVisible) return;

      const rect = item.element.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const elementHeight = rect.height;
      const viewportHeight = window.innerHeight;

      // Calculate if element is in viewport range
      const isInRange =
        elementTop + elementHeight > scrollY &&
        elementTop < scrollY + viewportHeight;

      if (isInRange) {
        // Calculate parallax offset
        // More sophisticated calculation for smoother effect
        const relativeScroll = scrollY - item.initialY + viewportHeight;
        const parallaxOffset = relativeScroll * item.speed;

        // Apply transform using translate3d for GPU acceleration
        item.element.style.transform = `translate3d(0, ${-parallaxOffset}px, 0)`;
      }
    });
  }

  private resetAllTransforms(): void {
    this.parallaxElements.forEach((item) => {
      item.element.style.transform = '';
    });

    this.fadeElements.forEach((item) => {
      item.element.style.opacity = '1';
      item.element.style.transform = '';
    });
  }

  public destroy(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    this.observer?.disconnect();
    this.resetAllTransforms();

    // Clean up will-change
    this.parallaxElements.forEach((item) => {
      item.element.style.willChange = '';
    });
  }

  // Public API for dynamic element addition
  public addParallaxElement(element: HTMLElement, speed: number = 0.5): void {
    const rect = element.getBoundingClientRect();
    const initialY = rect.top + window.scrollY;

    this.parallaxElements.push({
      element,
      speed: this.isMobile ? speed * 0.5 : speed,
      initialY,
      isVisible: false,
    });

    element.style.willChange = 'transform';
    this.observer?.observe(element);
  }

  public addFadeElement(
    element: HTMLElement,
    options: {
      delay?: number;
      direction?: FadeElement['direction'];
      distance?: number;
    } = {}
  ): void {
    const fadeItem: FadeElement = {
      element,
      delay: options.delay || 0,
      direction: options.direction || 'up',
      distance: options.distance || 30,
    };

    this.fadeElements.push(fadeItem);

    element.style.opacity = '0';
    element.style.transition = `opacity 0.6s cubic-bezier(0.4, 0.0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)`;
    this.setFadeInitialTransform(element, fadeItem.direction, fadeItem.distance);

    this.observer?.observe(element);
  }
}

// Auto-initialize on DOM ready
let parallaxController: ParallaxController | null = null;

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      parallaxController = new ParallaxController();
    });
  } else {
    parallaxController = new ParallaxController();
  }
}

export { parallaxController };
