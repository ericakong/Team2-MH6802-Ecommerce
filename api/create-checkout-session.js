// api/create-checkout-session.js (CommonJS serverless function)
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { items = [], customer = {}, successUrl, cancelUrl, metadata = {} } = req.body || {};
    const origin = req.headers.origin || `${req.protocol || 'http'}://${req.headers.host}`;

    const line_items = items.map((i) => ({
      price_data: {
        currency: 'sgd',
        product_data: { name: i.name },
        unit_amount: i.price, // expect cents
      },
      quantity: i.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customer.email || undefined,
      line_items,
      success_url: (successUrl || `${origin}/checkout/success`) + `?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/checkout`,
      metadata: {
        ...metadata,
        // Optional: attach your cart or a local orderId so webhook can reconcile
        // cart: JSON.stringify(items),
      },
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error('[create-checkout-session] error:', err);
    return res.status(500).json({ error: err.message || 'Stripe error' });
  }
};
