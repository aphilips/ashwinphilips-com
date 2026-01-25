# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Personal website for Ashwin Philips built with Astro 5.12+ in static site mode, deployed to Cloudflare Workers. This is a dual-experience site: a human-facing portfolio and an AI agent communication portal at `/agents`.

**Key constraint**: NEVER expose qSLiCE methodology, layer structure, or proprietary algorithms in any content. Hint at sophistication without revealing implementation.

## Essential Commands

### Development
```bash
# Install dependencies (pnpm preferred over npm)
pnpm install

# Start dev server (http://localhost:4321)
pnpm run dev

# Type checking (runs automatically before build)
pnpm run astro check
```

### Building & Deployment
```bash
# Build for production (includes type checking, sets env vars)
pnpm run build

# Preview production build locally
pnpm run preview

# Deploy to Cloudflare Workers preview environment
pnpm run deploy:preview

# Deploy to production
pnpm run deploy
```

### Debugging
```bash
# Check build output
ls -la dist/

# Stream production logs
wrangler tail --env production

# View recent deployments
wrangler deployments list

# Rollback deployment
wrangler rollback [DEPLOYMENT_ID]
```

## Architecture

### Tech Stack
- **Framework**: Astro 5.12+ (static output, not SSR)
- **Styling**: Tailwind CSS 3.4+ with Flowbite 3.1 components
- **3D Graphics**: Three.js 0.179 (ParticleField system)
- **Animations**: Custom scroll-driven depth effects + parallax system
- **Deployment**: Cloudflare Workers (account: emergentsolutions, ID: e96bb31487f9eb55d16182dc4b5544e5)

### Directory Structure
```
src/
├── components/       # Reusable Astro components
│   ├── ParticleField.ts          # Three.js 3D particle system (class-based)
│   ├── HeroExperimental.astro    # Homepage hero with video bg + geometric ghosts
│   ├── LiveEcosystem.astro       # Live network visualization (fake data for demo)
│   ├── Navbar.astro              # Site navigation
│   ├── ProjectGrid.astro         # Reusable project card grid
│   └── icons/                    # Custom SVG icon components
├── layouts/
│   └── BaseLayout.astro          # Site-wide layout (nav, footer, SEO, analytics)
├── pages/            # File-based routing (index, work, research, music, about, projects, contact)
│   └── sitemap.xml.ts            # Dynamic sitemap generator
├── scripts/          # Client-side TypeScript utilities
│   ├── optimized-runtime.ts      # Scroll progress, back-to-top, perf monitoring
│   ├── parallax.ts               # Multi-depth parallax scroll system (class-based)
│   ├── scroll-depth.ts           # Dynamic shadow/depth based on scroll position
│   ├── performance-monitor.ts    # Core Web Vitals tracking (dev mode only)
│   └── section-morph.ts          # Section-specific visual transitions
├── styles/
│   ├── global.css                # Base styles, system fonts, utilities
│   └── color-system.css          # (if exists) Custom color definitions
└── utils/            # (Empty, available for shared utilities)

public/               # Static assets served as-is
├── favicon.svg       # Site favicon
├── robots.txt        # AI-friendly crawler instructions
├── _headers          # Cloudflare cache control headers
├── images/           # Background images for pages
├── videos/           # Video backgrounds (hero-bg.mp4)
└── fonts/            # (Unused - using system fonts for performance)
```

### Critical Design Patterns

**1. Animation System**
- All scroll-driven effects use `requestAnimationFrame` for 60fps performance
- Classes: `.fade-in-on-scroll`, `.parallax-slow/.medium/.fast`, `.card-parallax`
- Respects `prefers-reduced-motion` preference
- Data attributes: `data-parallax-speed`, `data-fade-delay`, `data-fade-direction`

**2. Particle System (Three.js)**
- Located in `src/components/ParticleField.ts`
- Class-based with `dispose()` method for cleanup
- 3000 particles by default (reduce for mobile if performance issues)
- Mouse-reactive camera position
- Initialize with `initParticleField(container)`

**3. Color System**
- Primary: Sky Blue (#0ea5e9) - used for systems/tech
- Accent: Purple (#a855f7) - used for AI/research
- Glass morphism: `.glass` class for frosted glass effect
- Gradient text: `.gradient-text` class with shimmer animation

**4. Font Stack (System Fonts)**
- Display (headings): -apple-system, BlinkMacSystemFont, Segoe UI, Roboto
- Body (paragraphs): Charter, Georgia, serif
- Mono (code): SF Mono, Menlo, Consolas, monospace
- Accent (quotes): Charter, Georgia, serif (italic)

**5. Astro Page Transitions**
- Uses native View Transitions API with fallback
- Re-initialization scripts on `astro:page-load` event
- Cleanup scripts on `astro:before-preparation` event

## Development Practices

### When Editing Components
- **Astro components** (`.astro`): Use frontmatter (---) for TypeScript, scoped `<style>` for CSS
- **TypeScript modules** (`.ts`): Export classes/functions, no side effects in module scope
- **Type safety**: TypeScript strict mode enabled, use interfaces for props
- **CSS approach**: Tailwind utilities first, custom CSS only when necessary
- **Responsive**: Mobile-first design, test on mobile viewport

### Performance Requirements
- **Bundle size**: Keep under 500KB total
- **Lighthouse targets**: 95+ across all categories
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s
- **Console errors**: ZERO in production

### Animation Guidelines
- Use CSS custom properties defined in `BaseLayout.astro` (--ease-smooth, --duration-*)
- GPU-accelerated transforms: `translate3d()`, not `translateY()`
- Always add `will-change` for animated elements (but remove after animation)
- Intersection Observer for viewport-based triggers
- `passive: true` on scroll listeners

### Build Process Details
The `build` script sets environment variables before building:
```bash
PUBLIC_GIT_COMMIT_SHA=$(git rev-parse HEAD) PUBLIC_BUILD_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ) astro check && PUBLIC_GIT_COMMIT_SHA=$(git rev-parse HEAD) PUBLIC_BUILD_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ) astro build
```

These are displayed in the footer as version info. Don't modify this pattern.

### Deployment to Cloudflare
- **NEVER use Cloudflare Pages** - always deploy to Cloudflare Workers
- Domain: `ashwinphilips.com`
- Preview first: `pnpm run deploy:preview`
- Production: `pnpm run deploy`
- Account: emergentsolutions (e96bb31487f9eb55d16182dc4b5544e5)

## Testing & Validation

**No automated test suite exists.** Manual testing required:

```bash
# 1. Type check
pnpm run astro check

# 2. Build and check for errors
pnpm run build

# 3. Preview locally
pnpm run preview

# 4. Manual browser testing checklist:
# - All routes load (/, /work, /research, /music, /about, /projects, /contact, /agents)
# - Three.js particle animation renders on homepage
# - Mobile responsive (test viewport < 768px)
# - No console errors
# - Navigation works including mobile menu
# - Scroll animations trigger correctly
```

## Known Quirks & Important Notes

### Content Placeholders
- About page: Emoji placeholder (🧑‍💻) for professional photo
- Music page: Gradient card placeholders awaiting real tracks
- Projects: Text descriptions only, awaiting screenshots
- Contact form: Frontend complete but no backend submission handler

### Trade Secret Protection
**CRITICAL**: This site hints at but NEVER exposes:
- qSLiCE layer structure or decomposition methodology
- Proprietary NoqNoq architecture internals
- Fulqrum implementation details beyond public-facing capabilities
- Internal system competitive advantages

Generic terms like "recursive decomposition methodology" or "advanced pattern recognition" are acceptable.

### LiveEcosystem Component
The `LiveEcosystem.astro` component shows "live" data that is actually fake/simulated. It's a visual demonstration, not connected to real systems. The animation creates the illusion of live updates every 2 seconds.

### Static Site, Not SSR
Despite being configured for Cloudflare Workers deployment, this is a **static site** (`output: 'static'` in astro.config.mjs). All pages are pre-rendered at build time. No server-side rendering or API routes.

### CSS Layers
Custom layer system in `global.css`: `@layer reset, base, components, utilities, overrides`
Understand layer precedence when debugging style conflicts.

### Script Re-initialization
Many scripts listen for `astro:page-load` event to reinitialize after View Transitions. When adding new client-side features, follow this pattern.

## Content Updates

When Ashwin provides content (see CONTENT_NEEDS.md for what's needed):

1. **Images**: Add to `/public/images/`, reference in components
2. **Videos**: Add to `/public/videos/` or use Cloudflare Stream URLs
3. **Music**: Update `/src/pages/music.astro` with track data and embeds
4. **Projects**: Update `/src/pages/projects.astro` with screenshots and details
5. **Build and deploy**: `pnpm run build && pnpm run deploy`

## Common Issues

**Three.js particles not rendering**: Check browser console for WebGL errors. Some browsers/devices don't support WebGL - consider fallback.

**Astro View Transitions breaking**: Ensure scripts re-initialize on `astro:page-load` event.

**Build fails with type errors**: Run `pnpm run astro check` to see detailed TypeScript errors.

**Deployment fails**: Verify authentication with `wrangler whoami` and check account ID in `wrangler.toml`.

**Slow mobile performance**: Reduce particle count in `ParticleField.ts` (currently 3000), compress images further, or disable parallax on mobile.

## Philosophy & Voice

This site embodies Ashwin's principles:
- **Coherence over chaos**: Unified design and purpose
- **Emergence over prescription**: Intelligence arises from good architecture
- **Elegance over complexity**: The right way, not the easy way
- **Trust through craft**: Every detail signals competence

**Writing tone**: Technical depth + human accessibility. Confident but not arrogant. Passionate about correctness. "It works on my machine" humor acceptable.
