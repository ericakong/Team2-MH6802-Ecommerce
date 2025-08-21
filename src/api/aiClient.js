const USE_MOCK = import.meta.env.VITE_USE_MOCK_AI === 'true'

export async function chatWithAI({ messages, productId }) {
    if (USE_MOCK) {
        // Mock response (deterministic-ish)
        const last = messages[messages.length - 1]?.content || ''
        const reply =
            `Thanks for your message! (Mock Mode)\n\n` +
            `• Product ID: ${productId ?? 'n/a'}\n` +
            `• You asked: "${last.slice(0, 140)}${last.length > 140 ? '…' : ''}"\n\n` +
            `Here are quick tips:\n- Shipping typically 3–5 days.\n- 30‑day returns.\n- Need specs? Ask me!\n`
        await new Promise((r) => setTimeout(r, 400))
        return { role: 'assistant', content: reply }
    }

    const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, productId })
    })

    if (!res.ok) {
        const text = await res.text()
        throw new Error(`Chat error (${res.status}): ${text}`)
    }
    return res.json()
}