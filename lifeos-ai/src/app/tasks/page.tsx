"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, PageHeader, Pill } from "@/components/ui";
import { AddTaskModal } from "@/components/quick-actions";
import { tasks as seed } from "@/lib/data";
import { Sparkles, Plus } from "lucide-react";

type Task = {
  id: string;
  title: string;
  category: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "doing" | "done";
  due?: string;
  due_date?: string | null;
  completed_at?: string | null;
};

const columns = [
  { key: "todo", title: "To do" },
  { key: "doing", title: "In progress" },
  { key: "done", title: "Done" },
] as const;

const DAY_MS = 24 * 60 * 60 * 1000;

// Hide done tasks whose completion was more than 24h ago.
function visible(t: Task) {
  if (t.status !== "done") return true;
  if (!t.completed_at) return true; // no timestamp yet → keep showing
  return Date.now() - new Date(t.completed_at).getTime() < DAY_MS;
}

export default function TasksPage() {
  const [items, setItems] = useState<Task[]>([]);
  const [demo, setDemo] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (data.demo || !Array.isArray(data.data)) {
        setDemo(true);
        setItems(
          seed.map((t, i) => ({
            id: String(t.id),
            title: t.title,
            category: t.category,
            priority: t.priority as Task["priority"],
            status: (t.done ? "done" : i % 3 === 0 ? "doing" : "todo") as Task["status"],
            due: t.due,
            completed_at: t.done ? new Date().toISOString() : null,
          }))
        );
        return;
      }
      setDemo(false);
      setItems(data.data as Task[]);
    } catch {
      setDemo(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function move(id: string, status: Task["status"]) {
    const completed_at = status === "done" ? new Date().toISOString() : null;
    // optimistic
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, completed_at } : t))
    );
    if (demo) return;
    try {
      await fetch(`/api/tasks?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, completed_at }),
      });
    } catch {
      /* keep optimistic state */
    }
  }

  const shown = items.filter(visible);

  return (
    <div>
      <PageHeader
        title="Tasks"
        subtitle={
          demo
            ? "Kanban board · demo data"
            : "Kanban board · saved to your account · done tasks clear after 24h"
        }
        action={
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-xl border border-border bg-card/50 px-3 py-2 text-sm text-fg hover:bg-surface">
              <Sparkles className="h-4 w-4 text-accent" /> AI prioritize
            </button>
            <button
              onClick={() => setOpenAdd(true)}
              className="flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm font-medium text-bg"
            >
              <Plus className="h-4 w-4" /> New task
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {columns.map((c) => {
          const colItems = shown.filter((t) => t.status === c.key);
          return (
            <div key={c.key} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-fg">{c.title}</h3>
                <Pill>{colItems.length}</Pill>
              </div>

              {colItems.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted">
                  Nothing here
                </div>
              )}

              {colItems.map((t) => (
                <Card key={t.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-fg">{t.title}</p>
                    <Pill
                      tone={
                        t.priority === "high"
                          ? "warn"
                          : t.priority === "low"
                          ? "muted"
                          : "accent"
                      }
                    >
                      {t.priority}
                    </Pill>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted">
                    <Pill>{t.category}</Pill>
                    {(t.due || t.due_date) && <span>· due {t.due ?? t.due_date}</span>}
                  </div>
                  <div className="mt-3 flex gap-1">
                    {columns
                      .filter((x) => x.key !== c.key)
                      .map((x) => (
                        <button
                          key={x.key}
                          onClick={() => move(t.id, x.key)}
                          className="rounded-lg bg-surface px-2 py-1 text-[11px] text-muted hover:text-fg"
                        >
                          → {x.title}
                        </button>
                      ))}
                  </div>
                </Card>
              ))}
            </div>
          );
        })}
      </div>

      <AddTaskModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onAdded={load}
      />
    </div>
  );
}
