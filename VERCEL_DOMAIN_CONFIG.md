# Vercel Domain Configuration - WWW Redirect

## 🎯 Tikslas

Redirect visą WWW traffic į non-WWW canonical domain:

```
https://www.ponasobuolys.lt → https://ponasobuolys.lt (301 redirect)
```

---

## 📋 Vercel Dashboard Steps

### 1. Login į Vercel

```
https://vercel.com/login
```

### 2. Navigate to Project Settings

1. Select project: **obuolys** (ar kaip vadinasi jūsų projektas)
2. Click **Settings** tab viršuje
3. Click **Domains** iš kairės meniu

---

### 3. Configure Domains

#### Current Setup (tikėtina):

- ✅ `ponasobuolys.lt` (Primary domain)
- ✅ `www.ponasobuolys.lt` (Added domain)

#### Required Changes:

**Option A: Automatic Redirect (RECOMMENDED)** ⭐

1. Find `www.ponasobuolys.lt` in domain list
2. Click **Edit** (pencil icon)
3. Set **Redirect to**: `ponasobuolys.lt`
4. **Permanent Redirect**: Enable (301)
5. Click **Save**

**Visual representation**:

```
Domain: www.ponasobuolys.lt
Status: Active
Redirect to: ponasobuolys.lt  [dropdown]
Permanent (301): [x] Enable
```

**Option B: Manual Configuration (jei Option A neveikia)**

1. Ensure `ponasobuolys.lt` is marked as **Primary Domain**
2. For `www.ponasobuolys.lt`:
   - DNS: Point to Vercel
   - Redirect: Enable in Vercel settings

---

### 4. Verify Configuration

#### A. Check Domain Settings

```
ponasobuolys.lt
├─ Type: Production Branch
├─ Status: Active
└─ Primary: Yes ✅

www.ponasobuolys.lt
├─ Type: Redirect
├─ Status: Active
├─ Redirects to: ponasobuolys.lt
└─ Permanent: Yes (301) ✅
```

#### B. Test Redirects (po deploy)

**Using Browser**:

1. Open `https://www.ponasobuolys.lt`
2. Should automatically redirect to `https://ponasobuolys.lt`
3. Check browser URL bar - should show non-WWW

**Using curl**:

```bash
curl -I https://www.ponasobuolys.lt

# Expected response:
HTTP/2 301
location: https://ponasobuolys.lt/
```

---

## 🔍 Troubleshooting

### Issue: WWW not redirecting

**Check**:

1. Vercel Dashboard → Domains → `www.ponasobuolys.lt`
2. Verify "Redirect to" field is set
3. Verify "Permanent" checkbox is enabled

**Solution**:

```
1. Remove www.ponasobuolys.lt domain
2. Re-add www.ponasobuolys.lt
3. During add, select "Redirect to ponasobuolys.lt"
4. Enable permanent redirect
```

### Issue: Certificate errors

**Wait**: SSL certificates take 5-10 minutes to provision
**Check**: Vercel Dashboard → Domains → SSL status should be "Active"

### Issue: DNS not propagating

**Wait**: DNS changes can take 24-48 hours
**Check**: `dig www.ponasobuolys.lt` or use https://dnschecker.org

---

## ✅ Testing Checklist (po konfigūracijos)

### Immediate Tests

- [ ] Vercel Dashboard shows redirect configuration
- [ ] `www.ponasobuolys.lt` has "Redirect" type
- [ ] `ponasobuolys.lt` is "Primary Domain"

### Post-Deploy Tests (5-10 min po deploy)

- [ ] `https://www.ponasobuolys.lt` → redirects to `https://ponasobuolys.lt`
- [ ] `https://www.ponasobuolys.lt/publikacijos` → `https://ponasobuolys.lt/publikacijos`
- [ ] HTTP `curl -I` shows `301 Moved Permanently`
- [ ] Browser URL bar shows non-WWW po redirect

### SEO Tests (1-7 days po deploy)

- [ ] Google Search Console detects canonical URLs
- [ ] Sitemap uses non-WWW (already updated)
- [ ] Robots.txt uses non-WWW (already updated)
- [ ] Meta canonical tags use non-WWW (already updated)

---

## 🚀 Alternative: vercel.json Configuration

Jei Vercel Dashboard redirect neveikia, galite pridėti į `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [
        {
          "type": "host",
          "value": "www.ponasobuolys.lt"
        }
      ],
      "destination": "https://ponasobuolys.lt/:path*",
      "permanent": true
    }
  ]
}
```

**IMPORTANT**: Šis metodas naudojamas TIK jei Vercel Dashboard redirect neveikia!

---

## 📊 Expected Results

### Before Configuration

```
https://ponasobuolys.lt          ✅ Works
https://www.ponasobuolys.lt      ✅ Works (duplicate content)
→ Google sees 2 different sites
→ SEO authority split
```

### After Configuration

```
https://ponasobuolys.lt          ✅ Works (canonical)
https://www.ponasobuolys.lt      ➡️  301 → https://ponasobuolys.lt
→ Google sees 1 canonical site
→ SEO authority consolidated
```

---

## 🎯 Success Criteria

- ✅ All WWW URLs redirect to non-WWW with 301
- ✅ Redirect preserves path (www.../publikacijos → .../publikacijos)
- ✅ HTTPS enforced on all URLs
- ✅ No certificate errors
- ✅ Browser shows non-WWW in URL bar

---

## ❓ FAQ

**Q: Ar prarausiu WWW lankytojus?**
A: Ne! 301 redirect automatiškai nukreips juos į non-WWW.

**Q: Kiek laiko trunka setup?**
A: Vercel Dashboard: 5 min. DNS propagation: 5-10 min. Pilnas efektas: 24-48h.

**Q: Ar reikia keisti DNS?**
A: Ne, jei abu domains jau veikia Vercel. Tik redirect config.

**Q: Ar tai veiks su Google Search Console?**
A: Taip! Google matys 301 redirect ir indeksuos tik canonical URLs.

**Q: Ką daryti, jei redirect neveikia?**
A: 1) Check Vercel Dashboard config, 2) Wait 10 min, 3) Clear browser cache, 4) Test su curl.

---

## 📞 Support

Jei problemos:

1. Vercel Docs: https://vercel.com/docs/concepts/projects/domains
2. Vercel Support: https://vercel.com/support
3. Or ask me!

---

**Sekantis žingsnis**: Deploy changes ir configure Vercel redirect! 🚀
