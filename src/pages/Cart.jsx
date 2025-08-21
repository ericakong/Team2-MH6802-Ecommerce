// src/pages/CartPage.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function CartPage() {
    const {
        cart,
        updateQuantity,
        removeFromCart,
        total,
        isCartDisabled,
    } = useContext(CartContext);

    // --- Admin state (no cart) ---
    if (isCartDisabled) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow rounded-xl p-8 text-center">
                    <h1 className="text-2xl font-bold">Cart</h1>
                    <p className="mt-2 text-gray-600">
                        Admin users don’t use the cart. Switch to a customer account to make purchases.
                    </p>
                    <Link to="/" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        ← Back to products
                    </Link>
                </div>
            </div>
        );
    }

    // --- Empty state ---
    if (!cart.length) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white shadow rounded-xl p-10 text-center">
                    <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-2xl">🛒</span>
                    </div>
                    <h1 className="text-2xl font-semibold">Your cart is empty</h1>
                    <p className="mt-2 text-gray-600">Add some items to get started.</p>
                    <Link to="/" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Browse products
                    </Link>
                </div>
            </div>
        );
    }

    // --- Filled cart ---
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                {/* Left: items */}
                <section className="bg-white shadow rounded-xl divide-y">
                    {cart.map((item) => (
                        <article key={item.id} className="p-4 flex items-center gap-4">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-md border"
                            />

                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                                        <p className="mt-0.5 text-sm text-gray-600">${item.price.toFixed(2)}</p>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="ml-3 px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                                    >
                                        Remove
                                    </button>
                                </div>

                                {/* Qty controls */}
                                <div className="mt-3 flex items-center gap-2">
                                    <button
                                        className="h-8 w-8 rounded border hover:bg-gray-50"
                                        onClick={() => updateQuantity(item.id, (item.quantity ?? 1) - 1)}
                                        aria-label={`Decrease quantity of ${item.name}`}
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        inputMode="numeric"
                                        value={item.quantity ?? 1}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            // provider clamps; we coerce here for UX
                                            const n = v === '' ? 1 : Number(v);
                                            updateQuantity(item.id, n);
                                        }}
                                        onBlur={(e) => {
                                            if (!e.target.value) updateQuantity(item.id, 1);
                                        }}
                                        className="w-16 border rounded px-2 py-1 text-center"
                                        aria-label={`Quantity for ${item.name}`}
                                    />
                                    <button
                                        className="h-8 w-8 rounded border hover:bg-gray-50"
                                        onClick={() => updateQuantity(item.id, (item.quantity ?? 1) + 1)}
                                        aria-label={`Increase quantity of ${item.name}`}
                                    >
                                        +
                                    </button>

                                    <div className="ml-auto font-medium">
                                        ${(item.price * (item.quantity ?? 1)).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>

                {/* Right: summary */}
                <aside className="space-y-4">
                    <div className="bg-white shadow rounded-xl p-4">
                        <h2 className="font-semibold mb-3">Order summary</h2>

                        {/* (Optional) promo – non-functional placeholder */}
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                placeholder="Promo code"
                                className="flex-1 border rounded px-3 py-2"
                                aria-label="Promo code"
                            />
                            <button className="border rounded px-3 py-2 hover:bg-gray-50">Apply</button>
                        </div>

                        <dl className="text-sm space-y-2">
                            <div className="flex justify-between">
                                <dt>Subtotal</dt>
                                <dd>${total.toFixed(2)}</dd>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <dt>Shipping</dt>
                                <dd>Calculated at next step</dd>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <dt>Taxes</dt>
                                <dd>Calculated at next step</dd>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-semibold">
                                <dt>Total</dt>
                                <dd>${total.toFixed(2)}</dd>
                            </div>
                        </dl>

                        <Link
                            to="/checkout"
                            className="mt-4 block w-full text-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Checkout
                        </Link>

                        <Link
                            to="/"
                            className="mt-2 block w-full text-center border px-4 py-2 rounded hover:bg-gray-50"
                        >
                            Continue shopping
                        </Link>

                        <p className="mt-3 text-xs text-gray-500">
                            Prices are indicative; final totals are validated on the server at payment.
                        </p>
                    </div>

                    {/* Small help card (optional) */}
                    <div className="bg-white shadow rounded-xl p-4">
                        <h3 className="font-semibold mb-1">Need help?</h3>
                        <p className="text-sm text-gray-600">
                            Questions about your order? Chat with us via the widget or email support.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}