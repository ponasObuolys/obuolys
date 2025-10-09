# 🚀 Deployment Instructions - Prerender.io Integration

## ✅ Kas buvo sukurta

1. **api/_prerender.js** - Vercel Serverless Function, kuri fetches pre-rendered content iš Prerender.io
2. **vercel.json** - Atnaujintas su conditional rewrites botams
3. **PRERENDER_SETUP.md** - Pilnos setup instrukcijos
4. **FACEBOOK_SHARING_FIX.md** - Problemų sprendimo dokumentacija

---

## 📋 Deployment Steps

### 1. Pridėti Environment Variable į Vercel

#### Via Vercel Dashboard:

1. Eikite į: https://vercel.com/[your-team]/obuolys/settings/environment-variables
2. Add New:
   ```
   Key: PRERENDER_TOKEN
   Value: D9EDsSifvfj3S7qLPh0T
   Environment: Production, Preview, Development
   ```
3. Save

#### Via Vercel CLI:

```bash
vercel env add PRERENDER_TOKEN
# Paste: D9EDsSifvfj3S7qLPh0T
# Select: Production, Preview, Development
```

---

### 2. Commit Changes

```bash
git add .
git commit -m "feat: add Prerender.io integration for Facebook/social sharing SEO"
git push origin main
```

---

### 3. Vercel Auto-Deploy

Vercel automatically deploys pushinant į `main` branch.

Arba manual deploy:

```bash
vercel --prod
```

---

## 🧪 Testing

### 1. Test Prerender API Function (Local)

```bash
# Start dev server
npm run dev

# In another terminal, test API:
curl "http://localhost:5173/api/_prerender?url=/publikacijos/dirbtinio-intelekto-dalgis-pjauna-darbo-vietas"
```

**Expected**: Should return pre-rendered HTML with correct OG tags

---

### 2. Test Production with curl (Simulate Facebook Bot)

```bash
curl -A "facebookexternalhit/1.1" https://www.ponasobuolys.lt/publikacijos/dirbtinio-intelekto-dalgis-pjauna-darbo-vietas
```

**Expected**:
- Should return pre-rendered HTML
- Should contain correct `<meta property="og:title">` with specific article title
- Should contain correct `<meta property="og:image">` with article image

**Check for**:
```html
<meta property="og:title" content="Dirbtinio intelekto dalgis pjauna darbo vietas">
<meta property="og:description" content="[Article description]">
<meta property="og:image" content="https://...article-image.jpg">
```

---

### 3. Test with Facebook Sharing Debugger

#### Step 1: Clear Facebook Cache

1. Go to: https://developers.facebook.com/tools/debug/
2. Paste URL: `https://www.ponasobuolys.lt/publikacijos/dirbtinio-intelekto-dalgis-pjauna-darbo-vietas`
3. Click **"Scrape Again"**

#### Step 2: Verify OG Tags

Check that:
- ✅ Title shows article title (NOT default "ponas Obuolys - Dirbtinio intelekto žinios")
- ✅ Description shows article description
- ✅ Image shows article image
- ✅ URL is correct

---

### 4. Test Real Facebook Share

1. Go to Facebook
2. Create post
3. Paste URL: `https://www.ponasobuolys.lt/publikacijos/dirbtinio-intelekto-dalgis-pjauna-darbo-vietas`
4. Wait for preview to load
5. Verify preview shows:
   - Correct article title
   - Correct article description
   - Correct article image

---

## 🔍 Troubleshooting

### Problem: Facebook still shows default OG tags

**Solutions**:

1. **Clear Facebook cache** (MUST DO):
   - Use Facebook Debugger → "Scrape Again"
   - Facebook caches OG tags for ~7 days

2. **Check Prerender.io dashboard**:
   - Go to: https://prerender.io/
   - Check if pages are being cached
   - Check for errors

3. **Verify Vercel Environment Variable**:
   ```bash
   vercel env ls
   ```
   Should show `PRERENDER_TOKEN` in Production

4. **Check Vercel Function Logs**:
   - Go to Vercel Dashboard → Functions
   - Check `api/_prerender.js` logs
   - Look for errors

---

### Problem: Prerender.io not working

**Debug steps**:

1. Check Prerender.io status:
   ```bash
   curl -H "X-Prerender-Token: D9EDsSifvfj3S7qLPh0T" \
     "https://service.prerender.io/https://www.ponasobuolys.lt/publikacijos/dirbtinio-intelekto-dalgis-pjauna-darbo-vietas"
   ```

2. Check if conditional rewrite is matching:
   ```bash
   # Should hit prerender API
   curl -A "facebookexternalhit/1.1" -v https://www.ponasobuolys.lt/publikacijos/test 2>&1 | grep "< x-vercel"
   ```

3. Check Vercel logs:
   ```bash
   vercel logs
   ```

---

### Problem: Slow first load

**Expected behavior**:
- First crawler visit: 3-10 seconds (cache miss)
- Subsequent visits: <1 second (cache hit)

This is normal! Prerender.io needs to render page first time.

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] `PRERENDER_TOKEN` added to Vercel env vars
- [ ] Changes deployed to production
- [ ] curl test with bot user-agent returns pre-rendered HTML
- [ ] Facebook Debugger shows correct OG tags (after "Scrape Again")
- [ ] Real Facebook share preview shows article details
- [ ] Same for Kursai URLs
- [ ] Same for Įrankiai URLs

---

## 📊 Expected Results

### Before (❌):
```html
<meta property="og:title" content="ponas Obuolys - Dirbtinio intelekto žinios">
<meta property="og:description" content="Dirbtinio intelekto naujienos...">
<meta property="og:image" content="https://ponasobuolys.lt/opengraph-image.png">
```

### After (✅):
```html
<meta property="og:title" content="Dirbtinio intelekto dalgis pjauna darbo vietas">
<meta property="og:description" content="[Article-specific description]">
<meta property="og:image" content="[Article-specific image URL]">
```

---

## 🎉 Success Criteria

Sharing veikia teisingai, kai:

1. ✅ Facebook share rodo **article-specific** title, description, image
2. ✅ Twitter share rodo **article-specific** content
3. ✅ WhatsApp preview rodo **article-specific** content
4. ✅ LinkedIn share rodo **article-specific** content
5. ✅ Regular users (ne botai) mato normalią SPA aplikaciją

---

## 📞 Support

Jei kyla problemų:

1. Check Prerender.io logs: https://prerender.io/
2. Check Vercel logs: `vercel logs`
3. Re-test with Facebook Debugger
4. Contact Prerender.io support if service issues

---

**Ready to deploy!** 🚀

Eitiate į Vercel Dashboard ir pridėkite `PRERENDER_TOKEN` environment variable, tada deploy!
