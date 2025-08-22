// src/api/payments.js
import { API_BASE_URL, USE_MOCK_PAYMENTS } from '../config/constants';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function toCents(value) {
  const n = typeof value === 'string' ? Number(value) : value;
  return Math.round((n || 0) * 100);
}

export async function startCheckout({ cart, customer }) {
  if (!Array.isArray(cart) || cart.length === 0) {
    alert('Your cart is empty.'); return;
  }
  const origin = window.location.origin;

  const resp = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: cart.map(i => ({
        name: i.name,
        price: toCents(i.price),
        quantity: i.quantity || 1,
      })),
      customer,
      successUrl: `${origin}/checkout/success`,
      cancelUrl: `${origin}/checkout`,
      metadata: { /* optional: orderId: '...' */ },
    }),
  });

  if (!resp.ok) {
    const txt = await resp.text().catch(() => 'Checkout failed.');
    throw new Error(txt);
  }

  const { sessionId } = await resp.json();

  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe failed to initialize');

  const { error } = await stripe.redirectToCheckout({ sessionId });
  if (error) throw new Error(error.message);
}
