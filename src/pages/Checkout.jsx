import { useState } from 'react'

export default function Checkout() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', payment: '' })
    const [success, setSuccess] = useState(false)

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0)

    function onSubmit(e) {
        e.preventDefault()
        if (!form.name || !form.email || !form.address || !form.payment) {
            return alert('Please fill all required fields.')
        }
        setTimeout(() => {
            localStorage.removeItem('cart')
            window.dispatchEvent(new Event('cart-updated'))
            setSuccess(true)
        }, 600)
    }

    if (success) {
        return (
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10 text-center">
                <div className="text-3xl font-semibold">🎉 Order placed!</div>
                <p className="mt-2 text-gray-600">You’ll receive a confirmation email shortly.</p>
                <a href="/" className="btn mt-6 inline-block">Back to Home</a>
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
                        <select id="payment" className="input" value={form.payment} onChange={(e) => setForm({ ...form, payment: e.target.value })} required>
                            <option value="">Select…</option>
                            <option>Visa</option>
                            <option>Mastercard</option>
                            <option>PayNow</option>
                        </select>
                    </div>
                    <button className="btn w-full mt-2" type="submit">Pay ${total.toFixed(2)}</button>
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