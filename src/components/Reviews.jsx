// src/components/Reviews.jsx
import { useEffect, useMemo, useState } from 'react'
import Stars from './Stars'
import { fetchReviews } from '../lib/reviewsApi'

function formatDate(iso) {
    try {
        return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    } catch {
        return iso
    }
}

export default function Reviews({ productId }) {
    const [ratingFilter, setRatingFilter] = useState(0) // 0 = all
    const [withPhotos, setWithPhotos] = useState(false)
    const [items, setItems] = useState([])
    const [summary, setSummary] = useState({ avg: 0, count: 0, s1: 0, s2: 0, s3: 0, s4: 0, s5: 0 })
    const [cursor, setCursor] = useState(null) // nextCursor from API; null means no more
    const [loading, setLoading] = useState(false)

    async function load({ reset = false } = {}) {
        if (loading) return
        setLoading(true)

        const params = {
            productId,
            limit: 3,
            rating: ratingFilter || '',
            withPhotos
        }
        // only include cursor when not resetting and we have one
        if (!reset && cursor) params.cursor = cursor

        const data = await fetchReviews(params)

        if (reset) setItems(data.items)
        else setItems(prev => [...prev, ...data.items])

        setSummary(data.summary || summary)
        setCursor(data.nextCursor) // null on last page
        setLoading(false)
    }

    // initial & whenever filters/product change → reset to first page
    useEffect(() => {
        setItems([])
        setCursor(null)
        load({ reset: true })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId, ratingFilter, withPhotos])

    const stats = useMemo(() => {
        const s = summary
        const buckets = [s.s1 || 0, s.s2 || 0, s.s3 || 0, s.s4 || 0, s.s5 || 0]
        return { avg: s.avg || 0, count: s.count || 0, buckets }
    }, [summary])

    const canLoadMore = Boolean(cursor)

    return (
        <section aria-labelledby="reviews-heading" className="mt-12">
            {/* Unified header: summary (left) + filters (right) */}
            <div className="card p-4 w-full flex flex-wrap gap-6 items-start">
                {/* Left: Summary */}
                <div className="flex items-start gap-6 min-w-0">
                    {/* Avg block */}
                    <div className="min-w-[140px]">
                        <h2 id="reviews-heading" className="font-semibold">Customer reviews</h2>
                        <div className="mt-2 flex items-center gap-2">
                            <Stars value={stats.avg} />
                            <span className="text-sm text-gray-600">{stats.avg.toFixed(1)} / 5</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                            {stats.count} review{stats.count === 1 ? '' : 's'}
                        </div>
                    </div>

                    {/* Distribution bars */}
                    <div className="grid grid-cols-1 gap-1.5">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const idx = star - 1
                            const count = stats.buckets[idx] || 0
                            const pct = stats.count ? Math.round((count / stats.count) * 100) : 0
                            return (
                                <div key={star} className="flex items-center gap-2">
                                    <span className="w-6 text-sm text-gray-700">{star}★</span>
                                    <div className="w-40 sm:w-56 h-2 bg-gray-200 rounded">
                                        <div className="h-2 bg-yellow-400 rounded" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="w-6 text-right text-sm text-gray-600">{count}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Right: Filters */}
                <div className="w-full lg:w-auto">
                    <div className="font-semibold mb-2">Filter reviews</div>
                    <div className="flex flex-wrap items-center gap-2">
                        {/* All */}
                        <button
                            className={`px-3 py-1.5 rounded border ${ratingFilter === 0 ? 'bg-brand text-white border-brand' : 'bg-white hover:bg-gray-50 border-gray-300'
                                }`}
                            onClick={() => setRatingFilter(0)}
                        >
                            All
                        </button>

                        {[5, 4, 3, 2, 1].map((s) => (
                            <button
                                key={s}
                                className={`px-3 py-1.5 rounded border ${ratingFilter === s ? 'bg-brand text-white border-brand' : 'bg-white hover:bg-gray-50 border-gray-300'
                                    }`}
                                onClick={() => setRatingFilter(s)}
                            >
                                {s}★
                            </button>
                        ))}

                        <label className="ml-1 inline-flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                className="h-4 w-4"
                                checked={withPhotos}
                                onChange={(e) => setWithPhotos(e.target.checked)}
                            />
                            With photos
                        </label>
                    </div>
                </div>
            </div>

            {/* Review list */}
            <div className="mt-6 space-y-4">
                {items.length === 0 && !loading && (
                    <div className="text-gray-600 text-sm">No reviews match these filters.</div>
                )}
                {items.map((r) => (
                    <article key={r.id} className="card p-4">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                                    {r.author?.slice(0, 1).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-medium">{r.author}</div>
                                    <div className="text-xs text-gray-500">{formatDate(r.created_at)}</div>
                                </div>
                            </div>
                            <Stars value={r.rating} />
                        </div>
                        <p className="mt-3 text-gray-800">{r.comment}</p>
                        {Array.isArray(r.photos) && r.photos.length > 0 && (
                            <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2">
                                {r.photos.map((src, i) => (
                                    <img key={i} src={src} alt={`Review photo ${i + 1}`} className="w-full aspect-square object-cover rounded" />
                                ))}
                            </div>
                        )}
                    </article>
                ))}
            </div>

            {/* Load more (centered; disabled when loading or no next page) */}
            <div className="mt-6 flex justify-center">
                <button
                    className="btn min-w-[160px]"
                    onClick={() => load({ reset: false })}
                    disabled={loading || !canLoadMore}
                    aria-disabled={loading || !canLoadMore}
                >
                    {loading ? 'Loading…' : canLoadMore ? 'Load more' : 'No more reviews'}
                </button>
            </div>
        </section>
    )
}