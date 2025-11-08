/**
 * Vercel Serverless funkcija Stripe Checkout sesijos kūrimui
 * Endpoint: POST /api/create-checkout-session
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

module.exports = async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ...corsHeaders });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      ...corsHeaders
    });
  }

  try {
    const { priceId, courseId, userId, customerEmail, customerName } = req.body;

    // Validacija
    if (!priceId || !courseId) {
      return res.status(400).json({
        error: 'Trūksta privalomų laukų: priceId, courseId',
        ...corsHeaders,
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
      ...corsHeaders,
    });
  } catch (error) {
    console.error('Stripe Checkout error:', error);

    return res.status(500).json({
      error: 'Nepavyko sukurti mokėjimo sesijos',
      details: error.message,
      ...corsHeaders,
    });
  }
};
