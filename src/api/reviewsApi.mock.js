import all from '../data/reviews.json'

const sleep = (ms = 250) => new Promise(r => setTimeout(r, ms))

// --- helpers for deterministic mock generation ---
function hash(s = '') {
    let h = 0
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
    return h
}

function seededRandom(seed) {
    // Mulberry32 PRNG
    let t = seed + 0x6D2B79F5
    return () => {
        t |= 0; t = t + 0x6D2B79F5 | 0
        let r = Math.imul(t ^ t >>> 15, 1 | t)
        r ^= r + Math.imul(r ^ r >>> 7, 61 | r)
        return ((r ^ r >>> 14) >>> 0) / 4294967296
    }
}

function generateMockReviews(productId) {
    const rnd = seededRandom(hash(String(productId)))
    const authors = ['Alice', 'Ben', 'Cheng', 'Dana', 'Elena', 'Farid', 'Gwen', 'Hiro', 'Ivy', 'Jamal']
    const comments = [
        'Great quality and fast shipping!',
        'Exactly as described. Love it!',
        'Good value for money.',
        'Average, does the job.',
        'Build quality is excellent for the price.',
        'Battery life could be better but still solid.',
        'Seller was responsive, recommended.',
        'Looks premium and works as expected.'
    ]
    const photosPool = [
        'https://picsum.photos/seed/rv1/200',
        'https://picsum.photos/seed/rv2/200',
        'https://picsum.photos/seed/rv3/200'
    ]

    // 3–6 reviews
    const count = 3 + Math.floor(rnd() * 4)
    const now = Date.now()
    const items = Array.from({ length: count }).map((_, i) => {
        const rating = 3 + Math.floor(rnd() * 3) // 3–5 stars, more positive
        const author = authors[Math.floor(rnd() * authors.length)]
        const comment = comments[Math.floor(rnd() * comments.length)]
        const hasPhoto = rnd() < 0.35
        const created_at = new Date(now - (i + 1) * 86400000).toISOString() // recent days
        return {
            id: `mock-${productId}-${i}`,
            author,
            rating,
            comment,
            photos: hasPhoto ? [photosPool[Math.floor(rnd() * photosPool.length)]] : [],
            created_at
        }
    })

    return items
}
// --------------------------------------------------

export async function fetchReviews({ productId, rating = '', withPhotos = false, limit = 5, cursor = '' }) {
    await sleep(200)

    // get from JSON, or generate if missing (same as your current file)
    let rows = Array.isArray(all?.[productId]) ? all[productId].slice() : generateMockReviews(productId)

    // stable order (newest first)
    rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    // filters
    if (rating) rows = rows.filter(r => r.rating === Number(rating))
    if (withPhotos) rows = rows.filter(r => Array.isArray(r.photos) && r.photos.length > 0)

    // cursor (keyset: created_at < cursor)
    if (cursor) rows = rows.filter(r => new Date(r.created_at) < new Date(cursor))

    const L = Math.max(1, Math.min(20, Number(limit) || 5))
    const hasMore = rows.length > L
    const page = rows.slice(0, L)

    // Only expose nextCursor if there is another page
    const nextCursor = hasMore ? page[page.length - 1].created_at : null

    // Summary uses the full, unfiltered set for this product (like real stores)
    const base = Array.isArray(all?.[productId]) ? all[productId] : generateMockReviews(productId)
    const count = base.length
    const avg = count ? base.reduce((s, r) => s + r.rating, 0) / count : 0
    const buckets = [1, 2, 3, 4, 5].map(star => base.filter(r => r.rating === star).length)

    return {
        items: page,
        summary: {
            count,
            avg: Number(avg.toFixed(2)),
            s1: buckets[0], s2: buckets[1], s3: buckets[2], s4: buckets[3], s5: buckets[4]
        },
        nextCursor
    }
}

export async function createReview() {
    await sleep(150)
    return { ok: true }
}