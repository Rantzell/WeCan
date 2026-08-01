"use client";
import { Card, CardHeader, PageHeader, Progress, Pill } from "@/components/ui";
import { gamification } from "@/lib/data";
import { Trophy, Flame, Zap } from "lucide-react";

const challenges = [
  { title: "Study 15h this week", progress: 62, reward: "+200 XP" },
  { title: "No missed workouts", progress: 80, reward: "+150 XP" },
  { title: "Journal every night", progress: 100, reward: "+100 XP" },
];

export default function Page() {
  const { level, xp, xpToNext, badges } = gamification;
  return (
    <div>
      <PageHeader title="Achievements" subtitle="XP, levels, badges & challenges" />

      <Card className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-accent text-2xl font-bold text-bg shadow-glow">
              {level}
            </span>
            <div>
              <p className="text-sm text-muted">Current level</p>
              <p className="text-xl font-semibold text-fg">Level {level}</p>
              <p className="flex items-center gap-1 text-xs text-accent"><Zap className="h-3.5 w-3.5" />{xp.toLocaleString()} XP</p>
            </div>
          </div>
          <div className="w-full max-w-xs">
            <div className="mb-1 flex justify-between text-xs text-muted">
              <span>Progress to {level + 1}</span><span>{xp}/{xpToNext}</span>
            </div>
            <Progress value={(xp / xpToNext) * 100} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Badges" icon={Trophy} />
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {badges.map((b) => (
              <div key={b.name} className={`flex flex-col items-center gap-1 rounded-xl p-3 text-center ${b.earned ? "bg-accent-soft" : "bg-surface/60 opacity-50"}`}>
                <span className="text-2xl">{b.icon}</span>
                <span className="text-[10px] text-fg">{b.name}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Weekly challenges" icon={Flame} />
          <div className="space-y-3">
            {challenges.map((c) => (
              <div key={c.title}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-fg">{c.title}</span>
                  <Pill tone="accent">{c.reward}</Pill>
                </div>
                <Progress value={c.progress} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
