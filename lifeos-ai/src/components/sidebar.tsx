"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV, NAV_GROUPS } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Command, LogOut } from "lucide-react";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    try {
      await createClient().auth.signOut();
    } catch {
      /* ignore — still redirect */
    }
    onNavigate?.();
    router.push("/welcome");
    router.refresh();
  }

  return (
    <aside className="flex h-full w-64 flex-col gap-6 border-r border-border bg-surface/40 px-3 py-5">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-2.5 px-2"
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-bg shadow-glow">
          <Command className="h-5 w-5" />
        </span>
        <div className="leading-tight">
          <p className="font-brush text-xl lowercase text-fg">we can</p>
          <p className="text-[11px] text-muted">Personal OS</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group}>
            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted/70">
              {group}
            </p>
            <div className="space-y-0.5">
              {NAV.filter((n) => n.group === group).map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all",
                      active
                        ? "bg-accent-soft font-medium text-fg shadow-sm"
                        : "text-muted hover:bg-surface hover:text-fg"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px] transition-colors",
                        active ? "text-accent" : "text-muted group-hover:text-fg"
                      )}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="rounded-xl border border-border bg-card/50 p-3">
        <p className="text-xs font-medium text-fg">Level 14 · 3,240 XP</p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface">
          <div className="h-full rounded-full bg-accent" style={{ width: "81%" }} />
        </div>
        <p className="mt-1.5 text-[11px] text-muted">760 XP to level 15</p>
      </div>

      <button
        onClick={signOut}
        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-fg"
      >
        <LogOut className="h-[18px] w-[18px]" />
        Sign out
      </button>
    </aside>
  );
}
