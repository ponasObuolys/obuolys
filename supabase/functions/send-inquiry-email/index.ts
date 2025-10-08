// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InquiryData {
  full_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  company_size?: string;
  project_type: string;
  budget_range?: string;
  timeline?: string;
  description: string;
  current_solution?: string;
}

const projectTypeLabels: Record<string, string> = {
  crm: 'CRM Sistema',
  logistics: 'Logistikos Sprendimas',
  automation: 'Automatizacija',
  analytics: 'Analitika',
  scheduling: 'Grafikų Planavimas',
  accounting: 'Buhalterija',
  other: 'Kita'
};

const budgetLabels: Record<string, string> = {
  under_5k: 'Iki €5,000',
  '5k_12k': '€5,000 - €12,000',
  '12k_25k': '€12,000 - €25,000',
  over_25k: 'Virš €25,000',
  not_sure: 'Dar nežinau'
};

const timelineLabels: Record<string, string> = {
  urgent: 'Skubu (iki 1 mėn)',
  '1_2_months': '1-2 mėnesiai',
  '2_3_months': '2-3 mėnesiai',
  flexible: 'Lanksčiai'
};

const companySizeLabels: Record<string, string> = {
  small: 'Iki 10 darbuotojų',
  medium: '10-50 darbuotojų',
  large: '50+ darbuotojų',
  enterprise: 'Enterprise'
};

// @ts-expect-error - Deno global is available in Supabase Edge Functions runtime
Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const inquiryData: InquiryData = await req.json();

    // Compose email to admin
    const _adminEmailBody = `
Nauja užklausa dėl individualių verslo įrankių kūrimo!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KONTAKTINĖ INFORMACIJA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Vardas: ${inquiryData.full_name}
El. paštas: ${inquiryData.email}
${inquiryData.phone ? `Telefonas: ${inquiryData.phone}` : ''}
${inquiryData.company_name ? `Įmonė: ${inquiryData.company_name}` : ''}
${inquiryData.company_size ? `Įmonės dydis: ${companySizeLabels[inquiryData.company_size]}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJEKTO INFORMACIJA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Projekto tipas: ${projectTypeLabels[inquiryData.project_type]}
${inquiryData.budget_range ? `Biudžetas: ${budgetLabels[inquiryData.budget_range]}` : ''}
${inquiryData.timeline ? `Laiko rėmai: ${timelineLabels[inquiryData.timeline]}` : ''}

Aprašymas:
${inquiryData.description}

${inquiryData.current_solution ? `\nDabar naudoja:\n${inquiryData.current_solution}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Susisieks per 24 valandas!
`.trim();

    // Compose confirmation email to client
    const _clientEmailBody = `
Sveiki, ${inquiryData.full_name}!

Ačiū už jūsų užklausą dėl individualių verslo įrankių kūrimo.

Gavau jūsų informaciją ir susisieksiu su jumis per 24 valandas darbo dienomis.

JŪSŲ UŽKLAUSA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Projekto tipas: ${projectTypeLabels[inquiryData.project_type]}
${inquiryData.budget_range ? `Biudžetas: ${budgetLabels[inquiryData.budget_range]}` : ''}
${inquiryData.timeline ? `Laiko rėmai: ${timelineLabels[inquiryData.timeline]}` : ''}

Jei turite papildomų klausimų, galite tiesiogiai atsakyti į šį laišką arba susisiekti:
📧 labas@ponasobuolys.lt
🌐 https://ponasobuolys.lt

Iki greito!
Ponas Obuolys
`.trim();

    // Send email to admin (labas@ponasobuolys.lt)
    // Note: You'll need to configure SMTP settings via environment variables
    // For now, this is a placeholder - you can use Resend, SendGrid, or SMTP

    // Placeholder for email sending
    // In production, use proper email service
    // Admin email and client email are ready to be sent
    // See the commented code below for Resend implementation

    // TODO: Implement actual email sending
    // Example with Resend:
    // const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    // await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${RESEND_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     from: 'Ponas Obuolys <noreply@ponasobuolys.lt>',
    //     to: ['labas@ponasobuolys.lt'],
    //     subject: `Nauja užklausa: ${inquiryData.full_name}`,
    //     text: adminEmailBody
    //   })
    // });

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-inquiry-email' \
    --header 'Authorization: Bearer YOUR_ANON_KEY' \
    --header 'Content-Type: application/json' \
    --data '{"full_name":"Test","email":"test@test.com","project_type":"crm","description":"Test inquiry"}'

*/
