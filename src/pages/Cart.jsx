import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Cart() {
    const [cart, setCart] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const c = JSON.parse(localStorage.getItem('cart') || '[]')
        setCart(c)
    }, [])

    function updateQty(i, qty) {
        const next = [...cart]
        next[i].qty = Math.max(1, qty)
        setCart(next)
        localStorage.setItem('cart', JSON.stringify(next))
        window.dispatchEvent(new Event('cart-updated'))
    }

    function removeItem(i) {
        const next = cart.filter((_, idx) => idx !== i)
        setCart(next)
        localStorage.setItem('cart', JSON.stringify(next))
        window.dispatchEvent(new Event('cart-updated'))
    }

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-6">Cart</h1>
            {cart.length === 0 ? (
                <div className="card p-6">
                    <p>Your cart is empty.</p>
                    <Link to="/" className="btn mt-4 inline-block w-fit">Continue shopping</Link>
                </div>
            ) : (
                <div className="grid lg:grid-cols-[2fr,1fr] gap-6">
                    <div className="card">
                        <ul className="divide-y">
                            {cart.map((item, i) => (
                                <li key={item.id} className="p-4 flex items-center gap-4">
                                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">{item.name}</div>
                                        <div className="text-sm text-gray-600">${item.price.toFixed(2)}</div>
                                    </div>
                                    <label htmlFor={`qty-${i}`} className="sr-only">Quantity for {item.name}</label>
                                    <input
                                        id={`qty-${i}`}
                                        type="number"
                                        min="1"
                                        className="input w-24"
                                        value={item.qty}
                                        onChange={(e) => updateQty(i, Number(e.target.value))}
                                    />
                                    <button className="btn btn-outline" onClick={() => removeItem(i)} aria-label={`Remove ${item.name}`}>
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="card p-4 h-fit">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-semibold">${subtotal.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Taxes and shipping calculated at checkout.</p>
                        <button className="btn w-full mt-4" onClick={() => navigate('/checkout')}>Checkout</button>
                        <Link to="/" className="btn btn-outline w-full mt-2">Continue shopping</Link>
                    </div>
                </div>
            )}
        </div>
    )
}