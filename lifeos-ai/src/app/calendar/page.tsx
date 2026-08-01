"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, PageHeader, Pill } from "@/components/ui";
import {
  ChevronLeft,
  ChevronRight,
  X,
  CalendarClock,
  Check,
} from "lucide-react";

type EventItem = {
  id: string;
  title: string;
  category: string;
  color: string;
  starts_at: string; // ISO
  isTask?: boolean;
};

const TASK_COLOR = "#b5482f";

const CATS: Record<string, string> = {
  School: "#6d8a74",
  Fitness: "#b5482f",
  Personal: "#7a6d8a",
  Work: "#4a7d8a",
  Health: "#c58a4a",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function iso(d: Date) {
  // Local YYYY-MM-DD (avoids UTC off-by-one from toISOString).
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function sameDay(a: Date, b: Date) {
  return iso(a) === iso(b);
}

/* seed a few sample events in the current month so it isn't empty */
function seedEvents(base: Date): EventItem[] {
  const y = base.getFullYear();
  const m = base.getMonth();
  const mk = (day: number, h: number, title: string, category: string): EventItem => ({
    id: `seed-${day}-${title}`,
    title,
    category,
    color: CATS[category] ?? "#b5482f",
    starts_at: new Date(y, m, day, h).toISOString(),
  });
  const today = base.getDate();
  return [
    mk(today, 9, "Physics Lecture", "School"),
    mk(today, 17, "Gym — Push", "Fitness"),
    mk(Math.min(today + 1, 28), 19, "Study group", "School"),
    mk(Math.min(today + 3, 28), 10, "Dentist", "Health"),
    mk(Math.max(today - 2, 1), 14, "Project deadline", "Work"),
  ];
}

export default function CalendarPage() {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selected, setSelected] = useState<Date | null>(today);
  const [showAdd, setShowAdd] = useState(false);

  // form
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(iso(today));
  const [time, setTime] = useState("09:00");
  const [category, setCategory] = useState("Personal");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [evRes, taskRes] = await Promise.all([
          fetch("/api/events"),
          fetch("/api/tasks"),
        ]);
        const evData = await evRes.json();
        const taskData = await taskRes.json();
        if (!active) return;

        const rows: EventItem[] = (evData.data ?? []).map((e: any) => ({
          id: e.id,
          title: e.title,
          category: e.category ?? "Personal",
          color: e.color ?? CATS[e.category] ?? "#b5482f",
          starts_at: e.starts_at,
        }));

        // Tasks that have a deadline show up as calendar items too.
        const taskItems: EventItem[] = (taskData.data ?? [])
          .filter((t: any) => t.due_date)
          .map((t: any) => ({
            id: `task-${t.id}`,
            title: t.title,
            category: t.category ?? "Task",
            color: TASK_COLOR,
            starts_at: new Date(`${t.due_date}T23:59`).toISOString(),
            isTask: true,
          }));

        const merged = [...rows, ...taskItems];
        setEvents(merged.length ? merged : seedEvents(today));
      } catch {
        setEvents(seedEvents(today));
      }
    })();
    return () => {
      active = false;
    };
  }, [today]);

  // Build the 6-week grid.
  const cells = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [cursor]);

  const eventsFor = (d: Date) =>
    events.filter((e) => sameDay(new Date(e.starts_at), d));

  const selectedEvents = selected
    ? eventsFor(selected).sort(
        (a, b) => +new Date(a.starts_at) - +new Date(b.starts_at)
      )
    : [];

  function shiftMonth(delta: number) {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));
  }

  async function addEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    const starts_at = new Date(`${date}T${time}`).toISOString();
    const optimistic: EventItem = {
      id: `tmp-${Date.now()}`,
      title,
      category,
      color: CATS[category] ?? "#b5482f",
      starts_at,
    };
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          color: CATS[category] ?? "#b5482f",
          starts_at,
        }),
      });
      const data = await res.json();
      const saved =
        data?.data && !data.demo
          ? { ...optimistic, id: data.data.id }
          : optimistic;
      setEvents((prev) => [...prev, saved]);
      setTitle("");
      setShowAdd(false);
    } catch {
      setEvents((prev) => [...prev, optimistic]);
      setShowAdd(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Calendar"
        subtitle="Double-click any day to add an event"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Calendar grid */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-fg">
              {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => shiftMonth(-1)}
                className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted hover:bg-surface hover:text-fg"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
                  setSelected(today);
                }}
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-fg hover:bg-surface"
              >
                Today
              </button>
              <button
                onClick={() => shiftMonth(1)}
                className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted hover:bg-surface hover:text-fg"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mb-1 grid grid-cols-7 gap-1">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-1 text-center text-[11px] font-medium uppercase text-muted">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              const inMonth = d.getMonth() === cursor.getMonth();
              const isToday = sameDay(d, today);
              const isSelected = selected && sameDay(d, selected);
              const dayEvents = eventsFor(d);
              return (
                <button
                  key={i}
                  onClick={() => setSelected(d)}
                  onDoubleClick={() => {
                    setSelected(d);
                    setDate(iso(d));
                    setShowAdd(true);
                  }}
                  className={`flex min-h-[68px] flex-col rounded-xl border p-1.5 text-left transition-colors ${
                    isSelected
                      ? "border-accent bg-accent-soft"
                      : "border-transparent hover:bg-surface"
                  } ${inMonth ? "" : "opacity-40"}`}
                >
                  <span
                    className={`mb-1 grid h-6 w-6 place-items-center rounded-full text-xs ${
                      isToday ? "bg-accent font-semibold text-bg" : "text-fg"
                    }`}
                  >
                    {d.getDate()}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    {dayEvents.slice(0, 2).map((e) => (
                      <span
                        key={e.id}
                        className="truncate rounded px-1 py-0.5 text-[10px] text-white"
                        style={{ background: e.color }}
                      >
                        {e.isTask ? "• " : ""}
                        {e.title}
                      </span>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[10px] text-muted">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Day detail */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-soft text-accent">
              <CalendarClock className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-fg">
                {selected
                  ? selected.toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })
                  : "Select a day"}
              </h3>
              <p className="text-xs text-muted">
                {selectedEvents.length} event{selectedEvents.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {selectedEvents.length === 0 ? (
            <p className="rounded-xl bg-surface/60 p-4 text-center text-sm text-muted">
              Nothing scheduled. Add an event to fill your day.
            </p>
          ) : (
            <ul className="space-y-2">
              {selectedEvents.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center gap-3 rounded-xl bg-surface/60 p-3 text-sm"
                >
                  <span
                    className="h-8 w-1 rounded-full"
                    style={{ background: e.color }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-fg">{e.title}</p>
                    <p className="text-xs text-muted">
                      {e.isTask
                        ? "Task deadline"
                        : new Date(e.starts_at).toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                    </p>
                  </div>
                  <Pill tone={e.isTask ? "warn" : "accent"}>{e.category}</Pill>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Add event modal */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.97 }}
                className="my-auto w-full max-w-md"
              >
              <div className="glass max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-soft">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-fg">Add event</h3>
                  <button
                    onClick={() => setShowAdd(false)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface hover:text-fg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <form onSubmit={addEvent} className="space-y-3">
                  <input
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Event title"
                    className="w-full rounded-xl border border-border bg-card/50 px-3 py-2.5 text-sm text-fg outline-none placeholder:text-muted focus:border-accent"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="rounded-xl border border-border bg-card/50 px-3 py-2.5 text-sm text-fg outline-none focus:border-accent"
                    />
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="rounded-xl border border-border bg-card/50 px-3 py-2.5 text-sm text-fg outline-none focus:border-accent"
                    />
                  </div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card/50 px-3 py-2.5 text-sm text-fg outline-none focus:border-accent"
                  >
                    {Object.keys(CATS).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {saving ? "Saving…" : <><Check className="h-4 w-4" /> Add event</>}
                  </button>
                </form>
              </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
