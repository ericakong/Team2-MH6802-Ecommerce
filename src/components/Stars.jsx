export default function Stars({ value = 0, size = 5, className = '' }) {
    const full = Math.floor(value)
    const half = value - full >= 0.5
    const total = size

    return (
        <div className={`inline-flex items-center ${className}`} aria-label={`${value.toFixed(1)} out of 5 stars`}>
            {Array.from({ length: total }).map((_, i) => {
                const idx = i + 1
                const isHalf = idx === full + 1 && half
                const active = idx <= full || isHalf
                return (
                    <svg
                        key={i}
                        className={`h-5 w-5 ${active ? 'text-yellow-500' : 'text-gray-300'}`}
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                    >
                        {isHalf ? (
                            <>
                                <defs>
                                    <linearGradient id={`half-${i}`}>
                                        <stop offset="50%" stopColor="currentColor" />
                                        <stop offset="50%" stopColor="transparent" />
                                    </linearGradient>
                                </defs>
                                <path fill="url(#half-${i})" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.175 0l-2.802 2.036c-.784.57-1.838-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.17-3.292z" />
                            </>
                        ) : (
                            <path fill="currentColor" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.175 0l-2.802 2.036c-.784.57-1.838-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.17-3.292z" />
                        )}
                    </svg>
                )
            })}
        </div>
    )
}