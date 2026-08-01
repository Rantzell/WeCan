"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { Sparkles, Send } from "lucide-react";

const suggestions = [
  "What should I do today?",
  "Build my schedule",
  "Plan my week",
  "Should I go to the gym today?",
  "Can I afford a $120 purchase?",
  "What habits need improvement?",
];

type Msg = { role: "user" | "ai"; text: string };

export default function CoachPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "ai",
      text: "Hi Rantzel 👋 I'm your Life Coach. I can see your schedule, habits, goals, budget, workouts and journal. Ask me anything about your day.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const history = messages.map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text,
      }));
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "ai", text: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "ai", text: "Sorry — I couldn't reach the coach service." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100dvh-9rem)] max-w-3xl flex-col">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-bg shadow-glow">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-brush text-3xl lowercase text-fg">ai life coach</h1>
          <p className="text-sm text-muted">Context-aware across your entire LifeOS</p>
        </div>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden p-0">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  m.role === "user"
                    ? "bg-accent text-bg"
                    : "bg-surface/70 text-fg"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-surface/70 px-4 py-3 text-sm text-muted">
                thinking…
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border p-3">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full bg-surface px-3 py-1 text-xs text-muted transition-colors hover:text-fg"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 rounded-xl border border-border bg-card/50 px-3 py-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your Life Coach…"
              className="flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-muted"
            />
            <button
              type="submit"
              className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-bg"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-2 px-1 text-[11px] text-muted">
            Demo responses — connect Gemini / Groq / Ollama in <code>/api/coach</code> to go live.
          </p>
        </div>
      </Card>
    </div>
  );
}
