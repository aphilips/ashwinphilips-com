/**
 * Section Morphing System
 *
 * Detects which section is in viewport and smoothly morphs
 * the color theme across the entire page.
 *
 * Uses Intersection Observer for performance.
 */

interface SectionConfig {
  element: Element;
  key: string;
}

class SectionMorph {
  private observer!: IntersectionObserver;
  private sections: SectionConfig[] = [];
  private currentSection: string = 'home';

  constructor() {
    this.init();
  }

  private init(): void {
    // Find all sections with data-section attribute
    const sectionElements = document.querySelectorAll('[data-section]');

    sectionElements.forEach((element) => {
      const key = element.getAttribute('data-section');
      if (key) {
        this.sections.push({ element, key });
      }
    });

    // Create Intersection Observer
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const section = entry.target.getAttribute('data-section');
            if (section && section !== this.currentSection) {
              this.morphToSection(section);
            }
          }
        });
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-10% 0px -10% 0px', // Trigger when section is ~80% visible
      }
    );

    // Observe all sections
    this.sections.forEach(({ element }) => {
      this.observer.observe(element);
    });

    // Set initial section on page load
    this.detectInitialSection();
  }

  private detectInitialSection(): void {
    // Find which section is currently most visible
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    let closestSection = this.sections[0];
    let closestDistance = Infinity;

    this.sections.forEach((section) => {
      const rect = section.element.getBoundingClientRect();
      const sectionCenter = rect.top + window.scrollY + rect.height / 2;
      const distance = Math.abs(scrollPosition - sectionCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestSection = section;
      }
    });

    if (closestSection) {
      this.morphToSection(closestSection.key);
    }
  }

  private morphToSection(sectionKey: string): void {
    this.currentSection = sectionKey;

    // Update root data-section attribute for CSS variable morphing
    document.documentElement.setAttribute('data-section', sectionKey);

    // Update navbar active state
    this.updateNavbar(sectionKey);

    // Emit custom event for other components to listen to
    window.dispatchEvent(
      new CustomEvent('section-change', {
        detail: { section: sectionKey },
      })
    );

    // Optional: Update browser URL hash without scrolling
    if (window.history.replaceState) {
      const url = new URL(window.location.href);
      url.hash = sectionKey === 'home' ? '' : sectionKey;
      window.history.replaceState(null, '', url.toString());
    }
  }

  private updateNavbar(sectionKey: string): void {
    // Remove active state from all nav links
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.remove('nav-link-active');
    });

    // Add active state to current section's nav link
    const activeLink = document.querySelector(
      `.nav-link[href*="${sectionKey}"]`
    );
    if (activeLink) {
      activeLink.classList.add('nav-link-active');
    }

    // Update navbar glow color
    const navbar = document.querySelector('nav');
    if (navbar) {
      // Navbar will automatically inherit CSS variables
      // No additional work needed due to CSS variable system
    }
  }

  public destroy(): void {
    this.observer.disconnect();
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  let sectionMorph: SectionMorph;

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      sectionMorph = new SectionMorph();
    });
  } else {
    sectionMorph = new SectionMorph();
  }

  // Cleanup on page unload (for SPA transitions)
  window.addEventListener('beforeunload', () => {
    if (sectionMorph) {
      sectionMorph.destroy();
    }
  });
}

export default SectionMorph;
