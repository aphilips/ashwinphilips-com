# Deployment Guide for ashwinphilips.com

## Pre-Deployment Checklist

### 1. Content Review
- [ ] All placeholder content identified (see CONTENT_NEEDS.md)
- [ ] No trade secrets exposed (qSLiCE methodology protected)
- [ ] No console errors in development
- [ ] Mobile experience tested
- [ ] All links working

### 2. Technical Validation
```bash
# Install dependencies
pnpm install

# Run type checking
pnpm run astro check

# Build for production (catches build errors)
pnpm run build

# Preview production build locally
pnpm run preview
```

### 3. Environment Setup
- [ ] Cloudflare account access (emergentsolutions)
- [ ] Wrangler CLI installed: `npm install -g wrangler`
- [ ] Authenticated: `wrangler login`
- [ ] Correct account ID in wrangler.toml: `e96bb31487f9eb55d16182dc4b5544e5`

---

## Deployment Steps

### Step 1: Preview Deployment (TEST FIRST!)

```bash
# Build the site
pnpm run build

# Deploy to preview environment
wrangler deploy --env preview

# Output will show: https://ashwinphilips-com-preview.<subdomain>.workers.dev
```

**Test the preview thoroughly**:
- [ ] Home page loads with particles
- [ ] All nav links work
- [ ] Three.js animations smooth
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Contact form UI works (backend pending)
- [ ] /agents page loads correctly

### Step 2: DNS Configuration

**BEFORE production deployment**, ensure DNS is configured:

1. Log into Cloudflare dashboard
2. Select domain: `ashwinphilips.com`
3. Go to DNS settings
4. Verify/Add records:
   ```
   Type: A
   Name: @
   Content: 192.0.2.1 (Cloudflare proxy IP)
   Proxy: ON (orange cloud)

   Type: CNAME
   Name: www
   Content: ashwinphilips.com
   Proxy: ON (orange cloud)
   ```

### Step 3: Production Deployment

```bash
# Final build
pnpm run build

# Deploy to production
wrangler deploy --env production

# Or use the shorthand
pnpm run deploy
```

**Verify deployment**:
1. Visit https://ashwinphilips.com
2. Check all routes work
3. Test from mobile device
4. Verify SSL certificate active
5. Run Lighthouse audit (target: 95+ across all categories)

---

## Post-Deployment

### Immediate Actions
1. **Test all functionality**
   - Navigate through all pages
   - Test responsive design
   - Check particle animations
   - Verify external links

2. **SEO Verification**
   ```bash
   # Check sitemap
   curl https://ashwinphilips.com/sitemap.xml

   # Check robots.txt
   curl https://ashwinphilips.com/robots.txt

   # Verify meta tags
   # Use: https://www.opengraph.xyz
   # Or: https://cards-dev.twitter.com/validator
   ```

3. **Performance Check**
   - Run Lighthouse audit
   - Check Core Web Vitals
   - Verify image optimization
   - Test from different locations

### Configure Analytics (Optional but Recommended)

If using Cloudflare Web Analytics:
```bash
# Add analytics site ID to wrangler.toml
[env.production.analytics_engine_datasets]
binding = "ANALYTICS"
dataset = "ashwinphilips_analytics"
```

---

## Rollback Procedure

If something goes wrong:

```bash
# List recent deployments
wrangler deployments list

# Rollback to previous version
wrangler rollback [DEPLOYMENT_ID]
```

Or redeploy a known-good version:
```bash
git checkout [PREVIOUS_COMMIT]
pnpm run build
wrangler deploy --env production
git checkout main
```

---

## Monitoring & Maintenance

### Regular Checks
1. **Weekly**: Check Cloudflare analytics for errors
2. **Monthly**: Update dependencies: `pnpm update`
3. **Quarterly**: Lighthouse audit, accessibility review
4. **As Needed**: Content updates via simple redeployment

### Logs & Debugging
```bash
# Stream real-time logs
wrangler tail --env production

# View specific errors
# Check Cloudflare dashboard > Workers & Pages > ashwinphilips-com-production > Logs
```

### Common Issues

**Issue**: Site not loading
- Check DNS propagation: `dig ashwinphilips.com`
- Verify Cloudflare proxy enabled (orange cloud)
- Check Workers logs for errors

**Issue**: Slow particle animations
- Reduce particle count in ParticleField.ts
- Check if device/browser supports WebGL

**Issue**: Images not loading
- Verify assets built correctly: check `/dist` folder
- Ensure wrangler.toml assets binding correct

---

## Domain Configuration Reference

### Current Setup
- **Domain**: ashwinphilips.com
- **Registrar**: (To be confirmed)
- **DNS**: Cloudflare
- **Hosting**: Cloudflare Workers
- **Account**: emergentsolutions

### SSL/TLS
- Cloudflare automatic SSL (should be enabled)
- Force HTTPS redirect (configure in Cloudflare dashboard)
- Minimum TLS version: 1.2

### Headers & Security
Cloudflare Workers automatically provide:
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options

Additional hardening in Astro config if needed.

---

## Updating Content

When Ashwin provides content (photos, music, etc.):

1. Add assets to `/public` directory
2. Update relevant page files
3. Test locally: `pnpm run dev`
4. Build and deploy: `pnpm run deploy`

**Simple deployment cycle**:
```bash
# 1. Make changes
# 2. Test locally
pnpm run dev

# 3. Build
pnpm run build

# 4. Deploy
pnpm run deploy

# 5. Verify live
# Visit https://ashwinphilips.com
```

---

## Emergency Contacts

If deployment issues arise:

1. **Cloudflare Support**: https://support.cloudflare.com
2. **Astro Discord**: https://astro.build/chat (fast community support)
3. **NoqNoq Patterns**: Query for similar deployment issues

---

## Success Criteria

Deployment is successful when:
- [ ] https://ashwinphilips.com loads in <3 seconds
- [ ] All pages accessible and rendering correctly
- [ ] Zero console errors
- [ ] Lighthouse score 95+ across all categories
- [ ] Mobile experience smooth
- [ ] Particle animations performant
- [ ] Contact form UI functional (backend when added)
- [ ] /agents page loads for AI systems

---

**Deployed successfully?**

Celebrate 🎉, then document any issues or learnings in the repo for future reference.

**Questions during deployment?**

Check Cloudflare Workers docs or NoqNoq patterns for similar deployments.
