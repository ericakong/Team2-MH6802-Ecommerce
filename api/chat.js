// Vercel Serverless Function: /api/chat
// IMPORTANT: Do not expose OPENAI_API_KEY to the client.
// Reads messages + optional productId and adds product context.

import products from '../src/data/products.json' assert { type: 'json' }

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        const { messages = [], productId } = req.body || {}
        const key = process.env.OPENAI_API_KEY
        if (!key) return res.status(500).json({ error: 'Missing OPENAI_API_KEY on server' })

        const product = products.find((p) => p.id === productId)
        const systemPrompt = `
You are a helpful store assistant.
Be concise and friendly. If the user asks about a product, use details provided:

${product ? `Focus on this product:
Name: ${product.name}
Category: ${product.category}
Price: $${product.price}
Description: ${product.description}` : 'No specific product provided.'}

Company policies:
- Shipping: 3–5 business days (mock)
- Returns: 30 days (mock)
- Warranty: 1 year (mock)
Do not make guarantees about real stock.
    `.trim()

        const body = {
            model: 'gpt-4o-mini',
            messages: [{ role: 'system', content: systemPrompt }, ...messages].slice(-20),
            temperature: 0.4
        }

        const r = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${key}`
            },
            body: JSON.stringify(body)
        })

        if (!r.ok) {
            const t = await r.text()
            return res.status(500).json({ error: `OpenAI error: ${t}` })
        }

        const data = await r.json()
        const content = data.choices?.[0]?.message?.content ?? 'Sorry, I could not generate a response.'
        return res.status(200).json({ role: 'assistant', content })
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Unknown server error' })
    }
}