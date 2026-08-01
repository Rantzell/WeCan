"use client";

import { Card, CardHeader, Pill, Progress, Stat } from "@/components/ui";
import { TrendArea, Donut } from "@/components/charts";
import { QuickActions } from "@/components/quick-actions";
import {
  aiRecommendations,
  budget,
  events,
  goals,
  habits,
  productivityScore,
  productivityTrend,
  tasks,
  workout,
} from "@/lib/data";
import {
  Sparkles,
  ListChecks,
  CalendarClock,
  Target,
  Wallet,
  Dumbbell,
  Flame,
  Gauge,
} from "lucide-react";

export default function DashboardPage() {
  const doneToday = tasks.filter((t) => t.done).length;

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-brush text-4xl lowercase text-fg">
            good evening, rantzel
          </h1>
          <p className="mt-1 text-sm text-muted">
            Here&apos;s your day at a glance. You&apos;re on a 12-day streak — keep it going.
          </p>
        </div>
        <QuickActions />
      </div>

      {/* Top stat row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card delay={0.02}>
          <div className="flex items-center justify-between">
            <Stat label="Productivity" value={`${productivityScore}`} sub="+6 vs last week" />
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
              <Gauge className="h-5 w-5" />
            </span>
          </div>
        </Card>
        <Card delay={0.05}>
          <div className="flex items-center justify-between">
            <Stat label="Balance" value={`$${budget.balance.toLocaleString()}`} sub={`$${budget.monthlySaved} saved`} />
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
              <Wallet className="h-5 w-5" />
            </span>
          </div>
        </Card>
        <Card delay={0.08}>
          <div className="flex items-center justify-between">
            <Stat label="Tasks today" value={`${doneToday}/${tasks.length}`} sub="2 high priority" />
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
              <ListChecks className="h-5 w-5" />
            </span>
          </div>
        </Card>
        <Card delay={0.11}>
          <div className="flex items-center justify-between">
            <Stat label="Workout" value={workout.today} sub={`${workout.streak}-day streak`} />
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
              <Dumbbell className="h-5 w-5" />
            </span>
          </div>
        </Card>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* AI recommendations — hero widget */}
        <Card delay={0.05} className="lg:col-span-2 lg:row-span-1">
          <CardHeader
            title="AI daily recommendations"
            icon={Sparkles}
            action={<Pill tone="accent">Live</Pill>}
          />
          <ul className="space-y-2.5">
            {aiRecommendations.map((r, i) => (
              <li key={i} className="flex gap-3 rounded-xl bg-surface/60 p-3 text-sm text-fg">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-accent-soft text-[11px] font-semibold text-accent">
                  {i + 1}
                </span>
                {r}
              </li>
            ))}
          </ul>
        </Card>

        {/* Today's tasks */}
        <Card delay={0.08}>
          <CardHeader title="Today's tasks" icon={ListChecks} />
          <ul className="space-y-2">
            {tasks.slice(0, 5).map((t) => (
              <li key={t.id} className="flex items-center gap-3 text-sm">
                <span
                  className={`grid h-4 w-4 place-items-center rounded border ${
                    t.done ? "border-accent bg-accent" : "border-border"
                  }`}
                >
                  {t.done && <span className="text-[9px] text-bg">✓</span>}
                </span>
                <span className={t.done ? "text-muted line-through" : "text-fg"}>{t.title}</span>
                <span className="ml-auto">
                  <Pill tone={t.priority === "high" ? "warn" : "muted"}>{t.priority}</Pill>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Productivity trend */}
        <Card delay={0.1} className="lg:col-span-2">
          <CardHeader title="Productivity this week" icon={Gauge} />
          <TrendArea data={productivityTrend} dataKey="score" />
        </Card>

        {/* Upcoming events */}
        <Card delay={0.12}>
          <CardHeader title="Upcoming" icon={CalendarClock} />
          <ul className="space-y-3">
            {events.map((e) => (
              <li key={e.id} className="flex items-center gap-3 text-sm">
                <span className="w-12 shrink-0 tabular-nums text-muted">{e.time}</span>
                <span className="h-2 w-2 rounded-full" style={{ background: e.color }} />
                <span className="text-fg">{e.title}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Budget summary */}
        <Card delay={0.14}>
          <CardHeader title="Budget summary" icon={Wallet} />
          <Donut data={budget.categories} />
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-muted">Spent ${budget.monthlySpend}</span>
            <span className="font-medium text-fg">
              ${budget.budgetTotal - budget.monthlySpend} left
            </span>
          </div>
        </Card>

        {/* Goals */}
        <Card delay={0.16}>
          <CardHeader title="Current goals" icon={Target} />
          <div className="space-y-3.5">
            {goals.slice(0, 3).map((g) => (
              <div key={g.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-fg">{g.title}</span>
                  <span className="text-muted">{g.progress}%</span>
                </div>
                <Progress value={g.progress} />
              </div>
            ))}
          </div>
        </Card>

        {/* Habit streaks */}
        <Card delay={0.18}>
          <CardHeader title="Habit streaks" icon={Flame} />
          <div className="grid grid-cols-2 gap-2">
            {habits.slice(0, 6).map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between rounded-xl bg-surface/60 px-3 py-2 text-sm"
              >
                <span className="text-fg">{h.name}</span>
                <span className="flex items-center gap-1 text-accent">
                  <Flame className="h-3.5 w-3.5" />
                  {h.streak}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
