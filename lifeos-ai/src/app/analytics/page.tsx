"use client";
import { Card, CardHeader, PageHeader } from "@/components/ui";
import { TrendArea, MiniBars, Donut } from "@/components/charts";
import { productivityTrend, spendingTrend, budget } from "@/lib/data";
import { Gauge, Wallet, Dumbbell, Repeat2 } from "lucide-react";

const workoutWeek = [
  { d: "Mon", v: 1 }, { d: "Tue", v: 0 }, { d: "Wed", v: 1 }, { d: "Thu", v: 1 },
  { d: "Fri", v: 0 }, { d: "Sat", v: 1 }, { d: "Sun", v: 1 },
];
const studyWeek = [
  { d: "Mon", h: 2 }, { d: "Tue", h: 3.5 }, { d: "Wed", h: 1 }, { d: "Thu", h: 4 },
  { d: "Fri", h: 3 }, { d: "Sat", h: 2.5 }, { d: "Sun", h: 1.5 },
];

export default function Page() {
  return (
    <div>
      <PageHeader title="Analytics" subtitle="Productivity, study, fitness, budget & habit trends" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card><CardHeader title="Productivity score" icon={Gauge} /><TrendArea data={productivityTrend} dataKey="score" /></Card>
        <Card><CardHeader title="Study hours" icon={Repeat2} /><MiniBars data={studyWeek} dataKey="h" /></Card>
        <Card><CardHeader title="Spending vs budget" icon={Wallet} /><TrendArea data={spendingTrend} dataKey="spend" /></Card>
        <Card><CardHeader title="Workout consistency" icon={Dumbbell} /><MiniBars data={workoutWeek} dataKey="v" /></Card>
        <Card className="lg:col-span-2"><CardHeader title="Spending by category" icon={Wallet} /><div className="max-w-xs"><Donut data={budget.categories} /></div></Card>
      </div>
    </div>
  );
}
