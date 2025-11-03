# 📊 Project Calculator Deployment Guide

Complete deployment instructions for the project calculator lead magnet system.

## 🎯 Overview

The calculator collects project requirements and sends automated estimate emails to potential clients.

**Components**:
1. Frontend: Multi-step calculator form (`/skaiciuokle`)
2. Database: `calculator_submissions` table
3. Backend: Supabase Edge Function `send-calculator-estimate`
4. Email: Resend.com integration

---

## 📋 Pre-Deployment Checklist

### 1. Database Migration

Apply the calculator submissions table migration:

```bash
# From project root
npx supabase db push

# Or apply specific migration
psql $DATABASE_URL -f supabase/migrations/20251102000002_create_calculator_submissions.sql
```

**Verify migration**:
```sql
-- In Supabase SQL Editor
SELECT * FROM calculator_submissions LIMIT 1;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'calculator_submissions';
```

### 2. Supabase Edge Function Deployment

Deploy the email sending Edge Function:

```bash
# Login to Supabase CLI (if not already)
npx supabase login

# Link to your project
npx supabase link --project-ref jzixoslapmlqafrlbvpk

# Deploy the function
npx supabase functions deploy send-calculator-estimate

# Verify deployment
npx supabase functions list
```

### 3. Resend.com Setup

1. **Create Resend Account**: https://resend.com/signup
2. **Add Domain**:
   - Go to Domains → Add Domain
   - Add `ponasobuolys.lt`
   - Add DNS records (MX, TXT, SPF, DKIM)
   - Wait for verification (usually 1-24 hours)
3. **Create API Key**:
   - Go to API Keys → Create API Key
   - Name: "Calculator Estimates Production"
   - Permissions: Send Emails
   - Copy the key (starts with `re_`)
4. **Verify Sender Email**:
   - Use: `pasiulymai@ponasobuolys.lt`
   - Or fallback: `noreply@ponasobuolys.lt`

### 4. Environment Variables

Set in **Supabase Dashboard** → Settings → Edge Functions → Secrets:

```bash
# Required
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional (defaults provided)
SITE_URL=https://ponasobuolys.lt
```

**Set via CLI** (alternative):
```bash
npx supabase secrets set RESEND_API_KEY=re_xxxxx
npx supabase secrets set SITE_URL=https://ponasobuolys.lt
```

**Verify secrets**:
```bash
npx supabase secrets list
```

---

## 🧪 Testing

### Test Submission (Local Development)

1. Start dev server:
```bash
npm run dev
```

2. Navigate to: http://localhost:8080/skaiciuokle

3. Fill calculator:
   - Select project type: MVP
   - Select features: Authentication, File Upload
   - Keep default tech stack
   - Enter email: your-test-email@example.com

4. Click "Gauti Pasiūlymą El. Paštu"

5. Check:
   - Toast notification: "Pasiūlymas sėkmingai išsiųstas!"
   - Email inbox: Should receive estimate email
   - Supabase Dashboard → Table Editor → calculator_submissions
   - Check `email_sent` = true

### Test Edge Function Directly

```bash
curl -X POST \
  https://jzixoslapmlqafrlbvpk.supabase.co/functions/v1/send-calculator-estimate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"submission_id": "UUID_FROM_DATABASE"}'
```

### Test Email Template Locally

Create `test-email.html` with generated HTML, open in browser.

---

## 🚀 Production Deployment

### 1. Frontend Build & Deploy

```bash
# Build production
npm run build

# Deploy to Vercel (automatic via GitHub)
git add .
git commit -m "feat: add calculator lead magnet with email automation"
git push origin main
```

Vercel will automatically deploy.

### 2. Verify Production

1. Visit: https://ponasobuolys.lt/skaiciuokle
2. Test submission with real email
3. Verify email received
4. Check Supabase logs:
   - Dashboard → Edge Functions → send-calculator-estimate → Logs
   - Look for "Email sent successfully"

---

## 📊 Monitoring & Analytics

### Database Queries

**View all submissions**:
```sql
SELECT
  id,
  email,
  company_name,
  project_type,
  estimated_min_cost,
  estimated_max_cost,
  email_sent,
  email_sent_at,
  created_at
FROM calculator_submissions
ORDER BY created_at DESC
LIMIT 50;
```

**Failed emails**:
```sql
SELECT
  id,
  email,
  email_error,
  created_at
FROM calculator_submissions
WHERE email_sent = false
ORDER BY created_at DESC;
```

**Conversion metrics**:
```sql
-- Submissions per project type
SELECT
  project_type,
  COUNT(*) as count,
  AVG(estimated_min_cost) as avg_min_cost,
  AVG(estimated_max_cost) as avg_max_cost
FROM calculator_submissions
GROUP BY project_type
ORDER BY count DESC;

-- Lead status distribution
SELECT
  lead_status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM calculator_submissions
GROUP BY lead_status;
```

### Edge Function Logs

```bash
# View real-time logs
npx supabase functions logs send-calculator-estimate --tail

# View recent logs
npx supabase functions logs send-calculator-estimate --limit 100
```

### Resend Dashboard

Monitor in Resend dashboard:
- Email delivery status
- Open rates
- Click rates
- Bounce rates

---

## 🔧 Troubleshooting

### Email Not Sending

**Check 1: Edge Function Logs**
```bash
npx supabase functions logs send-calculator-estimate --tail
```

Look for errors like:
- "RESEND_API_KEY not configured" → Set env variable
- "Resend API error: 401" → Invalid API key
- "Resend API error: 403" → Domain not verified

**Check 2: Database**
```sql
SELECT email_sent, email_error, email_sent_at
FROM calculator_submissions
WHERE id = 'SUBMISSION_ID';
```

**Check 3: Resend Logs**
- Dashboard → Logs
- Filter by: Last 24 hours
- Look for failed sends

### Database Connection Issues

**Verify RLS policies**:
```sql
-- Check anon can insert
SET ROLE anon;
INSERT INTO calculator_submissions (
  email, project_type, features,
  estimated_min_cost, estimated_max_cost,
  estimated_min_weeks, estimated_max_weeks,
  recommended_package
) VALUES (
  'test@example.com', 'mvp', ARRAY['auth'],
  2500, 5000, 2, 4, 'MVP Starter'
);
RESET ROLE;
```

### Frontend Not Connecting

**Check environment variables**:
```bash
# .env.local
VITE_SUPABASE_URL=https://jzixoslapmlqafrlbvpk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

**Check browser console** for:
- Network errors
- CORS errors
- Authentication errors

---

## 📈 Performance Optimization

### Email Delivery Speed

- Resend typically delivers in < 1 second
- Edge Functions cold start: ~200-500ms
- Total time: ~1-2 seconds

### Database Indexes

Already created for performance:
- `idx_calculator_submissions_email` - Email lookups
- `idx_calculator_submissions_created_at` - Time-based queries
- `idx_calculator_submissions_lead_status` - Filtering by status

### Rate Limiting (Future)

Consider adding:
- IP-based rate limiting (5 submissions per hour)
- Email-based rate limiting (1 submission per day)
- Implement via Supabase Edge Function middleware

---

## 🛡️ Security Considerations

### Current Protection

✅ Row Level Security enabled
✅ Anonymous users can only INSERT
✅ Admins can SELECT/UPDATE/DELETE
✅ Email validation in frontend
✅ Zod validation in service layer
✅ API key stored as secret (not in code)
✅ No sensitive data in email content

### Future Enhancements

- [ ] CAPTCHA (Google reCAPTCHA or hCaptcha)
- [ ] Honeypot field (spam bot detection)
- [ ] IP-based rate limiting
- [ ] Email verification (double opt-in)

---

## 📝 Next Steps After Deployment

### Immediate (Day 1)
- [ ] Test with 3-5 real submissions
- [ ] Verify all emails delivered
- [ ] Check Supabase logs for errors
- [ ] Monitor Resend dashboard

### Short-term (Week 1)
- [ ] Add CTA links across site to calculator
- [ ] Update navigation with calculator link
- [ ] Create social media posts announcing calculator
- [ ] Set up weekly submission reports

### Long-term (Month 1)
- [ ] Analyze submission data (project types, features, budgets)
- [ ] A/B test calculator headline
- [ ] Add follow-up email sequence (3-day, 7-day)
- [ ] Create admin dashboard for submission management

---

## 📞 Support

**Issues?**
- Supabase Logs: Dashboard → Edge Functions → Logs
- Resend Status: https://status.resend.com
- Database: Dashboard → Table Editor → calculator_submissions

**Contact**:
- Email: your-email@example.com
- Supabase Support: https://supabase.com/support
- Resend Support: https://resend.com/support
