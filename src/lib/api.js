// Mock API with simulated latency
import products from '../data/products.json'

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

export async function fetchProducts({ q = '', category = 'All', page = 1, pageSize = 6 } = {}) {
    await delay(400 + Math.random() * 600)
    const term = q.trim().toLowerCase()
    let list = products

    if (category && category !== 'All') {
        list = list.filter((p) => p.category === category)
    }
    if (term) {
        list = list.filter((p) => p.name.toLowerCase().includes(term))
    }

    const total = list.length
    const start = (page - 1) * pageSize
    const items = list.slice(start, start + pageSize)
    return { items, total, page, pageSize }
}

export async function fetchProductById(id) {
    await delay(250 + Math.random() * 400)
    return products.find((p) => p.id === id) ?? null
}

export async function fetchCategories() {
    await delay(150)
    const cats = Array.from(new Set(products.map((p) => p.category))).sort()
    return ['All', ...cats]
}