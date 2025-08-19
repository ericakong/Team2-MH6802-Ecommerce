// api/chat.js  (ESM because package.json has "type": "module")
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load server-only env vars from api/.env
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 3001;

// (Optional) CORS allow-list. With the Vite proxy you don't strictly need this, but it's fine.
const allowed = new Set([
  "http://localhost:5173",
  // "https://your-frontend-domain.com",
]);
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowed.has(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Headers", "Content-Type, X-Proxy-Token");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: "1mb" }));

// ---------- 1) Health check ----------
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    port: PORT,
    hasKey: Boolean(process.env.OPENAI_API_KEY),
    modelDefault: "gpt-4o-mini",
  });
});

// Optional lightweight protection
const requireToken = !!process.env.CHAT_PROXY_TOKEN;

// Helper to call OpenAI and return raw text (so we can log errors)
async function callOpenAI(model, messages, apiKey) {
  const payload = {
    model,
    temperature: 0.7,
    max_tokens: 512,
    messages: [
      {
        role: "system",
        content:
          "You are a friendly, concise e-commerce support assistant. Help with orders, shipping, returns and products.",
      },
      ...messages,
    ],
  };

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  const raw = await resp.text(); // read raw for better logging
  return { ok: resp.ok, status: resp.status, raw };
}

// ---------- 2) Chat endpoint ----------
app.post("/api/chat", async (req, res) => {
  try {
    if (requireToken) {
      const token = req.header("X-Proxy-Token") || "";
      if (token !== process.env.CHAT_PROXY_TOKEN) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    }

    const messages = req.body?.messages;
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Missing "messages" array.' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Server missing OPENAI_API_KEY" });
    }

    // Try preferred model, then fall back to gpt-3.5-turbo if needed
    const models = ["gpt-4o-mini", "gpt-3.5-turbo"];
    let last = { ok: false, status: 500, raw: "" };

    for (const model of models) {
      const result = await callOpenAI(model, messages, apiKey);
      if (!result.ok) {
        console.error(`[OpenAI ${model}] ${result.status}:`, result.raw);
        last = result;
        // If it's a 404 model_not_found or 401/429, try next; else break
        if (result.status === 404 || result.status === 401 || result.status === 429) {
          continue;
        } else {
          break;
        }
      }
      // OK → return JSON to client
      try {
        const json = JSON.parse(result.raw);
        return res.status(200).json(json);
      } catch {
        console.error(`[OpenAI ${model}] invalid JSON:`, result.raw);
        return res.status(502).json({ error: "Invalid response from OpenAI" });
      }
    }

    // If we got here, all attempts failed
    return res.status(last.status || 502).type("application/json").send(last.raw || JSON.stringify({ error: "Upstream error" }));
  } catch (err) {
    console.error(err);
    return res.status(502).json({ error: "Upstream error (exception)" });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
