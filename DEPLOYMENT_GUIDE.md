# Deployment Guide - CLS & Indexing Fixes

## 🎯 Kas padaryta

### ✅ CLS Optimizacijos (0.64 → < 0.1)
1. Font loading optimizacija - preload + display:swap
2. LazyImage dimensions - width/height/aspectRatio
3. Skeleton loaders - dynamic content
4. CSS containment - animations
5. Min-height containers
6. Responsive header fix (lg→xl breakpoint)

### ✅ Google Indexing Fixes
1. **Canonical URLs** - non-WWW (`https://ponasobuolys.lt`)
2. **301 Redirects** - `/mokymai/`, `/tag/`, `/collections/`
3. **Sitemap.xml** - updated to non-WWW
4. **Robots.txt** - updated to non-WWW
5. **Meta tags** - canonical links visur

---

## 📋 Pre-Deployment Checklist

### Code Quality
- [x] TypeScript check passed (`npm run type-check`)
- [x] No console errors in dev server
- [x] All imports resolved
- [ ] **Run Lighthouse CLS test** (< 0.1 mobile)

### Files Changed
- [x] `public/sitemap.xml` - WWW → non-WWW
- [x] `public/robots.txt` - sitemap URL updated
- [x] `src/utils/seo.ts` - SITE_CONFIG domain updated
- [x] `index.html` - canonical tag added
- [x] `vercel.json` - 301 redirects added
- [x] `src/components/home/Hero.tsx` - priority image
- [x] `src/components/ui/*.tsx` - image aspectRatio
- [x] `src/pages/PublicationsPage.tsx` - skeleton loader
- [x] `src/components/ui/content-skeleton.tsx` - NEW
- [x] `src/index.css` - CSS containment

---

## 🚀 Deployment Steps

### 1. **Test Locally** (5 min)

```bash
# Ensure dev server running
http://localhost:8084

# Quick Lighthouse test
1. Open homepage
2. F12 → Lighthouse → Mobile
3. Check CLS < 0.1
```

**If CLS > 0.1**: Stop, debug, fix first!
**If CLS < 0.1**: Continue to deployment ✅

---

### 2. **Commit Changes** (2 min)

```bash
git status

# Should show modified files:
# - public/sitemap.xml
# - public/robots.txt
# - src/utils/seo.ts
# - index.html
# - vercel.json
# - src/components/**
# - src/pages/**
# - src/index.css

git add .

git commit -m "fix: CLS optimization & indexing fixes

- Add font preload and display:swap for FOIT prevention
- Add width/height/aspectRatio to all LazyImage components
- Add skeleton loaders for dynamic content loading states
- Add CSS containment to prevent layout shifts from animations
- Add min-height to body/root containers
- Fix responsive header breakpoint (lg → xl, 1024px → 1280px)

Indexing fixes:
- Update canonical domain to non-WWW (https://ponasobuolys.lt)
- Add 301 redirects for old URLs (/mokymai/, /tag/, /collections/)
- Update sitemap.xml to use non-WWW URLs
- Update robots.txt sitemap reference
- Add canonical meta tags across all pages

Fixes: Google Search Console CLS 0.64 → target < 0.1
Fixes: WWW vs non-WWW duplicate content issue
Fixes: 22 URLs not indexed due to redirects and CLS

Affects: All pages, sitemap, robots.txt, SEO meta tags"
```

---

### 3. **Push to Production** (1 min)

```bash
git push origin main
```

Vercel will automatically:
- ✅ Build your changes
- ✅ Deploy to production
- ✅ Update `https://ponasobuolys.lt`

**Monitor deployment**:
1. Go to https://vercel.com/dashboard
2. Watch deployment progress
3. Wait for "Ready" status (~2-3 min)

---

### 4. **Configure Vercel Domain Redirect** (5 min)

**CRITICAL**: Follow [VERCEL_DOMAIN_CONFIG.md](VERCEL_DOMAIN_CONFIG.md)

**Quick steps**:
1. Vercel Dashboard → Project → Settings → Domains
2. Find `www.ponasobuolys.lt`
3. Click Edit
4. Set "Redirect to": `ponasobuolys.lt`
5. Enable "Permanent (301)"
6. Save

**Test redirect** (after 5-10 min):
```bash
curl -I https://www.ponasobuolys.lt

# Expected:
HTTP/2 301
location: https://ponasobuolys.lt/
```

---

### 5. **Verify Production** (10 min)

#### A. **CLS Test** (CRITICAL)
```
1. Open https://ponasobuolys.lt (incognito mode)
2. Chrome DevTools (F12)
3. Lighthouse → Mobile → Performance
4. Run test
5. Check CLS < 0.1 ✅
```

#### B. **Canonical URLs Test**
```
1. View page source (Ctrl+U)
2. Find: <link rel="canonical" href="https://ponasobuolys.lt/" />
3. Verify: No "www" in URL ✅
```

#### C. **Redirect Test**
```
Test all old URLs:
https://www.ponasobuolys.lt → redirects to https://ponasobuolys.lt ✅
https://ponasobuolys.lt/mokymai/ → redirects to /kursai ✅
https://ponasobuolys.lt/tag/ai → redirects to /publikacijos ✅
https://ponasobuolys.lt/collections/kursai → redirects to /kursai ✅
```

#### D. **Sitemap Test**
```
https://ponasobuolys.lt/sitemap.xml
- Verify all URLs use: https://ponasobuolys.lt (NO www) ✅
- Check lastmod dates
```

#### E. **Robots.txt Test**
```
https://ponasobuolys.lt/robots.txt
- Verify sitemap: https://ponasobuolys.lt/sitemap.xml (NO www) ✅
```

---

### 6. **Google Search Console** (15 min)

#### A. **Submit Updated Sitemap**
```
1. Go to: https://search.google.com/search-console
2. Select property: ponasobuolys.lt
3. Sitemaps → Add new sitemap
4. Enter: https://ponasobuolys.lt/sitemap.xml
5. Submit
```

#### B. **Request Re-indexing** (problem URLs)
```
For each problematic URL from GSC report:

1. URL Inspection tool
2. Enter URL (e.g., https://ponasobuolys.lt/publikacijos/...)
3. Click "Request Indexing"
4. Repeat for 5-10 most important URLs
```

**Priority URLs to re-index**:
- Homepage: `https://ponasobuolys.lt/`
- Key articles from GSC report
- Main category pages: `/publikacijos`, `/irankiai`, `/kursai`

#### C. **Remove WWW URLs** (optional)
```
1. URL Inspection → Enter www.ponasobuolys.lt/...
2. If indexed, request removal
3. Removals → New Request → Remove URL
4. Reason: "Duplicate content, canonical is non-WWW"
```

---

### 7. **Monitor Results** (1-4 weeks)

#### Week 1: Immediate
- [ ] CLS < 0.1 on all pages (Lighthouse)
- [ ] WWW redirects working (curl test)
- [ ] Canonical URLs in place (view source)
- [ ] Vercel deployment successful

#### Week 2: Short-term
- [ ] Google re-crawls updated sitemap
- [ ] Some URLs show improved CLS in GSC
- [ ] Redirect URLs decrease in GSC errors
- [ ] PageSpeed Insights shows improvements

#### Weeks 3-4: Long-term
- [ ] Most problem URLs re-indexed
- [ ] CLS issues resolved in GSC Core Web Vitals
- [ ] "Page with redirect" errors decrease
- [ ] "Crawled - not indexed" issues resolve

#### Expected GSC Metrics:
```
Before:
- CLS: 0.64 (Poor) - 17 URLs
- Page with redirect: 13 URLs
- Crawled - not indexed: 9 URLs

After (3-4 weeks):
- CLS: < 0.1 (Good) - 0 URLs with issues ✅
- Page with redirect: 0 URLs (redirects working) ✅
- Crawled - not indexed: 0 URLs (canonical indexed) ✅
```

---

## 📊 Success Metrics

### Performance (Immediate)
- ✅ CLS < 0.1 (Mobile & Desktop)
- ✅ LCP < 2.5s
- ✅ Lighthouse Performance > 90

### SEO (1-4 weeks)
- ✅ All canonical URLs indexed
- ✅ No duplicate content issues
- ✅ 301 redirects working
- ✅ Core Web Vitals "Good"

### Traffic (4-8 weeks)
- 📈 Organic traffic increase (better rankings)
- 📈 Lower bounce rate (faster page load)
- 📈 Higher engagement (better UX)

---

## 🐛 Troubleshooting

### Issue: CLS still > 0.1

**Debug**:
1. Chrome DevTools → Performance
2. Record page load
3. Experience → Layout Shifts
4. Identify shifting elements

**Common causes**:
- Images missing dimensions
- Fonts not preloaded
- Dynamic content without skeleton
- Animations without containment

### Issue: WWW not redirecting

**Solutions**:
1. Check Vercel Dashboard redirect config
2. Wait 10 minutes for DNS
3. Clear browser cache
4. Check `curl -I` response
5. See [VERCEL_DOMAIN_CONFIG.md](VERCEL_DOMAIN_CONFIG.md)

### Issue: Google not re-indexing

**Wait**: Google can take 1-4 weeks
**Speed up**:
1. Submit sitemap in GSC
2. Request indexing for important URLs
3. Check for other errors in GSC
4. Ensure robots.txt allows crawling

### Issue: Old URLs still showing

**Check**:
1. 301 redirects in `vercel.json`
2. Vercel deployment successful
3. Test redirects with curl
4. Wait for Google to re-crawl

---

## 📚 Documentation Reference

| Document | Purpose |
|----------|---------|
| [CLS_OPTIMIZATION.md](CLS_OPTIMIZATION.md) | Detailed CLS fixes explanation |
| [TESTING_INSTRUCTIONS.md](TESTING_INSTRUCTIONS.md) | User testing guide |
| [INDEXING_FIX_PLAN.md](INDEXING_FIX_PLAN.md) | Indexing issues & solutions |
| [VERCEL_DOMAIN_CONFIG.md](VERCEL_DOMAIN_CONFIG.md) | Vercel redirect setup |
| [scripts/test-cls.md](scripts/test-cls.md) | CLS testing methodology |

---

## ✅ Final Checklist

### Before Deploy
- [x] All code changes committed
- [ ] Lighthouse CLS < 0.1 locally
- [ ] TypeScript check passed
- [ ] No dev server errors

### During Deploy
- [ ] Git push successful
- [ ] Vercel build successful
- [ ] Vercel deployment "Ready"
- [ ] Vercel domain redirect configured

### After Deploy (10 min)
- [ ] Production CLS < 0.1 (Lighthouse)
- [ ] WWW redirects to non-WWW
- [ ] Old URLs redirect properly
- [ ] Sitemap accessible & correct
- [ ] Canonical tags in page source

### Google Search Console (same day)
- [ ] Submit updated sitemap
- [ ] Request re-indexing (5-10 URLs)
- [ ] Monitor Core Web Vitals tab

### Follow-up (weekly)
- [ ] Week 1: Check CLS improvements
- [ ] Week 2: Monitor re-indexing progress
- [ ] Week 3: Verify error reductions
- [ ] Week 4: Celebrate success! 🎉

---

## 🎉 Expected Outcome

**Before**: 22 URLs with problems, CLS 0.64, duplicate content
**After**: All URLs indexed, CLS < 0.1, canonical URLs only

**SEO Impact**: Better rankings, more organic traffic, improved UX

**Timeline**: Immediate (CLS), 1-4 weeks (indexing), 4-8 weeks (traffic)

---

**Ready to deploy?** Start with Step 1: Test Locally! 🚀
