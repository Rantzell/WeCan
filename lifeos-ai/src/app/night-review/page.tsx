"use client";
import { Card, CardHeader, PageHeader, Pill } from "@/components/ui";
import { tasks, habits } from "@/lib/data";
import { Moon, CheckCircle2, XCircle, Dumbbell, Wallet, BookOpen, Sunrise } from "lucide-react";

export default function Page() {
  const done = tasks.filter((t) => t.done);
  const missed = tasks.filter((t) => !t.done);
  const habitsDone = habits.filter((h) => h.done);

  return (
    <div>
      <PageHeader
        title="Night Review"
        subtitle="Your evening summary · auto-generated at 10:00 PM"
        action={<Pill tone="accent">Tonight</Pill>}
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Tasks completed" icon={CheckCircle2} />
          <ul className="space-y-1.5 text-sm">
            {done.map((t) => (<li key={t.id} className="text-fg">✓ {t.title}</li>))}
            {done.length === 0 && <li className="text-muted">Nothing yet.</li>}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Tasks missed" icon={XCircle} />
          <ul className="space-y-1.5 text-sm">
            {missed.map((t) => (<li key={t.id} className="text-muted">• {t.title}</li>))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Workout & habits" icon={Dumbbell} />
          <p className="text-sm text-fg">Push day completed · 5-day streak 🔥</p>
          <p className="mt-2 text-sm text-fg">{habitsDone.length}/{habits.length} habits checked in today.</p>
        </Card>
        <Card>
          <CardHeader title="Budget update" icon={Wallet} />
          <p className="text-sm text-fg">Spent $32 today · $820 left this month.</p>
          <p className="mt-2 text-sm text-muted">On track for your $5,000 savings goal.</p>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Journal summary & tomorrow" icon={BookOpen} />
          <p className="text-sm text-fg">
            Today felt productive — you shipped the auth flow and hit the gym. Mood: focused.
          </p>
          <div className="mt-3 rounded-xl bg-surface/60 p-3">
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-fg">
              <Sunrise className="h-4 w-4 text-accent" /> Priorities for tomorrow
            </p>
            <ul className="space-y-1 text-sm text-muted">
              <li>1. Finish calculus problem set (high priority)</li>
              <li>2. Legs day — overdue by 2 days</li>
              <li>3. Read 20 pages to protect the streak</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
