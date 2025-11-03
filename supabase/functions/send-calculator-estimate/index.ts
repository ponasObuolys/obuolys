/**
 * Supabase Edge Function: send-calculator-estimate
 * Sends project estimate email with PDF attachment
 *
 * Usage: Triggered after calculator submission or manually by admin
 *
 * Environment Variables Required:
 * - RESEND_API_KEY: Resend.com API key for email sending
 * - SITE_URL: Full site URL (e.g., https://ponasobuolys.lt)
 */

// deno-lint-ignore-file no-explicit-any

import './types.d.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

/* eslint-disable no-console */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CalculatorSubmission {
  id: string;
  email: string;
  company_name: string | null;
  project_type: string;
  features: string[];
  tech_stack_frontend: string;
  tech_stack_backend: string;
  tech_stack_testing: boolean;
  tech_stack_premium_design: boolean;
  estimated_min_cost: number;
  estimated_max_cost: number;
  estimated_min_weeks: number;
  estimated_max_weeks: number;
  recommended_package: string;
  created_at: string;
}

/**
 * Format currency to EUR
 */
function formatCurrency(amount: number): string {
  return `€${amount.toLocaleString('lt-LT')}`;
}

/**
 * Format project type to Lithuanian
 */
function formatProjectType(type: string): string {
  const types: Record<string, string> = {
    mvp: 'MVP / Prototipas',
    crm: 'CRM Sistema',
    ecommerce: 'E-commerce Platforma',
    logistics: 'Logistikos Sistema',
    analytics: 'Analitikos Dashboard',
    custom: 'Individualus Projektas',
  };
  return types[type] || type;
}

/**
 * Format features array to Lithuanian
 */
function formatFeatures(features: string[]): string[] {
  const featureNames: Record<string, string> = {
    auth: 'Vartotojų Autentifikacija',
    realtime: 'Real-time Updates',
    fileUpload: 'File Uploads',
    payments: 'Payment Integration',
    reports: 'Complex Reports',
    mobileApp: 'Mobile App',
    apiIntegrations: 'API Integracijos',
    customWorkflows: 'Custom Workflows',
  };
  return features.map((f) => featureNames[f] || f);
}

/**
 * Generate HTML email content
 */
function generateEmailHTML(submission: CalculatorSubmission, siteUrl: string): string {
  const formattedFeatures = formatFeatures(submission.features);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 10px 0 0; opacity: 0.9; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .greeting { font-size: 18px; margin-bottom: 20px; }
    .estimate-box { background: #f9fafb; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .estimate-box h2 { margin: 0 0 15px; color: #667eea; font-size: 20px; }
    .estimate-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .estimate-row:last-child { border-bottom: none; }
    .estimate-label { font-weight: 500; color: #6b7280; }
    .estimate-value { font-weight: 600; color: #111827; }
    .highlight { background: #667eea; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
    .highlight strong { font-size: 24px; }
    .features-list { list-style: none; padding: 0; }
    .features-list li { padding: 8px 0; padding-left: 25px; position: relative; }
    .features-list li:before { content: "✓"; position: absolute; left: 0; color: #10b981; font-weight: bold; }
    .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
    .next-steps { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .next-steps h3 { margin: 0 0 15px; color: #92400e; }
    .next-steps ol { margin: 0; padding-left: 20px; }
    .footer { text-align: center; padding: 30px 20px; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
    .footer a { color: #667eea; text-decoration: none; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎯 Jūsų Projekto Įvertinimas</h1>
    <p>React & TypeScript Aplikacijų Kūrimas</p>
  </div>

  <div class="content">
    <div class="greeting">
      Labas${submission.company_name ? ` (${submission.company_name})` : ''}! 👋
    </div>

    <p>Ačiū, kad pasinaudojote projekto skaičiuokle!</p>

    <p>Žemiau rasite detalų įvertinimą pagal jūsų pasirinktus parametrus:</p>

    <div class="estimate-box">
      <h2>📊 Projekto Įvertinimas</h2>

      <div class="estimate-row">
        <span class="estimate-label">Projekto Tipas</span>
        <span class="estimate-value">${formatProjectType(submission.project_type)}</span>
      </div>

      <div class="estimate-row">
        <span class="estimate-label">Orientacinė Kaina</span>
        <span class="estimate-value">${formatCurrency(submission.estimated_min_cost)} - ${formatCurrency(submission.estimated_max_cost)}</span>
      </div>

      <div class="estimate-row">
        <span class="estimate-label">Trukmė</span>
        <span class="estimate-value">${submission.estimated_min_weeks}-${submission.estimated_max_weeks} savaitės</span>
      </div>
    </div>

    <div class="highlight">
      <p style="margin: 0 0 5px; opacity: 0.9;">Rekomenduojamas Paketas</p>
      <strong>${submission.recommended_package}</strong>
    </div>

    ${submission.features.length > 0 ? `
    <h3>✨ Pasirinktos Funkcijos:</h3>
    <ul class="features-list">
      ${formattedFeatures.map((f) => `<li>${f}</li>`).join('')}
    </ul>
    ` : ''}

    <h3>🛠️ Tech Stack:</h3>
    <ul class="features-list">
      <li><strong>Frontend:</strong> ${submission.tech_stack_frontend === 'react-typescript' ? 'React 18 + TypeScript + Vite' : 'Next.js 14 + TypeScript'}</li>
      <li><strong>Backend:</strong> ${submission.tech_stack_backend === 'supabase' ? 'Supabase (PostgreSQL + Auth + Storage)' : 'Custom Node.js + PostgreSQL'}</li>
      <li><strong>Testing:</strong> ${submission.tech_stack_testing ? 'Vitest + Playwright (95% coverage)' : 'Basic testing'}</li>
      <li><strong>Design:</strong> ${submission.tech_stack_premium_design ? 'Premium custom design system' : 'Standard Tailwind UI'}</li>
      <li><strong>Deployment:</strong> Vercel (instant deployment, global CDN)</li>
    </ul>

    <div class="next-steps">
      <h3>📅 Kiti Žingsniai</h3>
      <ol>
        <li>Gausi šį detalų pasiūlymą el. paštu (gavote! ✅)</li>
        <li>Nemokama 30min konsultacija (video call)</li>
        <li>Tikslesnė kaina ir timeline po requirements analysis</li>
        <li>Sutartis ir pradedame darbą</li>
      </ol>
    </div>

    <p style="text-align: center;">
      <a href="${siteUrl}/verslo-sprendimai#portfolio" class="cta-button">Peržiūrėti Portfolio</a>
    </p>

    <p>Susisieksiu per artimiausias 24 valandas asmeniškai aptarti jūsų projekto poreikių ir atsakyti į klausimus.</p>

    <p>Jei turite klausimų - atsakykite į šį el. laišką arba rašykite tiesiai.</p>

    <p style="margin-top: 30px;">Iki greito! 🚀<br><strong>Ponas Obuolys</strong><br>React & TypeScript Developer</p>
  </div>

  <div class="footer">
    <p>
      <a href="${siteUrl}">ponasobuolys.lt</a> |
      <a href="${siteUrl}/verslo-sprendimai">Portfolio</a> |
      <a href="${siteUrl}/kontaktai">Kontaktai</a>
    </p>
    <p style="color: #9ca3af; font-size: 12px;">
      Gaunate šį laišką nes naudojotės projekto skaičiuokle adresu ponasobuolys.lt
    </p>
  </div>
</body>
</html>
  `;
}

/**
 * Send email via Resend
 */
async function sendEmail(
  to: string,
  subject: string,
  html: string,
  resendApiKey: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Ponas Obuolys <pasiulymai@ponasobuolys.lt>',
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API error:', errorData);
      return {
        success: false,
        error: `Resend API error: ${response.status} - ${JSON.stringify(errorData)}`,
      };
    }

    const data = await response.json();
    console.log('Email sent successfully:', data);

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const siteUrl = Deno.env.get('SITE_URL') || 'https://ponasobuolys.lt';
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL not configured');
    }

    if (!supabaseServiceKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY not configured');
    }

    // Parse request body
    const { submission_id: submissionId } = await req.json();

    if (!submissionId) {
      return new Response(
        JSON.stringify({ error: 'submission_id is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch submission data
    const { data: submission, error: fetchError } = await supabase
      .from('calculator_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (fetchError || !submission) {
      console.error('Error fetching submission:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Submission not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if email already sent
    if (submission.email_sent) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Email already sent',
          sent_at: submission.email_sent_at,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate email content
    const emailHTML = generateEmailHTML(submission, siteUrl);
    const subject = `Jūsų ${formatProjectType(submission.project_type)} projekto įvertinimas - ${formatCurrency(submission.estimated_min_cost)} - ${formatCurrency(submission.estimated_max_cost)}`;

    // Send email
    const emailResult = await sendEmail(
      submission.email,
      subject,
      emailHTML,
      resendApiKey
    );

    // Update submission status
    const { error: updateError } = await supabase
      .from('calculator_submissions')
      .update({
        email_sent: emailResult.success,
        email_sent_at: emailResult.success ? new Date().toISOString() : null,
        email_error: emailResult.error || null,
      })
      .eq('id', submissionId);

    if (updateError) {
      console.error('Error updating submission:', updateError);
    }

    return new Response(
      JSON.stringify({
        success: emailResult.success,
        error: emailResult.error,
        submission_id: submissionId,
      }),
      {
        status: emailResult.success ? 200 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
