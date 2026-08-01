"use client";
import { Card, CardHeader, PageHeader, Progress, Pill } from "@/components/ui";
import { goals } from "@/lib/data";
import { Target, Sparkles } from "lucide-react";

export default function Page() {
  return (
    <div>
      <PageHeader title="Goals" subtitle="Long & short-term goals with milestones and AI action plans" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {goals.map((g) => (
          <Card key={g.id}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Target className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-fg">{g.title}</p>
                  <p className="text-xs text-muted">Deadline · {g.deadline}</p>
                </div>
              </div>
              <Pill tone="accent">{g.type}</Pill>
            </div>
            <Progress value={g.progress} />
            <p className="mt-2 text-xs text-muted">{g.progress}% complete</p>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-surface/60 p-3 text-xs text-fg">
              <Sparkles className="h-4 w-4 shrink-0 text-accent" />
              AI next step: break this into 3 weekly milestones and add to your calendar.
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
