"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Search, Menu, Sparkles } from "lucide-react";

function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!now) return <div className="h-5 w-40" />;
  const date = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const time = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div className="hidden items-baseline gap-2 sm:flex">
      <span className="text-sm font-medium text-fg">{date}</span>
      <span className="text-sm tabular-nums text-muted">{time}</span>
    </div>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = resolvedTheme === "dark";
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card/50 text-muted transition-colors hover:text-fg"
    >
      {mounted && dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  );
}

export function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-bg/70 px-4 py-3 backdrop-blur-xl">
      <button
        aria-label="Open menu"
        onClick={onMenu}
        className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card/50 text-muted lg:hidden"
      >
        <Menu className="h-[18px] w-[18px]" />
      </button>

      <LiveClock />

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-xl border border-border bg-card/50 px-3 py-2 text-sm text-muted md:flex">
          <Search className="h-4 w-4" />
          <span>Ask LifeOS or search…</span>
          <kbd className="ml-2 rounded bg-surface px-1.5 py-0.5 text-[10px] text-muted">⌘K</kbd>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90">
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">AI Coach</span>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
