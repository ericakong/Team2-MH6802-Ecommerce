import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProductById } from '../lib/api'
import { getRecommendations } from '../lib/recommendations'
import ChatWidget from '../components/ChatWidget'
import ProductGallery from '../components/ProductGallery'
import TikTokLiveCompact from '../components/TikTokLiveCompact'
import Reviews from '../components/Reviews'

export default function ProductDetail() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [qty, setQty] = useState(1)
    const [recs, setRecs] = useState([])

    useEffect(() => {
        let mounted = true
        fetchProductById(id).then((p) => {
            if (!mounted) return
            setProduct(p)
            setRecs(getRecommendations(id, 4))
        })
        return () => { mounted = false }
    }, [id])

    if (!product) return <div className="mx-auto max-w-7xl p-6">Loading…</div>

    function addToCart() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        const i = cart.findIndex((c) => c.id === product.id)
        if (i >= 0) cart[i].qty += qty
        else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty })
        localStorage.setItem('cart', JSON.stringify(cart))
        window.dispatchEvent(new Event('cart-updated'))
        alert('Added to cart!')
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Two columns on desktop, stacked on mobile */}
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Gallery */}
                <div>
                    <ProductGallery name={product.name} images={product.images} />
                </div>

                {/* Details */}
                <div>
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <div className="text-sm text-gray-600 mt-1">{product.category}</div>
                    <div className="mt-4 text-3xl font-semibold">${product.price.toFixed(2)}</div>
                    <p className="mt-4 text-gray-700">{product.description}</p>

                    <div className="mt-6 card p-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <label htmlFor="qty" className="sr-only">Quantity</label>
                            <input
                                id="qty"
                                type="number"
                                min="1"
                                value={qty}
                                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                                className="input w-24"
                            />
                            <button className="btn" onClick={addToCart}>Add to Cart</button>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>✅ Ships in 3–5 business days</li>
                            <li>✅ 30‑day returns</li>
                            <li>✅ 1‑year warranty</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Divider before reviews */}
            <div className="mt-10 border-t" />

            {/* Reviews: full width, clearly separated like big marketplaces */}
            <Reviews productId={product.id} />

            {/* Live + recommendations below */}
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
                <TikTokLiveCompact />
                <section className="card p-3">
                    <h3 className="font-semibold mb-2">You may also like</h3>
                    <div className="space-y-2">
                        {recs.map((r) => (
                            <Link
                                key={r.id}
                                to={`/product/${r.id}`}
                                className="flex items-center gap-3 rounded-md border p-2 hover:bg-gray-50"
                            >
                                <img src={r.image} alt={r.name} className="w-14 h-14 object-cover rounded" />
                                <div className="min-w-0">
                                    <div className="font-medium truncate">{r.name}</div>
                                    <div className="text-sm text-gray-600">${r.price.toFixed(2)}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>

            <ChatWidget productId={product.id} />
        </div>
    )
}