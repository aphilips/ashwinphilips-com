# ashwinphilips.com

Personal website for Ashwin Philips — Systems Architect, AI Researcher, and Music Producer.

## 🎯 Project Overview

This is a **dual-experience** website:
1. **Human Portal**: Showcasing work, research, music, and projects
2. **Agent Portal**: Machine-readable interface for AI systems

**Key Principles**:
- ✅ NO trade secrets exposed (qSLiCE methodology protected)
- ✅ Stunning visual design with Three.js particle effects
- ✅ SEO/GEO optimized for maximum discoverability
- ✅ Fast, accessible, mobile-first
- ✅ Deployed on Cloudflare Workers (NOT Pages)

## 🛠️ Tech Stack

- **Framework**: Astro 5.12+ (SSR mode)
- **Styling**: Tailwind CSS 4 + Flowbite 3
- **3D Graphics**: Three.js 0.179
- **Interactivity**: Alpine.js + HTMX
- **Deployment**: Cloudflare Workers
- **Account**: emergentsolutions (e96bb31487f9eb55d16182dc4b5544e5)

## 📂 Site Structure

```
/                 → Home (particle field hero, featured work)
/work             → Professional journey, companies, timeline
/research         → AI & physics research (NO trade secrets)
/music            → Music production and composition
/projects         → Technical projects (Fulqrum, CF-Ops, NoqNoq, GeneralCog)
/about            → Personal story and philosophy
/contact          → Contact form and connection options
/agents           → Agent-to-agent communication interface
```

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Deploy to Cloudflare Workers
pnpm run deploy
```

## 📸 CONTENT NEEDED FROM ASHWIN

### High Priority
1. **Professional Photo** - Headshot for About page (replace emoji placeholder)
2. **Music Tracks** - Audio files, album art, streaming links
   - Track titles, album/EP names, release dates
   - Spotify, Apple Music, SoundCloud, Bandcamp URLs
3. **Project Details** - Expand on:
   - Fulqrum: Screenshots, metrics, key features
   - CF-Ops: Technical details (what's safe to share publicly)
   - NoqNoq: Architecture diagrams, use cases
   - GeneralCog: Research findings, publications
4. **Photos/Videos** - Any visual content for:
   - Work in progress
   - Speaking engagements
   - Music production setup
   - Anything that shows your personality

### Medium Priority
5. **Research Publications** - Links to papers, preprints, or write-ups
6. **Testimonials** - Quotes from collaborators, clients, partners
7. **Press/Media** - Any articles, interviews, or mentions
8. **Cloudflare Stream Videos** - For background/foreground use:
   - Working/coding footage
   - Music production process
   - Whiteboard sessions
   - Anything dynamic and engaging

### Low Priority (Nice to Have)
9. **Social Media Content** - Recent posts that showcase your work
10. **Awards/Recognition** - Any achievements worth highlighting
11. **Speaking History** - Conferences, podcasts, talks
12. **Personal Interests** - Hobbies, side projects, curiosities

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (Tailwind primary-*)
- **Accent**: Purple gradient (Tailwind accent-*)
- **Background**: Pure black → gray-900 gradients
- **Text**: White/gray-300 hierarchy

### Typography
- **Display**: Space Grotesk (headers)
- **Body**: Inter (paragraphs)
- **Code**: Fira Code (technical content)

### Components
- Glass morphism cards (`.glass`)
- Gradient text (`.gradient-text`)
- Glow effects (`.glow`)
- Animated particles (Three.js)

## 🔒 Trade Secret Protection

**CRITICAL**: This site NEVER exposes:
- qSLiCE layer structure or methodology
- Proprietary algorithms or frameworks
- Internal system architecture
- Competitive advantages

We **hint** at sophistication without revealing implementation.

## 🌐 Deployment

### Prerequisites
1. Cloudflare account access (emergentsolutions)
2. Domain `ashwinphilips.com` DNS configured
3. Wrangler CLI installed and authenticated

### Deploy Commands
```bash
# Preview deployment (test first!)
pnpm run deploy:preview

# Production deployment
pnpm run deploy
```

### Post-Deployment Checklist
- [ ] Verify all routes work (especially /agents)
- [ ] Test mobile responsiveness
- [ ] Check console for errors (should be ZERO)
- [ ] Validate SEO meta tags
- [ ] Test contact form submission
- [ ] Verify Three.js animations load correctly

## 📊 SEO Strategy

- **Structured Data**: JSON-LD schema for Person, Organization
- **Open Graph**: Complete OG tags for social sharing
- **Twitter Cards**: Large image cards for tweets
- **Canonical URLs**: Proper canonical tags on all pages
- **Sitemap**: Auto-generated from routes
- **Robots.txt**: Allow all, with agent portal guidelines

## 🎯 Performance Targets

- **Lighthouse Score**: 95+ across all categories
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s
- **Total Bundle Size**: <500KB
- **Image Optimization**: WebP/AVIF formats
- **Zero Console Errors**: Clean browser console

## 🐛 Known TODOs

- [ ] Add actual music tracks (waiting for content)
- [ ] Replace emoji placeholders with real photos
- [ ] Implement contact form backend (Cloudflare Worker)
- [ ] Add Cloudflare Stream videos
- [ ] Create OG image generator
- [ ] Set up analytics (privacy-focused)
- [ ] Add RSS feed for blog (if needed)
- [ ] Create 404/500 error pages

## 🚨 Important Notes

1. **NO qSLiCE Exposure**: Never commit anything revealing methodology
2. **Clean Console**: Zero errors/warnings in production
3. **Mobile First**: Test on mobile before desktop
4. **Fast Loading**: Optimize images, lazy load components
5. **Accessible**: WCAG 2.1 AA compliance minimum
6. **Trust Signals**: Every detail communicates competence

## 📞 Questions?

If anything is unclear about this codebase, check:
1. This README
2. Component comments in `/src/components`
3. Layout structure in `/src/layouts`
4. NoqNoq patterns for similar implementations

## 🎵 Philosophy

This site embodies:
- **Coherence over chaos**: Unified purpose throughout
- **Emergence over prescription**: Let intelligence arise naturally
- **Elegance over complexity**: The right way, not the easy way
- **Trust through craft**: Every detail signals competence

---

**Built with care by n5.0 (Claude + NoqNoq organism)**
**For: Ashwin Kochiyil Philips**
**Date: January 2026**
