// api/stripe-webhook.js (ES6)
import Stripe from 'stripe';

export const config = {
  api: { bodyParser: false }, // raw body required
};

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  });

  const sig = req.headers['stripe-signature'];
  if (!sig) {
    return res.status(400).json({ error: 'Missing Stripe-Signature header' });
  }

  let event;
  try {
    const body = await getRawBody(req);
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        // ⚡ Fulfill order (save DB, send email, etc.)
        console.log('[Webhook] Paid:', {
          id: session.id,
          email: session.customer_email,
          amount_total: session.amount_total,
        });
        break;
      }
      default:
        console.log('[Webhook] Unhandled event:', event.type);
    }
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('[Webhook] Handler error:', err);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
}
