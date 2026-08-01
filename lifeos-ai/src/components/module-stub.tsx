"use client";

import { Card, PageHeader, Pill } from "@/components/ui";
import { Sparkles, type LucideIcon } from "lucide-react";

export function ModuleStub({
  title,
  subtitle,
  icon: Icon,
  features,
  ai,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  features: string[];
  ai: string[];
}) {
  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={<Pill tone="accent">In build</Pill>}
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-fg">Planned features</h3>
              <p className="text-xs text-muted">Fully designed, wiring data next</p>
            </div>
          </div>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 rounded-xl bg-surface/60 px-3 py-2.5 text-sm text-fg"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {f}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-soft text-accent">
              <Sparkles className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-semibold text-fg">How AI helps</h3>
          </div>
          <ul className="space-y-2.5">
            {ai.map((a) => (
              <li key={a} className="rounded-xl bg-surface/60 p-3 text-sm text-fg">
                {a}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
