/**
 * Vercel Serverless funkcija Stripe Checkout sesijos kūrimui
 * Endpoint: POST /api/create-checkout-session
 */

async function readRequestBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  if (!chunks.length) {
    return '';
  }

  return Buffer.concat(chunks).toString('utf-8');
}

module.exports = async (req, res) => {
  try {
    // SVARBU: Nustatyti CORS headers PIRMIAUSIAI
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Method not allowed',
      });
    }

    // Inicializuoti Stripe FUNKCIJOS VIDUJE (ne module scope)
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('CRITICAL: STRIPE_SECRET_KEY is not set in environment variables');
      return res.status(500).json({
        error: 'Stripe konfigūracija neįkelta',
        details: 'STRIPE_SECRET_KEY environment variable not found',
      });
    }

    let stripe;
    try {
      stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    } catch (stripeError) {
      console.error('Failed to initialize Stripe SDK:', stripeError);
      return res.status(500).json({
        error: 'Stripe SDK initialization failed',
        details: stripeError instanceof Error ? stripeError.message : 'Unknown error loading Stripe',
      });
    }

    let body = req.body;

    if (body === undefined || body === null || body === '') {
      const rawBody = await readRequestBody(req);
      body = rawBody;
    }

    if (typeof body === 'string') {
      if (!body.trim()) {
        body = null;
      } else {
        try {
          body = JSON.parse(body);
        } catch (parseError) {
          console.error('Invalid JSON payload received:', parseError.message);
          return res.status(400).json({
            error: 'Neteisingas JSON formatas',
            details: 'Pateikti duomenys nėra tinkamai suformuotas JSON',
          });
        }
      }
    }

    if (!body || typeof body !== 'object') {
      return res.status(400).json({
        error: 'Neteisingas užklausos formatas',
        details: 'Tikimasi JSON objekto su laukais priceId ir courseId',
      });
    }

    const { priceId, courseId, userId, customerEmail, customerName } = body;

    console.info('Creating Stripe checkout session', {
      courseId,
      priceId,
      hasUserId: Boolean(userId),
      hasCustomerEmail: Boolean(customerEmail),
    });

    // Validacija
    if (!priceId || !courseId) {
      return res.status(400).json({
        error: 'Trūksta privalomų laukų: priceId, courseId',
      });
    }

    // Sukurti Stripe Checkout sesiją
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: customerEmail || undefined,
      metadata: {
        courseId,
        userId: userId || 'guest',
        customerName: customerName || '',
      },
      success_url: `${req.headers.origin || 'https://obuolys.lt'}/kursai/mokejimas-sekmingas?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'https://obuolys.lt'}/kursai/kaip-pradeti-programuoti-su-di`,
      locale: 'lt',
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
      custom_text: {
        submit: {
          message: 'Mokėjimas saugiai apdorojamas per Stripe. Jūsų duomenys apsaugoti.',
        },
      },
    });

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe Checkout error:', error);

    if (!res.headersSent) {
      const statusCode = typeof error === 'object' && error && 'statusCode' in error ? error.statusCode : 500;

      return res.status(statusCode || 500).json({
        error: 'Nepavyko sukurti mokėjimo sesijos',
        details: error instanceof Error ? error.message : 'Nežinoma klaida',
        code: typeof error === 'object' && error && 'code' in error ? error.code : undefined,
      });
    }

    return res.end();
  }
};
