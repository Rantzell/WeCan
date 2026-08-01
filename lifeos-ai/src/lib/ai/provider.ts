// Provider-agnostic chat completion. Reads AI_PROVIDER from env and calls
// Gemini, Groq, or Ollama. Returns null when no provider/key is configured
// so the route can fall back to canned replies.

type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

export async function chat(messages: ChatMsg[]): Promise<string | null> {
  const provider = (process.env.AI_PROVIDER || "").toLowerCase();

  try {
    if (provider === "gemini" && process.env.GEMINI_API_KEY) {
      return await gemini(messages);
    }
    if (provider === "groq" && process.env.GROQ_API_KEY) {
      return await groq(messages);
    }
    if (provider === "ollama") {
      return await ollama(messages);
    }
  } catch (err) {
    console.error("AI provider error:", err);
    return null;
  }
  return null;
}

async function gemini(messages: ChatMsg[]): Promise<string> {
  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const key = process.env.GEMINI_API_KEY;
  const system = messages.find((m) => m.role === "system")?.content;
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
      }),
    }
  );
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "…";
}

async function groq(messages: ChatMsg[]): Promise<string> {
  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({ model, messages }),
  });
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "…";
}

async function ollama(messages: ChatMsg[]): Promise<string> {
  const base = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL || "llama3.1";
  const res = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, stream: false }),
  });
  const data = await res.json();
  return data?.message?.content ?? "…";
}
