import { useEffect, useRef, useState } from 'react'
import { chatWithAI } from '../lib/aiClient'

export default function ChatWidget({ productId }) {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! I\'m your shopping assistant. How can I help today?' }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const endRef = useRef(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, open])

    async function send() {
        if (!input.trim()) return
        const next = [...messages, { role: 'user', content: input }]
        setMessages(next)
        setInput('')
        setLoading(true)
        try {
            const res = await chatWithAI({ messages: next, productId })
            setMessages((m) => [...m, res])
        } catch (e) {
            setMessages((m) => [...m, { role: 'assistant', content: `❗ ${e.message}` }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <button
                className="fixed bottom-4 right-4 z-40 btn shadow-lg"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="chat-panel"
            >
                {open ? 'Close Chat' : 'Chat'}
            </button>
            {open && (
                <section
                    id="chat-panel"
                    className="fixed bottom-20 right-4 z-40 w-[90vw] sm:w-96 card flex flex-col max-h-[70vh]"
                    role="dialog"
                    aria-label="Customer support chat"
                >
                    <div className="p-3 border-b font-semibold">Support</div>
                    <div className="p-3 space-y-2 overflow-auto flex-1">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`max-w-[85%] px-3 py-2 rounded ${m.role === 'user' ? 'bg-brand text-white ml-auto' : 'bg-gray-100 text-gray-900'
                                    }`}
                            >
                                {m.content}
                            </div>
                        ))}
                        <div ref={endRef} />
                    </div>
                    <div className="p-3 border-t flex items-center gap-2">
                        <label htmlFor="chat-input" className="sr-only">Message</label>
                        <input
                            id="chat-input"
                            className="input"
                            placeholder="Ask about shipping, specs…"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && send()}
                        />
                        <button className="btn" onClick={send} disabled={loading} aria-disabled={loading}>
                            {loading ? '…' : 'Send'}
                        </button>
                    </div>
                </section>
            )}
        </>
    )
}