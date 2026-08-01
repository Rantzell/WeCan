"use client";
import { ModuleStub } from "@/components/module-stub";
import { Dumbbell } from "lucide-react";

export default function Page() {
  return (
    <ModuleStub
      title="Gym & Fitness"
      subtitle="Push/Pull/Legs · PRs · body metrics · nutrition"
      icon={Dumbbell}
      features={[
        "Workout routines & PPL split",
        "Exercise history",
        "Personal records",
        "Bodyweight & measurements",
        "Calories & protein",
        "Water & sleep",
        "Progress charts",
        "Recovery tracking",
      ]}
      ai={[
        "Recommend today's workout",
        "Suggest progressive overload",
        "Track progress toward PRs",
        "Recommend recovery days",
      ]}
    />
  );
}
