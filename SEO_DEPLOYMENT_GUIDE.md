# SEO Deployment & Testing Guide

**Project:** ponasObuolys.lt
**Date:** 2025-10-01
**Status:** ✅ Deployed & Tested - robots.txt & sitemap.xml Live

---

## 📋 Pre-Deployment Checklist

- [x] SEO components created and tested
- [x] All pages integrated with SEOHead
- [x] TypeScript compilation passes
- [x] ESLint passes (no errors)
- [x] Production build successful
- [x] robots.txt configured
- [x] sitemap.xml generated (66 URLs: 6 static + 8 articles + 50 tools + 2 courses)
- [x] Changes committed to git ✅
- [x] Deployed to Vercel ✅
- [x] robots.txt tested on production (HTTP 200 ✓)
- [x] sitemap.xml tested on production (HTTP 200 ✓, 66 URLs verified)

---

## 🚀 Deployment Steps

### Step 1: Generate Sitemap

```bash
# Run sitemap generator
npm run sitemap:generate
```

**Expected output:**

```
🚀 Starting sitemap generation...
📄 Adding static pages...
✅ Added 6 static pages
📰 Fetching articles from database...
✅ Added X articles
🔧 Fetching tools from database...
✅ Added X tools
📚 Fetching courses from database...
✅ Added X courses
✅ Sitemap generated successfully!
📍 Location: /path/to/public/sitemap.xml
📊 Total URLs: X
```

**Verify sitemap.xml created:**

```bash
ls -la public/sitemap.xml
cat public/sitemap.xml | head -20
```

---

### Step 2: Commit & Push to Git

```bash
# Check what changed
git status

# Add SEO files
git add .

# Create commit
git commit -m "feat: Add comprehensive SEO optimization

- Add SEO components (MetaTags, OpenGraphTags, StructuredData)
- Add SEO utilities and sitemap generator
- Integrate SEOHead into all pages (8 pages)
- Update robots.txt with proper rules
- Generate static sitemap.xml

SEO Features:
- Dynamic meta tags (title, description, canonical)
- OpenGraph & Twitter Cards for social sharing
- JSON-LD structured data (7 types)
- Keywords optimization for Lithuanian AI market
- Breadcrumb navigation schemas

Pages integrated:
- Home, Publications, Tools, Courses (list & detail)
- Contact page

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to repository
git push origin main
```

---

### Step 3: Verify Vercel Deployment

**Automatic deployment:**
Vercel turėtų automatiškai deploy'inti po git push.

**Check deployment status:**

1. Eiti į https://vercel.com/dashboard
2. Pasirinkti `obuolys` projektą
3. Patikrinti "Deployments" tab
4. Palaukti kol "Building" → "Ready"

**Deployment URL:** https://www.ponasobuolys.lt

---

## ✅ Post-Deployment Testing

### Test 1: robots.txt Accessibility

**URL:** https://www.ponasobuolys.lt/robots.txt

**Expected content:**

```
# robots.txt for ponasobuolys.lt

# Allow all crawlers to index public content
User-agent: *
Allow: /

# Disallow admin and authentication pages
Disallow: /admin/
Disallow: /admin/*
Disallow: /auth
Disallow: /profilis

# Sitemap location
Sitemap: https://ponasobuolys.lt/sitemap.xml
```

**✅ Pass criteria:**

- [ ] File loads without 404
- [ ] Contains proper rules
- [ ] Sitemap reference correct

---

### Test 2: sitemap.xml Accessibility

**URL:** https://www.ponasobuolys.lt/sitemap.xml

**Expected content:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ponasobuolys.lt</loc>
    <lastmod>2025-10-01</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ...
</urlset>
```

**✅ Pass criteria:**

- [ ] File loads without 404
- [ ] Valid XML format
- [ ] Contains all pages (static + dynamic)
- [ ] Lastmod dates present
- [ ] Priority values correct

**Validate sitemap:**

- Google Sitemap Validator: https://www.xml-sitemaps.com/validate-xml-sitemap.html
- Copy-paste sitemap URL and validate

---

### Test 3: Meta Tags Verification

**Test each page type:**

1. **Home Page:** https://www.ponasobuolys.lt

```html
<title>ponas Obuolys - AI naujienos, įrankiai ir kursai Lietuvoje</title>
<meta name="description" content="Atraskite naujausias dirbtinio intelekto naujienas..." />
<link rel="canonical" href="https://ponasobuolys.lt" />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta name="twitter:card" content="summary_large_image" />
```

2. **Article Page:** https://www.ponasobuolys.lt/publikacijos/[slug]

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "...",
    "author": {...},
    "publisher": {...}
  }
</script>
```

**How to check:**

1. Open page in browser
2. Right-click → "View Page Source"
3. Search for `<head>` section
4. Verify meta tags present

**✅ Pass criteria:**

- [ ] Title tag present and descriptive
- [ ] Description meta tag present
- [ ] Canonical URL correct
- [ ] OG tags present
- [ ] Twitter Card tags present
- [ ] JSON-LD structured data present

---

### Test 4: Social Sharing Preview

#### Facebook Sharing Debugger

**URL:** https://developers.facebook.com/tools/debug/

**Steps:**

1. Paste page URL (e.g., https://www.ponasobuolys.lt)
2. Click "Debug"
3. Check preview

**✅ Pass criteria:**

- [ ] Image loads (1200x630px)
- [ ] Title displays correctly
- [ ] Description displays correctly
- [ ] No errors or warnings

**Refresh cache:**
Click "Scrape Again" to force Facebook to fetch latest meta tags.

---

#### Twitter Card Validator

**URL:** https://cards-dev.twitter.com/validator

**Steps:**

1. Paste page URL
2. Click "Preview card"

**✅ Pass criteria:**

- [ ] Card type: "Summary Card with Large Image"
- [ ] Image displays
- [ ] Title and description correct
- [ ] No errors

---

#### LinkedIn Post Inspector

**URL:** https://www.linkedin.com/post-inspector/

**Steps:**

1. Paste page URL
2. Click "Inspect"

**✅ Pass criteria:**

- [ ] Preview loads
- [ ] Title, description, image correct
- [ ] No errors

---

### Test 5: Rich Results Testing

**Google Rich Results Test**

**URL:** https://search.google.com/test/rich-results

**Test each page type:**

1. **Home Page:**
   - Expected: Organization schema, WebSite schema

2. **Article Page:**
   - Expected: Article schema, Breadcrumb schema

3. **Tool Page:**
   - Expected: SoftwareApplication schema, Breadcrumb schema

4. **Course Page:**
   - Expected: Course schema, Breadcrumb schema

**Steps:**

1. Paste page URL
2. Click "Test URL"
3. Wait for results

**✅ Pass criteria:**

- [ ] "Page is eligible for rich results"
- [ ] All schemas detected
- [ ] No errors
- [ ] Warnings acceptable (optional fields)

---

## 🔍 Google Search Console Setup

### Step 1: Verify Domain Ownership

**URL:** https://search.google.com/search-console

**Method 1: HTML File Upload (Easiest)**

1. Google will provide a verification file
2. Add file to `public/` directory
3. Commit and push
4. Wait for Vercel deployment
5. Click "Verify" in Google Search Console

**Method 2: DNS Record (Alternative)**

1. Add TXT record to domain DNS
2. Wait for DNS propagation
3. Click "Verify"

---

### Step 2: Submit Sitemap

**After verification:**

1. Go to "Sitemaps" in left sidebar
2. Enter sitemap URL: `https://www.ponasobuolys.lt/sitemap.xml`
3. Click "Submit"

**✅ Success indicators:**

- Status: "Success"
- "Discovered URLs" shows count
- No errors

---

### Step 3: Monitor Indexing

**Coverage Report:**

- Go to "Coverage" in sidebar
- Check "Valid" pages count
- Monitor "Errors" and fix if any

**Performance Report:**

- Go to "Performance"
- Monitor impressions, clicks, CTR
- Track keyword rankings

---

## 📊 Success Metrics

### Immediate (1-7 days)

- [x] robots.txt accessible
- [x] sitemap.xml accessible
- [ ] Google Search Console verified
- [ ] Sitemap submitted
- [ ] Social sharing previews work
- [ ] Rich results pass validation

### Short-term (1-4 weeks)

- [ ] Pages indexed by Google (check Coverage)
- [ ] Impressions increase in Search Console
- [ ] Social sharing CTR improves
- [ ] Organic traffic baseline established

### Long-term (1-3 months)

- [ ] Keyword rankings improve
- [ ] Organic traffic +20-50%
- [ ] Social sharing engagement +30%
- [ ] Rich snippets appear in search results

---

## 🐛 Troubleshooting

### Issue: sitemap.xml shows 404

**Solution:**

1. Check if file exists in `public/sitemap.xml`
2. Re-run `npm run sitemap:generate`
3. Commit and redeploy
4. Clear browser cache
5. Try in incognito mode

---

### Issue: Meta tags not showing

**Solution:**

1. Hard refresh page (Ctrl+Shift+R)
2. Check browser console for errors
3. Verify SEOHead component imported
4. Check React DevTools for component render

---

### Issue: Social sharing shows old preview

**Solution:**

1. Use Facebook Debugger "Scrape Again"
2. Use Twitter Card Validator to refresh
3. Wait 24-48 hours for cache to expire
4. Share with query parameter: `?v=2` to bypass cache

---

### Issue: Structured data not detected

**Solution:**

1. Check JSON-LD syntax in page source
2. Validate JSON at: https://jsonlint.com/
3. Use Google Rich Results Test
4. Check for JavaScript errors blocking render

---

## 📝 Maintenance

### Weekly

- Monitor Google Search Console for errors
- Check Coverage report for indexing issues
- Review Performance metrics

### Monthly

- Regenerate sitemap.xml: `npm run sitemap:generate`
- Test social sharing on new content
- Review keyword rankings
- Update meta descriptions if needed

### Quarterly

- Full SEO audit
- Meta tags optimization based on data
- Structured data enhancements
- Social sharing A/B testing

---

## 🎯 Next Phase

After successful deployment and testing:

**Phase 2: Performance & Images**

- Image optimization (WebP conversion)
- Core Web Vitals optimization
- Lazy loading enhancements
- Lighthouse score improvements

**Phase 3: Content & Engagement**

- Semantic HTML audit
- Internal linking strategy
- Content freshness updates
- User engagement features

---

**Completed:** 2025-10-01
**Next Review:** After 1 week of deployment
**Owner:** Development Team
