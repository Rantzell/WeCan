"use client";
import { ModuleStub } from "@/components/module-stub";
import { GraduationCap } from "lucide-react";

export default function Page() {
  return (
    <ModuleStub
      title="School Hub"
      subtitle="Schedule, assignments, GPA, Pomodoro & study analytics"
      icon={GraduationCap}
      features={[
        "Weekly class schedule",
        "Assignment tracker",
        "Quiz & exam tracker",
        "GPA calculator",
        "Pomodoro study timer",
        "Subject organization",
        "Deadlines",
        "Study analytics",
      ]}
      ai={[
        "Plan and schedule study sessions",
        "Prioritize assignments by deadline & weight",
        "Build a weekly study schedule",
        "Explain difficult topics on demand",
      ]}
    />
  );
}
