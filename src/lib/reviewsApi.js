const USE_MOCK = import.meta.env.VITE_USE_MOCK_REVIEWS === 'true'

export async function fetchReviews(params) {
    if (USE_MOCK) {
        const mod = await import('./reviewsApi.mock')
        return mod.fetchReviews(params)
    }
    // Real serverless endpoint (when DB is ready)
    const qs = new URLSearchParams(params).toString()
    const res = await fetch(`/api/reviews?${qs}`)
    if (!res.ok) throw new Error('Failed to fetch reviews')
    return res.json()
}

export async function createReview(payload) {
    if (USE_MOCK) {
        const mod = await import('./reviewsApi.mock')
        return mod.createReview(payload)
    }
    const res = await fetch('/api/reviews-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error('Failed to create review')
    return res.json()
}