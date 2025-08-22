// src/pages/Checkout.jsx
import { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { startCheckout } from '../api/payments';
import { USE_MOCK_PAYMENTS } from '../config/constants';
import ComplianceBox from '../components/ComplianceBox';

export default function Checkout() {
  const { cart, total, isCartDisabled } = useContext(CartContext);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    payment: '',
  });
  const [loading, setLoading] = useState(false);

  const computedTotal = useMemo(
    () => cart.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0),
    [cart]
  );
  const grandTotal = Number.isFinite(total) ? total : computedTotal;

  // Admin guard
  if (isCartDisabled) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <div className="card p-8">
          <h1 className="text-2xl font-semibold mb-2">Checkout</h1>
          <p className="text-gray-600">Admin users don’t use checkout.</p>
          <Link to="/" className="btn mt-6 inline-block">Back to Home</Link>
        </div>
      </div>
    );
  }

  // Empty cart guard
  if (!cart.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <div className="card p-8">
          <h1 className="text-2xl font-semibold">Your cart is empty</h1>
          <p className="mt-2 text-gray-600">Add some items before checking out.</p>
          <Link to="/" className="btn mt-6 inline-block">Browse products</Link>
        </div>
      </div>
    );
  }

  // Stripe checkout handler
  const onPay = async () => {
    if (!form.name || !form.email || !form.address) {
      alert('Please fill all required fields (name, email, address).');
      return;
    }

    setLoading(true);
    try {
      await startCheckout({
        cart,
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
        },
      });
    } catch (e) {
      console.error(e);
      alert('Could not start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-[2fr,1fr] gap-6">
        <form className="card p-4 space-y-3" onSubmit={(e) => e.preventDefault()} noValidate>
          <div>
            <label className="block text-sm mb-1" htmlFor="name">Full name *</label>
            <input
              id="name"
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="phone">Phone</label>
            <input
              id="phone"
              className="input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              autoComplete="tel"
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="address">Address *</label>
            <textarea
              id="address"
              className="input h-24"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
              autoComplete="street-address"
            />
          </div>

          {/* Optional select field for tracking */}
          <div>
            <label className="block text-sm mb-1" htmlFor="payment">Payment method *</label>
            <select
              id="payment"
              className="input"
              value={form.payment}
              onChange={(e) => setForm({ ...form, payment: e.target.value })}
              required
            >
              <option value="">Select…</option>
              <option value="visa">Visa</option>
              <option value="mastercard">Mastercard</option>
              <option value="paynow">PayNow</option>
            </select>
          </div>

          <button
            type="button"
            className="btn w-full mt-2"
            onClick={onPay}
            disabled={loading}
            title={USE_MOCK_PAYMENTS ? 'Mock flow' : 'Redirect to Stripe'}
          >
            {loading
              ? 'Processing…'
              : `${USE_MOCK_PAYMENTS ? 'Mock Pay' : 'Pay with card (Stripe)'} $${grandTotal.toFixed(2)}`}
          </button>
        </form>

        <aside className="card p-4 h-fit">
          <h2 className="font-semibold mb-2">Order summary</h2>
          <ul className="divide-y">
            {cart.map((i) => (
              <li key={i.id} className="py-2 flex items-center justify-between text-sm">
                <span>{i.name} × {i.quantity}</span>
                <span>${(i.price * i.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            {USE_MOCK_PAYMENTS
              ? 'Mock payments are enabled. No real charges will occur.'
              : 'You will be redirected to a secure Stripe Checkout page.'}
          </div>
        </aside>
      </div>
      {/* ✅ Compliance disclosure box at the bottom */}
        <div className="mt-8">
          <ComplianceBox maxHeight="max-h-64" />
        </div>
      {/* Debug Widget (you can remove in prod) */}
      <div className="fixed bottom-2 left-2 bg-white border px-2 py-1 text-xs z-50 shadow-md rounded">
        Debug → cart: {cart?.length ?? 'N/A'} | disabled: {isCartDisabled ? 'YES' : 'NO'}
      </div>
    </div>
  );
}
