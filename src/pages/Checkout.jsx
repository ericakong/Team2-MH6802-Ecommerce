import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

function readCart() {
    try { return JSON.parse(localStorage.getItem('cart') || '[]') } catch { return [] }
}

export default function Checkout() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', payment: '' })
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [cart, setCart] = useState(() => readCart())

    // keep cart in sync if other tabs/pages update it
    useEffect(() => {
        const handler = () => setCart(readCart())
        window.addEventListener('storage', handler)
        window.addEventListener('cart-updated', handler)
        return () => {
            window.removeEventListener('storage', handler)
            window.removeEventListener('cart-updated', handler)
        }
    }, [])

    const total = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart])

    async function onSubmit(e) {
        e.preventDefault()
        if (!form.name || !form.email || !form.address || !form.payment) {
            alert('Please fill all required fields.')
            return
        }
        setLoading(true)
        try {
            // simulate payment
            await new Promise((r) => setTimeout(r, 600))
            localStorage.setItem('cart', '[]')            // clear cart
            window.dispatchEvent(new Event('cart-updated'))
            setSuccess(true)                               // show success panel (no navigation)
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10 text-center">
                <div className="card p-8">
                    <h1 className="text-3xl font-semibold">🎉 Order placed!</h1>
                    <p className="mt-2 text-gray-600">You’ll receive a confirmation email shortly.</p>
                    {/* Use Link instead of <a href="/"> */}
                    <Link to="/" className="btn mt-6 inline-block">Back to Home</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            <div className="grid lg:grid-cols-[2fr,1fr] gap-6">
                <form className="card p-4 space-y-3" onSubmit={onSubmit} noValidate>
                    <div>
                        <label className="block text-sm mb-1" htmlFor="name">Full name *</label>
                        <input id="name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-sm mb-1" htmlFor="email">Email *</label>
                        <input id="email" type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-sm mb-1" htmlFor="phone">Phone</label>
                        <input id="phone" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm mb-1" htmlFor="address">Address *</label>
                        <textarea id="address" className="input h-24" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
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
                        {loading ? 'Processing…' : `Pay $${total.toFixed(2)}`}
                    </button>
                </form>

                <aside className="card p-4 h-fit">
                    <h2 className="font-semibold mb-2">Order summary</h2>
                    <ul className="divide-y">
                        {cart.map((i) => (
                            <li key={i.id} className="py-2 flex items-center justify-between text-sm">
                                <span>{i.name} × {i.qty}</span>
                                <span>${(i.price * i.qty).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-3 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </aside>
            </div>
        </div>
    )
}