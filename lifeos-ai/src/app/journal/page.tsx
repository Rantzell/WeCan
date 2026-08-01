"use client";
import { ModuleStub } from "@/components/module-stub";
import { BookOpen } from "lucide-react";

export default function Page() {
  return (
    <ModuleStub
      title="Journal"
      subtitle="Daily reflection with mood, gratitude, wins & prompts"
      icon={BookOpen}
      features={[
        "Rich text editor",
        "Mood selector",
        "Gratitude section",
        "Wins & challenges",
        "Reflection prompts",
        "Entry calendar",
        "Search & tags",
        "Weekly recap",
      ]}
      ai={[
        "Summarize weekly entries",
        "Detect emotional trends",
        "Provide insights",
        "Suggest improvements",
      ]}
    />
  );
}
