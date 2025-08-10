import { useEffect, useId, useState } from 'react'

export default function ProductGallery({ name, images = [] }) {
    const [active, setActive] = useState(0)
    const group = useId()

    useEffect(() => { setActive(0) }, [images])

    if (!images.length) return null
    const main = images[active]

    return (
        <section aria-label={`${name} gallery`} className="card overflow-hidden">
            {/* Main image */}
            <div className="relative bg-white">
                <img
                    src={main}
                    alt={`${name} – image ${active + 1} of ${images.length}`}
                    className="w-full aspect-square object-cover"
                />
                <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-1 rounded">
                    {active + 1}/{images.length}
                </span>
            </div>

            {/* Thumbnails */}
            <div className="p-3">
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-7">
                    {images.map((src, i) => {
                        const selected = i === active
                        return (
                            <button
                                key={src}
                                type="button"
                                onClick={() => setActive(i)}
                                onKeyDown={(e) => {
                                    if (e.key === 'ArrowRight') setActive((a) => Math.min(images.length - 1, a + 1))
                                    if (e.key === 'ArrowLeft') setActive((a) => Math.max(0, a - 1))
                                }}
                                aria-label={`Show image ${i + 1}`}
                                aria-pressed={selected}
                                className={`relative rounded overflow-hidden focus-visible:ring-2 focus-visible:ring-brand-light ${selected ? 'ring-2 ring-brand' : 'ring-1 ring-gray-200'
                                    }`}
                            >
                                <img src={src} alt={`${name} thumbnail ${i + 1}`} className="w-full aspect-square object-cover" />
                            </button>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}