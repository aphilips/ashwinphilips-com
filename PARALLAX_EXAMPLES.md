# Parallax Animation Examples & Patterns

## Quick Reference Guide

### Basic Patterns

#### 1. Simple Background Parallax
```html
<!-- Slow-moving background image -->
<section class="relative overflow-hidden">
  <img
    src="/bg.jpg"
    class="absolute inset-0 w-full h-full object-cover parallax-slow"
    data-parallax-speed="0.3"
  />
  <div class="relative z-10">
    <!-- Content here -->
  </div>
</section>
```

#### 2. Multi-Layer Parallax (Depth Effect)
```html
<section class="relative overflow-hidden">
  <!-- Furthest layer (slowest) -->
  <div
    class="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900"
    data-parallax-speed="0.2"
  ></div>

  <!-- Middle layer -->
  <div
    class="absolute inset-0 bg-gradient-to-r from-transparent to-blue-500/30"
    data-parallax-speed="0.4"
  ></div>

  <!-- Foreground content (no parallax, scrolls normally) -->
  <div class="relative z-10">
    <h1>Title</h1>
  </div>
</section>
```

#### 3. Fade-in Cards (Staggered)
```html
<div class="grid md:grid-cols-3 gap-8">
  <div class="card fade-in-on-scroll card-parallax" data-fade-delay="0">
    Card 1 - Appears first
  </div>

  <div class="card fade-in-on-scroll card-parallax" data-fade-delay="100">
    Card 2 - Appears 100ms later
  </div>

  <div class="card fade-in-on-scroll card-parallax" data-fade-delay="200">
    Card 3 - Appears 200ms later
  </div>
</div>
```

#### 4. Directional Fade-in
```html
<!-- Fade in from left -->
<div class="fade-in-on-scroll" data-fade-direction="left" data-fade-distance="40">
  Slides in from the left
</div>

<!-- Fade in from right -->
<div class="fade-in-on-scroll" data-fade-direction="right" data-fade-distance="40">
  Slides in from the right
</div>

<!-- Fade in from bottom (default) -->
<div class="fade-in-on-scroll" data-fade-direction="up" data-fade-distance="30">
  Slides up from bottom
</div>

<!-- Fade in from top -->
<div class="fade-in-on-scroll" data-fade-direction="down" data-fade-distance="30">
  Slides down from top
</div>
```

#### 5. Card Hover Parallax
```html
<!-- Cards that lift on hover -->
<div class="grid md:grid-cols-2 gap-6">
  <div class="p-6 bg-white rounded-lg card-parallax">
    Hover me - I lift up!
  </div>

  <div class="p-6 bg-white rounded-lg card-parallax">
    Me too!
  </div>
</div>
```

### Advanced Patterns

#### 6. Hero Section with Multi-Layer Parallax
```html
<section class="relative min-h-screen overflow-hidden">
  <!-- Background video (slowest) -->
  <video
    class="absolute inset-0 w-full h-full object-cover opacity-40"
    data-parallax-speed="0.2"
    autoplay
    muted
    loop
  >
    <source src="/hero.mp4" type="video/mp4" />
  </video>

  <!-- Gradient overlay (medium) -->
  <div
    class="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent"
    data-parallax-speed="0.4"
  ></div>

  <!-- Ambient glow (faster) -->
  <div
    class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full"
    data-parallax-speed="0.6"
  ></div>

  <!-- Content (normal scroll) -->
  <div class="relative z-10 container min-h-screen flex items-center">
    <h1 class="text-6xl font-bold fade-in-on-scroll">
      Welcome
    </h1>
  </div>
</section>
```

#### 7. Numbered List with Parallax Icons
```html
<div class="space-y-12">
  <div class="flex gap-6 fade-in-on-scroll" data-fade-delay="0">
    <div class="w-16 h-16 bg-blue-500 rounded-lg parallax-slow">01</div>
    <div class="flex-1">
      <h3>First Item</h3>
      <p>Description...</p>
    </div>
  </div>

  <div class="flex gap-6 fade-in-on-scroll" data-fade-delay="100">
    <div class="w-16 h-16 bg-purple-500 rounded-lg parallax-slow">02</div>
    <div class="flex-1">
      <h3>Second Item</h3>
      <p>Description...</p>
    </div>
  </div>
</div>
```

#### 8. Split Hero (Photo + Text with Directional Fade)
```html
<div class="grid md:grid-cols-2 gap-12">
  <!-- Left: Photo fades in from left -->
  <div class="fade-in-on-scroll" data-fade-direction="left" data-fade-delay="0">
    <img src="/photo.jpg" alt="Photo" class="rounded-lg" />
  </div>

  <!-- Right: Text fades in from right -->
  <div class="fade-in-on-scroll" data-fade-direction="right" data-fade-delay="200">
    <h1>Title</h1>
    <p>Description...</p>
  </div>
</div>
```

#### 9. Project Grid with Hover + Fade
```html
<div class="grid md:grid-cols-3 gap-8">
  <!-- Each project card -->
  <div class="fade-in-on-scroll card-parallax" data-fade-delay="0">
    <img src="/project1.jpg" alt="Project 1" />
    <h3>Project Name</h3>
    <p>Description</p>
  </div>

  <div class="fade-in-on-scroll card-parallax" data-fade-delay="100">
    <img src="/project2.jpg" alt="Project 2" />
    <h3>Project Name</h3>
    <p>Description</p>
  </div>

  <div class="fade-in-on-scroll card-parallax" data-fade-delay="200">
    <img src="/project3.jpg" alt="Project 3" />
    <h3>Project Name</h3>
    <p>Description</p>
  </div>
</div>
```

### Speed Reference

```javascript
// Parallax speed values (0.0 - 1.0)
0.0  // No movement (static)
0.2  // Very slow (background mountains)
0.3  // Slow (.parallax-slow - background layers)
0.4  // Medium-slow (gradient overlays)
0.5  // Medium (.parallax-medium - standard parallax)
0.6  // Medium-fast (floating elements)
0.7  // Fast (.parallax-fast - foreground elements)
0.8  // Very fast (rarely used)
1.0  // Same speed as scroll (no parallax effect)
```

### Delay Reference

```javascript
// Fade-in delays (milliseconds)
0    // Immediate
100  // Slight delay
200  // Medium delay
300  // Noticeable delay
400  // Long delay
500+ // Very long delay (use sparingly)
```

### Distance Reference

```javascript
// Fade-in distances (pixels)
20   // Subtle movement
30   // Standard movement (default)
40   // Noticeable movement
50   // Large movement
60+  // Very large movement (use sparingly)
```

## Real-World Examples from Site

### About Page Hero
```html
<section class="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
  <!-- Multi-layer gradients with different speeds -->
  <div class="absolute inset-0 opacity-30">
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(102,126,234,0.15),transparent_50%)]"
      data-parallax-speed="0.2"
    ></div>
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(118,75,162,0.1),transparent_50%)]"
      data-parallax-speed="0.4"
    ></div>
  </div>

  <div class="relative container pt-32 pb-24 z-10">
    <div class="grid md:grid-cols-[300px_1fr] gap-12 items-start">
      <!-- Photo: fade from left -->
      <div class="fade-in-on-scroll" data-fade-direction="left" data-fade-delay="0">
        <img src="/photo.jpg" alt="Ashwin" class="rounded-2xl" />
      </div>

      <!-- Text: fade from right -->
      <div class="fade-in-on-scroll" data-fade-direction="right" data-fade-delay="200">
        <h1>Ashwin Kochiyil Philips</h1>
        <p>Systems architect, consciousness researcher...</p>
      </div>
    </div>
  </div>
</section>
```

### Projects Page Card
```html
<div id="fulqrum" class="scroll-mt-20 fade-in-on-scroll card-parallax" data-fade-delay="200">
  <div class="p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200">
    <div class="flex items-start gap-6">
      <div class="w-16 h-16 text-primary-600">
        <!-- Icon -->
      </div>
      <div class="flex-1">
        <h2>Fulqrum</h2>
        <p>Multi-Agent AI Orchestration Platform</p>
        <!-- Details -->
      </div>
    </div>
  </div>
</div>
```

### Home Page Feature Cards
```html
<div class="grid md:grid-cols-3 gap-8">
  <!-- Systems Architecture -->
  <div
    class="p-8 bg-white rounded-lg border hover:border-primary-500 fade-in-on-scroll card-parallax"
    data-fade-delay="0"
  >
    <h3>Systems Architecture</h3>
    <p>Production-scale distributed systems...</p>
  </div>

  <!-- AI Research -->
  <div
    class="p-8 bg-white rounded-lg border hover:border-primary-500 fade-in-on-scroll card-parallax"
    data-fade-delay="100"
  >
    <h3>AI Research</h3>
    <p>Novel pattern recognition approaches...</p>
  </div>

  <!-- Music Production -->
  <div
    class="p-8 bg-white rounded-lg border hover:border-primary-500 fade-in-on-scroll card-parallax"
    data-fade-delay="200"
  >
    <h3>Music Production</h3>
    <p>Electronic and ambient composition...</p>
  </div>
</div>
```

## Common Combinations

### Hero Background + Foreground Content
```html
<!-- Slow background, normal foreground -->
<section class="relative">
  <img src="/bg.jpg" class="parallax-slow" data-parallax-speed="0.3" />
  <div class="relative z-10">
    <h1 class="fade-in-on-scroll">Title</h1>
  </div>
</section>
```

### Staggered Grid
```html
<!-- 3-column grid, stagger by 100ms -->
<div class="grid md:grid-cols-3 gap-6">
  <div class="fade-in-on-scroll" data-fade-delay="0">Card 1</div>
  <div class="fade-in-on-scroll" data-fade-delay="100">Card 2</div>
  <div class="fade-in-on-scroll" data-fade-delay="200">Card 3</div>
</div>
```

### Icon + Parallax Badge
```html
<div class="flex gap-6">
  <div class="w-16 h-16 bg-blue-500 rounded-lg parallax-slow">
    01
  </div>
  <div class="flex-1">
    <h3>Title</h3>
    <p>Content</p>
  </div>
</div>
```

## Performance Tips

1. **Limit parallax elements**: Don't parallax everything. Use strategically.
2. **Reduce on mobile**: Mobile automatically gets 50% speed reduction.
3. **Use will-change sparingly**: Only on actively animating elements.
4. **Prefer transforms**: Never animate top/left, always use transform.
5. **Batch stagger delays**: Use multiples of 100ms (0, 100, 200, 300...).
6. **Test scroll performance**: Aim for consistent 60fps.

## Accessibility Checklist

- ✅ Respects `prefers-reduced-motion`
- ✅ All content accessible without animation
- ✅ No infinite animations (scroll-based only)
- ✅ Keyboard navigation unaffected
- ✅ Screen reader content unaffected
- ✅ Focus indicators visible

## Browser Testing

Test in:
- Chrome/Edge (Chromium)
- Firefox
- Safari (macOS/iOS)
- Mobile browsers (iOS Safari, Chrome Android)

## Debugging

```javascript
// In browser console:

// Check if parallax controller exists
window.parallaxController

// View all parallax elements
window.parallaxController.parallaxElements

// View all fade elements
window.parallaxController.fadeElements

// Disable parallax temporarily
window.parallaxController.destroy()
```

## Migration from Static

**Before:**
```html
<div class="card">Static card</div>
```

**After:**
```html
<div class="card fade-in-on-scroll card-parallax" data-fade-delay="0">
  Animated card
</div>
```

That's it! The parallax system auto-discovers and initializes all elements on page load.
