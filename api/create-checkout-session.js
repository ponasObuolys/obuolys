/**
 * Vercel Serverless funkcija Stripe Checkout sesijos kūrimui
 * Endpoint: POST /api/create-checkout-session
 */

let stripe;
try {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('CRITICAL: STRIPE_SECRET_KEY is not set in environment variables');
    throw new Error('STRIPE_SECRET_KEY not configured');
  }
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} catch (error) {
  console.error('Failed to initialize Stripe:', error.message);
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

module.exports = async (req, res) => {
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

  // Patikrinti ar Stripe SDK inicializuotas
  if (!stripe) {
    console.error('Stripe SDK not initialized');
    return res.status(500).json({
      error: 'Stripe konfigūracija neįkelta',
      details: 'Stripe SDK failed to initialize - check STRIPE_SECRET_KEY',
    });
  }

  let body = req.body;

  if (typeof body === 'string') {
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

  if (!body || typeof body !== 'object') {
    return res.status(400).json({
      error: 'Neteisingas užklausos formatas',
      details: 'Tikimasi JSON objekto su laukais priceId ir courseId',
    });
  }

  try {
    const { priceId, courseId, userId, customerEmail, customerName } = body;

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
      customer_email: customerEmail,
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

    return res.status(500).json({
      error: 'Nepavyko sukurti mokėjimo sesijos',
      details: error.message,
    });
  }
};
