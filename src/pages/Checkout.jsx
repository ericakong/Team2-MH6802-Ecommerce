// src/pages/Checkout.jsx
import { useContext, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function Checkout() {
    const navigate = useNavigate();
    const { cart, total, clearCart, isCartDisabled } = useContext(CartContext);

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        payment: '',
    });
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Derived totals (you can just use `total` from context; shown here to be explicit)
    const computedTotal = useMemo(
        () => cart.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0),
        [cart]
    );
    const grandTotal = Number.isFinite(total) ? total : computedTotal;

    // Guard: admin users don’t checkout (route should already be protected by NonAdminRoute)
    if (isCartDisabled) {
        return (
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10 text-center">
                <div className="card p-8">
                    <h1 className="text-2xl font-semibold mb-2">Checkout</h1>
                    <p className="text-gray-600">Admin users don’t use checkout.</p>
                    <Link to="/" className="btn mt-6 inline-block">Back to Home</Link>
                </div>
            </div>
        );
    }

    // Guard: empty cart
    if (!cart.length && !success) {
        return (
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10 text-center">
                <div className="card p-8">
                    <h1 className="text-2xl font-semibold">Your cart is empty</h1>
                    <p className="mt-2 text-gray-600">Add some items before checking out.</p>
                    <Link to="/" className="btn mt-6 inline-block">Browse products</Link>
                </div>
            </div>
        );
    }

    async function onSubmit(e) {
        e.preventDefault();
        if (!form.name || !form.email || !form.address || !form.payment) {
            alert('Please fill all required fields.');
            return;
        }
        setLoading(true);
        try {
            // simulate payment
            await new Promise((r) => setTimeout(r, 600));
            clearCart();            // ✅ clear via provider (keeps state in sync everywhere)
            setSuccess(true);
            // you could navigate('/orders/thank-you') if you prefer a separate route
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10 text-center">
                <div className="card p-8">
                    <h1 className="text-3xl font-semibold">🎉 Order placed!</h1>
                    <p className="mt-2 text-gray-600">You’ll receive a confirmation email shortly.</p>
                    <Link to="/" className="btn mt-6 inline-block">Back to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            <div className="grid lg:grid-cols-[2fr,1fr] gap-6">
                <form className="card p-4 space-y-3" onSubmit={onSubmit} noValidate>
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

                    <button className="btn w-full mt-2" type="submit" disabled={loading}>
                        {loading ? 'Processing…' : `Pay $${grandTotal.toFixed(2)}`}
                    </button>
                </form>

                <aside className="card p-4 h-fit">
                    <h2 className="font-semibold mb-2">Order summary</h2>
                    <ul className="divide-y">
                        {cart.map((i) => (
                            <li key={i.id} className="py-2 flex items-center justify-between text-sm">
                                <span>
                                    {i.name} × {i.quantity}
                                </span>
                                <span>${(i.price * i.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-3 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${grandTotal.toFixed(2)}</span>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                        Prices are indicative; final charges are confirmed server-side at payment.
                    </div>
                </aside>
            </div>
        </div>
    );
}