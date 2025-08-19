import React, { useEffect, useRef, useState } from "react";

const USE_MOCK =
  String(import.meta.env.VITE_USE_MOCK_AI ?? import.meta.env.VITE_USE_MOCK) === "true";
const API_URL = import.meta.env.VITE_CHAT_API_URL || "/api/chat";
const PROXY_TOKEN = import.meta.env.VITE_CHAT_PROXY_TOKEN || "";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! How can I help with your order today? 😊" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const next = [...messages, { role: "user", content: input.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      if (USE_MOCK) {
        const reply = getMockReply(input.trim());
        await delay(700);
        setMessages([...next, { role: "assistant", content: reply }]);
      } else {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(PROXY_TOKEN ? { "X-Proxy-Token": PROXY_TOKEN } : {}),
          },
          body: JSON.stringify({ messages: next }),
        });

        if (!res.ok) {
          let msg = `HTTP ${res.status}`;
          try {
            const j = await res.json();
            if (j?.error) msg = j.error;
          } catch {}
          throw new Error(msg);
        }

        const data = await res.json();
        const reply =
          data?.choices?.[0]?.message?.content?.trim() ||
          "Sorry—no reply returned.";
        setMessages([...next, { role: "assistant", content: reply }]);
      }
    } catch (e) {
      console.error(e);
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            "Oops, I couldn’t reach the assistant just now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg text-2xl"
          aria-label="Open chat"
          title={USE_MOCK ? "Mock chatbot (no cost)" : "ChatGPT connected"}
        >
          💬
        </button>
      ) : (
        <div className="w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col border border-gray-300">
          <div className="flex justify-between items-center p-3 border-b bg-blue-600 text-white">
            <h2 className="font-bold text-lg">
              {USE_MOCK ? "Chat Support (Demo)" : "Chat Support (AI)"}
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="text-white text-lg font-bold"
              aria-label="Close chat"
            >
              ✖
            </button>
          </div>

          <div ref={boxRef} className="flex-1 overflow-y-auto p-3 space-y-2 text-sm bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-md max-w-[80%] ${
                  m.role === "user"
                    ? "bg-blue-100 self-end ml-auto text-right"
                    : "bg-gray-200 self-start mr-auto text-left"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && <div className="text-gray-400 italic">Typing…</div>}
          </div>

          <div className="p-3 border-t bg-white flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="w-full border px-2 py-1 rounded shadow-sm focus:outline-none focus:ring"
              placeholder="Type your message…"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- helpers ---------- */
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
function getMockReply(text) {
  const t = text.toLowerCase();
  if (t.includes("order")) return "You can view and track orders in Order History. Need help finding a specific one?";
  if (t.includes("shipping")) return "Standard shipping takes 3–5 business days. Express options are available at checkout.";
  if (t.includes("refund") || t.includes("return")) return "No worries! You can start a return in your account. I can guide you if you’d like.";
  if (t.includes("hello") || t.includes("hi")) return "Hey! 👋 What can I help you with today?";
  return "I’m here to help with orders, shipping, returns, and products. Ask me anything!";
}
