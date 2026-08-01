"use client";
import { Card, PageHeader, Progress, Pill } from "@/components/ui";
import { Heart, Sparkles } from "lucide-react";

const wishlist = [
  { name: "Mechanical keyboard", price: 120, saved: 90, affordable: true },
  { name: "New running shoes", price: 140, saved: 40, affordable: false },
  { name: "Standing desk", price: 300, saved: 110, affordable: false },
  { name: "Noise-cancelling headphones", price: 250, saved: 250, affordable: true },
];

export default function Page() {
  return (
    <div>
      <PageHeader title="Wishlist" subtitle="Saved purchases, target prices & savings progress" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {wishlist.map((w) => (
          <Card key={w.name}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Heart className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-fg">{w.name}</p>
                  <p className="text-xs text-muted">${w.saved} of ${w.price} saved</p>
                </div>
              </div>
              <Pill tone={w.affordable ? "good" : "warn"}>
                {w.affordable ? "Affordable" : "Keep saving"}
              </Pill>
            </div>
            <Progress value={(w.saved / w.price) * 100} />
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-surface/60 p-3 text-xs text-fg">
              <Sparkles className="h-4 w-4 shrink-0 text-accent" />
              {w.affordable
                ? "This fits your budget and savings goals — good to buy."
                : `Save $${w.price - w.saved} more, or wait ${Math.ceil((w.price - w.saved) / 160)} weeks at your current rate.`}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
