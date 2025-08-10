import { useEffect, useRef, useState } from 'react'

const MOCK_COMMENTS = [
    '🔥 Love this product!',
    'Is there a student discount?',
    'How long is the warranty?',
    'Wow that color 👀',
    'Can you show the back pocket?',
    'Is it waterproof?'
]

export default function TikTokLiveCompact({ title = 'Live demo' }) {
    const [comments, setComments] = useState([])
    const timer = useRef()

    useEffect(() => {
        timer.current = setInterval(() => {
            setComments((c) => [...c.slice(-20), MOCK_COMMENTS[Math.floor(Math.random() * MOCK_COMMENTS.length)]])
        }, 1500)
        return () => clearInterval(timer.current)
    }, [])

    return (
        <section aria-label={title} className="card overflow-hidden">
            {/* Portrait video like TikTok (9:16). On md+ cap height for neat sidebar. */}
            <div className="relative bg-black aspect-[9/16] md:h-[440px] md:aspect-auto">
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">LIVE</div>
                <div className="absolute inset-0 flex items-center justify-center text-white/80 text-base">
                    TikTok Live Placeholder
                </div>
            </div>

            {/* Chat, collapses into the available space (no dead whitespace) */}
            <div className="flex flex-col border-t">
                <div className="px-3 pt-3">
                    <h3 className="font-semibold">Live chat</h3>
                </div>
                <div className="px-3 pb-3 text-xs text-gray-500">Embed real stream via iframe later.</div>
                <div className="flex-1 max-h-56 overflow-auto px-3 pb-3 space-y-2" aria-live="polite">
                    {comments.map((c, i) => (
                        <div key={i} className="bg-gray-100 rounded px-3 py-2 text-sm">{c}</div>
                    ))}
                </div>
            </div>
        </section>
    )
}