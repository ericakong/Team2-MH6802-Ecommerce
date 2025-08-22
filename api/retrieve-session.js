// api/retrieve-session.js (ES6)
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id } = req.query || {};
  if (!id) {
    return res.status(400).json({ error: 'Missing session id' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(id, {
      expand: ['line_items'],
    });

    return res.status(200).json({
      id: session.id,
      status: session.status,
      payment_status: session.payment_status,
      customer_email: session.customer_email,
      amount_total: session.amount_total,
      currency: session.currency,
      line_items: session.line_items?.data?.map((li) => ({
        description: li.description,
        quantity: li.quantity,
        amount_subtotal: li.amount_subtotal,
      })),
      metadata: session.metadata || {},
    });
  } catch (err) {
    console.error('[retrieve-session] error:', err);
    return res.status(400).json({ error: err.message });
  }
}
