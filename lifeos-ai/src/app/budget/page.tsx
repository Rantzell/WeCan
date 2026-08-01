"use client";
import { ModuleStub } from "@/components/module-stub";
import { Wallet } from "lucide-react";

export default function Page() {
  return (
    <ModuleStub
      title="Budget & Finance"
      subtitle="Income, expenses, savings goals & analytics"
      icon={Wallet}
      features={[
        "Income tracking",
        "Expense tracking",
        "Monthly budget",
        "Savings goals",
        "Bills",
        "Spending categories",
        "Investments (optional)",
        "Financial analytics",
      ]}
      ai={[
        "Can I afford this purchase?",
        "Where did I overspend?",
        "How much should I save this month?",
        "How can I reduce expenses?",
      ]}
    />
  );
}
