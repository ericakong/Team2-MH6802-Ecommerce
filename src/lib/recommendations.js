// Simple rule-based recommendations by same category, nearest price
import products from '../data/products.json'

export function getRecommendations(productId, limit = 4) {
    const p = products.find((x) => x.id === productId)
    if (!p) return products.slice(0, limit)

    const sameCat = products
        .filter((x) => x.id !== productId && x.category === p.category)
        .sort((a, b) => Math.abs(a.price - p.price) - Math.abs(b.price - p.price))

    const rest = products.filter((x) => x.id !== productId && x.category !== p.category)

    const out = [...sameCat, ...rest].slice(0, limit)
    return out
}