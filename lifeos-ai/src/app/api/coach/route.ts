import { NextResponse } from "next/server";
import { chat } from "@/lib/ai/provider";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

// Builds a compact snapshot of the user's LifeOS so the AI is context-aware.
async function buildContext(): Promise<string> {
  if (!isSupabaseConfigured()) return "";
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return "";

    const [tasks, habits, goals, tx] = await Promise.all([
      supabase.from("tasks").select("title,priority,status,due_date").eq("user_id", user.id).limit(20),
      supabase.from("habits").select("name").eq("user_id", user.id).limit(20),
      supabase.from("goals").select("title,progress,type").eq("user_id", user.id).limit(20),
      supabase.from("transactions").select("kind,amount,category").eq("user_id", user.id).limit(50),
    ]);

    return [
      "USER LIFEOS SNAPSHOT (JSON):",
      `tasks: ${JSON.stringify(tasks.data ?? [])}`,
      `habits: ${JSON.stringify(habits.data ?? [])}`,
      `goals: ${JSON.stringify(goals.data ?? [])}`,
      `transactions: ${JSON.stringify(tx.data ?? [])}`,
    ].join("\n");
  } catch {
    return "";
  }
}

const SYSTEM = `You are the AI Life Coach inside LifeOS AI, a personal operating system.
You have access to the user's tasks, habits, goals, budget, workouts and journal via the snapshot provided.
Give concise, warm, actionable, personalized advice. Prefer specific next steps over generic motivation.
When asked about affordability or scheduling, reason from the snapshot data.`;

function cannedReply(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("afford"))
    return "Looking at your budget, you have room this month — but you're already close on 'Fun'. If it's under ~$120 and not urgent, wait a week so it doesn't dent your savings goal.";
  if (p.includes("gym") || p.includes("workout"))
    return "Yes — your legs day is overdue by 2 days and recovery looks fine. Aim for 17:30 today to keep your split and streak intact.";
  if (p.includes("study") || p.includes("school"))
    return "Prioritize the calculus problem set (due today, high priority), then a 45-min Pomodoro on the CS auth project during your Friday peak.";
  if (p.includes("week") || p.includes("schedule"))
    return "Here's a balanced week: deep-work blocks in the mornings, gym Mon/Wed/Fri at 17:30, journaling at 22:00, and lighter admin on the weekend. Want me to add these to your calendar?";
  return "Based on your day: finish the high-priority calculus set, hit Push at the gym, protect your water habit with a 2pm reminder, and skip one takeout to stay on budget. Want a full plan?";
}

export async function POST(req: Request) {
  const { message, history } = await req.json();
  if (!message) return NextResponse.json({ error: "message required" }, { status: 400 });

  const context = await buildContext();
  const messages = [
    { role: "system" as const, content: SYSTEM + (context ? `\n\n${context}` : "") },
    ...((history ?? []) as { role: "user" | "assistant"; content: string }[]),
    { role: "user" as const, content: message },
  ];

  const reply = await chat(messages);

  return NextResponse.json({
    reply: reply ?? cannedReply(message),
    live: reply !== null,
  });
}
