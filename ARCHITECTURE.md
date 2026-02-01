# ashwinphilips.com - Architecture Documentation

**Status:** Production (2026-01-31)
**Stack:** HQstack™ 1.0 Embodiment
**Framework:** Astro 5.x + Cloudflare Pages (SSR)

---

## HQstack™ 1.0 Alignment

This site is a living demonstration of HQstack principles in production.

### qSLiCE Structure (L3 Node)

```
ashwinphilips.com (L3)
  ├─→ NoqNoq Hub (L2) - Organism nervous system
  │    └─→ Status API
  │
  ├─→ Fulqrum (L2) - Quality assessment platform
  │    └─→ Debates API
  │
  ├─→ Performance APIs (L1) - Core Web Vitals
  │    ├─→ LCP monitoring
  │    ├─→ FID monitoring
  │    ├─→ CLS monitoring
  │    ├─→ TTFB monitoring
  │    └─→ FCP monitoring
  │
  └─→ Static Assets (L0) - Pure data
       ├─→ Images
       ├─→ Fonts (system fonts only)
       └─→ Styles
```

**Level Law Applied:**
- L0: Pure values (images, colors, text)
- L1: Irreducible primitives (Web Vitals monitoring)
- L2: Composed services (NoqNoq, Fulqrum)
- L3: This site (composition of all dependencies)

### ALEF Kinetic Optimization

**GPU-Accelerated Animations:**
- All transforms use `transform` and `opacity` only
- Hardware acceleration via `translateZ(0)`
- 60fps target maintained
- Passive event listeners for scroll

**Non-Blocking Execution:**
- 2s timeout on NoqNoq Hub
- 3s timeout on Fulqrum API
- Graceful degradation with fallback data
- Page never blocked by external services

**Request Animation Frame:**
- Scroll effects batched with RAF
- Ripple animations use CSS keyframes
- Intersection Observer for scroll triggers

### qState Temporal Memory

**Performance Metrics (In Development):**
- Core Web Vitals tracked in real-time
- Metrics stored in memory during session
- Production: Beacon API to `/api/analytics/vitals`
- Dev: Console logging with emoji ratings

**Git History as qState:**
- Every deployment captured in git
- Rollback capability via git history
- Version tracking in environment variables

### CASCADE-E Failure Propagation

**Explicit Failure Isolation:**

```
NoqNoq Hub fails → Use fallback data
  ↓ (isolated)
Site continues to function

Fulqrum API fails → Use demo data
  ↓ (isolated)
Organism display shows "demonstration mode"

Performance monitoring fails → Silent degradation
  ↓ (isolated)
No impact on user experience
```

**Blast Radius:** Zero. Each service failure is contained.

---

## Architecture Layers

### 1. Static Generation (Build Time)

**Astro Build:**
- Static pages generated at build time
- API routes remain dynamic (SSR)
- Client-side scripts bundled and minified
- Assets optimized and fingerprinted

**Build Output:**
```
dist/
  ├─ _astro/           # Static assets (hashed)
  ├─ _worker.js        # Cloudflare Pages Function
  ├─ _routes.json      # Routing config
  └─ index.html        # Static pages
```

### 2. Edge Runtime (Request Time)

**Cloudflare Pages Functions:**
- SSR for `/api/*` routes
- Organism status endpoint
- Future: Analytics vitals endpoint

**Request Flow:**
```
User → Cloudflare Edge → Pages Function
                          ├─→ NoqNoq Hub (with timeout)
                          ├─→ Fulqrum API (with timeout)
                          └─→ Return JSON (with fallbacks)
```

### 3. Client Runtime (Browser)

**Progressive Enhancement:**

1. **Instant (0-100ms):** HTML renders, CSS applies
2. **Interactive (100-500ms):** Hydration, event listeners
3. **Enhanced (500ms+):** Prefetch, animations, monitoring

**Runtime Scripts:**
- `optimized-runtime.ts` - Scroll effects, lazy loading
- `wow-performance.ts` - Prefetch, ripple effects
- `performance-monitor.ts` - Web Vitals tracking

---

## Performance Optimizations

### 1. WOW Performance Features

**Instant Navigation:**
- Prefetch on mouseenter (100ms delay)
- Prefetch on touchstart (immediate)
- Uses native `<link rel="prefetch">`

**Visual Feedback:**
- Ripple effects on all clickable elements
- Stagger animations for grid layouts
- Text shimmer on "living system"
- Pulse glow on organism status

**Resource Hints:**
```html
<link rel="preconnect" href="https://noqnoq.emergenthq.net" crossorigin />
<link rel="preconnect" href="https://fulqrum.emergenthq.net" crossorigin />
<link rel="dns-prefetch" href="https://noqnoq.emergenthq.net" />
```

### 2. Core Web Vitals Monitoring

**Tracked Metrics:**

| Metric | Threshold (Good) | Threshold (Poor) | Action |
|--------|------------------|------------------|--------|
| LCP    | ≤2.5s           | >4.0s            | Optimize images, preload critical resources |
| FID    | ≤100ms          | >300ms           | Reduce JS, split bundles |
| CLS    | ≤0.1            | >0.25            | Reserve space, avoid dynamic content shifts |
| TTFB   | ≤800ms          | >1.8s            | Edge caching, CF optimization |
| FCP    | ≤1.8s           | >3.0s            | Critical CSS, preload fonts |

**Implementation:**
- PerformanceObserver API for all metrics
- Dev mode: Console logging with emoji
- Production: sendBeacon to analytics endpoint
- Accessible via `window.__webVitals` (dev only)

### 3. Caching Strategy

**Cloudflare Edge:**
- Static assets: 1 year (immutable, hashed filenames)
- Pages: CDN default (cache revalidation)
- API responses: Custom cache control

**API Caching:**
```typescript
{
  '/api/organism-status': 'max-age=30',  // 30s cache
  '/api/analytics/vitals': 'no-cache'    // Always fresh
}
```

---

## Organism Integration

### Current Architecture (Direct Calls)

```
ashwinphilips.com
  ├─→ NoqNoq Hub /status (2s timeout)
  │    └─→ Returns: active_nodes, message_count
  │
  └─→ Fulqrum /api/debates/recent (3s timeout)
       └─→ Returns: debates[], consensus scores
```

### Future Architecture (GUCP Routing)

```
ashwinphilips.com
  └─→ NoqNoq Hub /route
       ├─→ capability: "organism_status"
       │    └─→ Routes to: status service
       │
       └─→ capability: "quality_assessment"
            └─→ Routes to: Fulqrum GUCP endpoint
                 └─→ Returns: debates via GUCP protocol
```

**TODO:** Implement when NoqNoq Hub routing is deployed.

### Graceful Degradation

**Level 1: All Services Available**
- Real NoqNoq Hub status
- Real Fulqrum debates
- Activity indicators accurate

**Level 2: Fulqrum Unavailable**
- Real NoqNoq Hub status
- Demo debates data (3 examples)
- Activity indicator shows degraded state

**Level 3: All Services Unavailable**
- Fallback status data
- Demo debates data
- Site fully functional with cached data

**User Impact:** Zero. Site always works.

---

## Deployment

### Build Process

```bash
pnpm run build           # Astro build + check
PUBLIC_GIT_COMMIT_SHA    # Injected at build time
PUBLIC_BUILD_TIME        # Injected at build time
```

### Deploy Process

```bash
wrangler pages deploy dist --project-name=ashwinphilips-com
```

**Environments:**
- Production: `ashwinphilips.com`
- Preview: `*.ashwinphilips-com.pages.dev`

### Rollback

```bash
# View deployments
wrangler pages deployments list --project-name=ashwinphilips-com

# Rollback to previous deployment (if needed)
# Contact CF support or redeploy from git commit
```

---

## Development

### Local Development

```bash
pnpm run dev             # Start Astro dev server
pnpm run build           # Build for production
pnpm run preview         # Preview production build
```

### Environment Variables

**Build Time:**
- `PUBLIC_GIT_COMMIT_SHA` - Git commit hash
- `PUBLIC_BUILD_TIME` - ISO timestamp

**Runtime:**
- None required (using public API endpoints)

### Testing Organism Integration

```bash
# Test organism status
curl "https://ashwinphilips.com/api/organism-status"

# Should return:
{
  "status": "alive",
  "connections": 47,
  "debates": [...],
  "metrics": {...}
}
```

---

## Future Enhancements

### Planned (qPlan Structure)

1. **Complete GUCP Routing** (L2→L3 composition)
   - NoqNoq Hub `/route` endpoint
   - Fulqrum `/noqnoq/messages` GUCP handler
   - Remove direct API calls

2. **Analytics Backend** (L1 primitive)
   - `/api/analytics/vitals` endpoint
   - Store Web Vitals in D1
   - Dashboard for performance trends

3. **Real-time Updates** (L2 emergent)
   - WebSocket connection to NoqNoq Hub
   - Live organism status updates
   - No polling required

4. **Service Worker** (L1 primitive)
   - Offline capability
   - Background sync
   - Push notifications for organism events

### Under Consideration

- **qPlan Integration:** Track feature development as executable DAG
- **EMCAS-E Analysis:** Detect recurring failure patterns
- **qREFLEX-E Audit:** Self-analysis of reasoning in code comments

---

## Maintenance

### Performance Monitoring

**Check Core Web Vitals:**
1. Open site in Chrome
2. Open DevTools → Console
3. Run: `__webVitals.getMetrics()`
4. Review ratings (✅ good, ⚠️ needs improvement, ❌ poor)

**Production Monitoring:**
- Web Vitals sent to `/api/analytics/vitals` (when implemented)
- Cloudflare Analytics available in CF dashboard

### Organism Health

**Check organism integration:**
```bash
curl https://ashwinphilips.com/api/organism-status | jq '.'
```

**Expected Response:**
```json
{
  "status": "alive",
  "connections": 47,
  "debates": [
    {
      "headline": "...",
      "source": "...",
      "consensus": 0.94,
      "agents": ["GPT-4", "Claude-3", "Gemini"]
    }
  ]
}
```

### Dependency Updates

**Monthly:**
- `pnpm update` - Update dependencies
- Test build + deploy to preview
- Verify Web Vitals unchanged
- Promote to production

**Critical Security:**
- Update immediately
- Deploy directly to production
- Monitor for regressions

---

## Acknowledgments

**Built with:**
- Astro 5.x - Static site generator
- Cloudflare Pages - Edge hosting
- HQstack™ 1.0 - Law-governed engineering
- NoqNoq Hub - Organism nervous system
- Fulqrum - Quality assessment platform

**Embodying Principles:**
- qSLiCE: Explicit dependency graph
- ALEF: GPU-accelerated, non-blocking execution
- qState: Performance metrics as temporal memory
- CASCADE-E: Isolated failure handling

---

*Last Updated: 2026-01-31*
*HQstack Version: 1.0*
*Architecture Level: L3 (Composed System)*
