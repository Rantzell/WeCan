"use client";

import { useState } from "react";
import { Card, CardHeader, PageHeader, Progress } from "@/components/ui";
import { habits as seed } from "@/lib/data";
import { Flame, Check } from "lucide-react";

const days = ["M", "T", "W", "T", "F", "S", "S"];

export default function HabitsPage() {
  const [items, setItems] = useState(seed);
  const toggle = (id: number) =>
    setItems((p) => p.map((h) => (h.id === id ? { ...h, done: !h.done } : h)));

  const completion = Math.round(
    (items.reduce((a, h) => a + h.week.filter(Boolean).length, 0) /
      (items.length * 7)) *
      100
  );

  return (
    <div>
      <PageHeader title="Habit Tracker" subtitle="Daily check-ins · streaks · weekly analytics" />

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card><p className="text-xs text-muted">Weekly completion</p><p className="mt-1 text-2xl font-semibold text-fg">{completion}%</p></Card>
        <Card><p className="text-xs text-muted">Best streak</p><p className="mt-1 text-2xl font-semibold text-fg">21 days</p></Card>
        <Card><p className="text-xs text-muted">Active habits</p><p className="mt-1 text-2xl font-semibold text-fg">{items.length}</p></Card>
        <Card><p className="text-xs text-muted">Done today</p><p className="mt-1 text-2xl font-semibold text-fg">{items.filter(h=>h.done).length}/{items.length}</p></Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {items.map((h) => (
          <Card key={h.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggle(h.id)}
                  className={`grid h-9 w-9 place-items-center rounded-xl border transition-colors ${
                    h.done ? "border-accent bg-accent text-bg" : "border-border text-muted"
                  }`}
                >
                  <Check className="h-4 w-4" />
                </button>
                <div>
                  <p className="text-sm font-medium text-fg">{h.name}</p>
                  <p className="flex items-center gap-1 text-xs text-accent">
                    <Flame className="h-3.5 w-3.5" /> {h.streak}-day streak
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {h.week.map((d, i) => (
                  <span
                    key={i}
                    className={`grid h-6 w-6 place-items-center rounded-md text-[10px] ${
                      d ? "bg-accent text-bg" : "bg-surface text-muted"
                    }`}
                  >
                    {days[i]}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
