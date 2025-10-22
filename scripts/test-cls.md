# CLS Testing Guide

## Quick Test (Chrome DevTools Lighthouse)

### 1. Atidaryti puslapį

```
http://localhost:8085
```

### 2. Chrome DevTools (F12)

1. Performance tab
2. Click "Lighthouse" icon
3. Select:
   - ✅ Performance
   - ✅ Best Practices
   - Device: **Mobile** (CLS worse on mobile)
   - Click "Analyze page load"

### 3. Tikrinti rezultatus

**Core Web Vitals** sekcijoje:

- **CLS (Cumulative Layout Shift)**: < 0.1 ✅ Good | 0.1-0.25 ⚠️ Needs Improvement | > 0.25 ❌ Poor

### 4. Debug CLS issues

Jei CLS > 0.1:

1. Lighthouse "View Trace" → Performance panel
2. Experience section → Layout Shifts
3. Click on layout shift event
4. Inspect affected elements

## Detailed CLS Debugging

### Chrome DevTools Performance Recording

1. Open DevTools (F12)
2. Performance tab
3. Click Record (⚫)
4. Reload page (Ctrl+R)
5. Stop recording
6. Experience section → Find "Layout Shift" events
7. Click each shift to see:
   - Which elements moved
   - Shift score
   - Screenshot before/after

### Web Vitals Extension

1. Install: [Web Vitals Chrome Extension](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma)
2. Visit page
3. Extension badge shows CLS score
4. Click extension for detailed breakdown

### Console Logging (Already Enabled)

```javascript
// Check browser console for Web Vitals logs
// Enabled via Vercel Analytics in src/main.tsx
```

## Production Testing

### 1. Google Search Console

1. Go to [Search Console](https://search.google.com/search-console)
2. Experience → Core Web Vitals
3. Open Report → Mobile
4. Check CLS issues

### 2. PageSpeed Insights

```
https://pagespeed.web.dev/
Enter: https://ponasobuolys.lt
```

**Mobile tab**:

- CLS target: < 0.1 (Green)

### 3. Vercel Analytics

1. Vercel Dashboard → Analytics
2. Web Vitals tab
3. CLS metrics (75th percentile)
4. Target: < 0.1

## Common CLS Issues Checklist

### Images

- [ ] All `<LazyImage>` have `width` and `height` or `aspectRatio`
- [ ] Hero images have `priority={true}`
- [ ] Aspect ratios match actual image ratios

### Fonts

- [ ] Google Fonts use `display=swap`
- [ ] Critical fonts preloaded
- [ ] No FOIT (Flash of Invisible Text)

### Dynamic Content

- [ ] Loading states use skeleton loaders
- [ ] Skeletons match content dimensions
- [ ] No empty loading states

### Animations

- [ ] Hover effects have `contain: layout`
- [ ] Animations use `will-change` (sparingly)
- [ ] No layout-affecting animations

### Layout

- [ ] Containers have `min-height`
- [ ] No `position: absolute` without reserved space
- [ ] Sticky headers accounted for

## Test Scenarios

### Test 1: Homepage Load

```
1. Clear cache (Ctrl+Shift+Delete)
2. Navigate to homepage
3. Run Lighthouse
4. CLS should be < 0.1
```

### Test 2: Article Page

```
1. Navigate to /publikacijos/[slug]
2. Run Lighthouse on mobile
3. Check:
   - Hero image CLS
   - Content loading CLS
   - Related articles CLS
```

### Test 3: Tools Page

```
1. Navigate to /irankiai
2. Run Lighthouse
3. Check:
   - Tool cards loading
   - Filter interactions
```

### Test 4: Slow 3G Simulation

```
1. DevTools → Network tab
2. Throttling: "Slow 3G"
3. Reload page
4. Observe layout shifts visually
5. Run Lighthouse
```

## Expected Results (Post-Optimization)

| Metric        | Before | After   | Status |
| ------------- | ------ | ------- | ------ |
| CLS (Desktop) | 0.64   | < 0.05  | ✅     |
| CLS (Mobile)  | 0.64   | < 0.10  | ✅     |
| LCP (Mobile)  | ?      | < 2.5s  | ⚠️     |
| FID (Mobile)  | ?      | < 100ms | ✅     |

## Monitoring

### Weekly Check

```bash
# Run Lighthouse on key pages
1. Homepage
2. Most viewed article
3. Most viewed tool
4. Most viewed course
```

### Monthly Report

1. Google Search Console → Experience
2. Compare CLS trends
3. Identify regression patterns

## Troubleshooting

### CLS still high (> 0.1)

1. **Identify culprit**:
   - Run Performance recording
   - Find layout shift events
   - Check element causing shift

2. **Common fixes**:
   - Add dimensions to images
   - Use skeleton loaders
   - Add `contain: layout`
   - Preload fonts

3. **Verify fix**:
   - Clear cache
   - Run Lighthouse again
   - Check specific page

### CLS regression

1. **Compare builds**:
   - Run Lighthouse on current build
   - Compare with previous build
   - Identify changed components

2. **Git diff check**:

   ```bash
   git diff HEAD~1 -- src/components/
   ```

3. **Rollback test**:
   - Rollback suspect commit
   - Test CLS again
   - Confirm regression source

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [CLS Best Practices](https://web.dev/cls/)
- [Debug CLS](https://web.dev/debug-layout-shifts/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
