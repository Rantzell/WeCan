"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plus,
  Timer,
  Dumbbell,
  BookOpen,
  Moon,
  X,
  Play,
  Pause,
  RotateCcw,
  Check,
} from "lucide-react";

/* ---------------- Modal shell ---------------- */
function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: "spring", damping: 24, stiffness: 300 }}
              className="my-auto w-full max-w-md"
            >
              <div className="glass max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-fg">{title}</h3>
                <button
                  onClick={onClose}
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface hover:text-fg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Add task ---------------- */
export function AddTaskModal({
  open,
  onClose,
  onAdded,
}: {
  open: boolean;
  onClose: () => void;
  onAdded?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("Personal");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          priority,
          category,
          status: "todo",
          due_date: dueDate || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      if (data.demo) {
        setMsg("Saved locally (demo) — connect Supabase to persist.");
      } else {
        setTitle("");
        setDueDate("");
        onAdded?.();
        onClose();
        return;
      }
    } catch (err: any) {
      setMsg(err.message || "Could not save task.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add task">
      <form onSubmit={submit} className="space-y-3">
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
          className="w-full rounded-xl border border-border bg-card/50 px-3 py-2.5 text-sm text-fg outline-none placeholder:text-muted focus:border-accent"
        />
        <div className="grid grid-cols-2 gap-3">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-xl border border-border bg-card/50 px-3 py-2.5 text-sm text-fg outline-none focus:border-accent"
          >
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-border bg-card/50 px-3 py-2.5 text-sm text-fg outline-none focus:border-accent"
          >
            {["Personal", "School", "Gym", "Finance", "Health"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <label className="block">
          <span className="mb-1 block text-xs text-muted">
            Deadline <span className="opacity-60">(optional)</span>
          </span>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-border bg-card/50 px-3 py-2.5 text-sm text-fg outline-none focus:border-accent"
          />
        </label>
        {msg && <p className="text-xs text-accent">{msg}</p>}
        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Saving…" : <><Check className="h-4 w-4" /> Add task</>}
        </button>
      </form>
    </Modal>
  );
}

/* ---------------- Pomodoro ---------------- */
function PomodoroModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(ref.current!);
            setRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running]);

  function set(kind: "focus" | "break") {
    setMode(kind);
    setRunning(false);
    setSeconds(kind === "focus" ? 25 * 60 : 5 * 60);
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const total = mode === "focus" ? 25 * 60 : 5 * 60;
  const pct = ((total - seconds) / total) * 100;

  return (
    <Modal open={open} onClose={onClose} title="Pomodoro timer">
      <div className="flex flex-col items-center">
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => set("focus")}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              mode === "focus" ? "bg-accent text-bg" : "bg-surface text-muted"
            }`}
          >
            Focus 25:00
          </button>
          <button
            onClick={() => set("break")}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              mode === "break" ? "bg-accent text-bg" : "bg-surface text-muted"
            }`}
          >
            Break 05:00
          </button>
        </div>

        <div className="relative grid h-44 w-44 place-items-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--surface))" strokeWidth="6" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--accent))"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 45}
              strokeDashoffset={2 * Math.PI * 45 * (1 - pct / 100)}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <span className="text-4xl font-semibold tabular-nums text-fg">
            {mm}:{ss}
          </span>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-bg"
          >
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? "Pause" : "Start"}
          </button>
          <button
            onClick={() => set(mode)}
            className="flex items-center gap-2 rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm text-fg hover:bg-surface"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ---------------- Quick actions bar ---------------- */
export function QuickActions() {
  const router = useRouter();
  const [openTask, setOpenTask] = useState(false);
  const [openPomodoro, setOpenPomodoro] = useState(false);

  const actions = [
    { label: "Add task", icon: Plus, onClick: () => setOpenTask(true) },
    { label: "Start Pomodoro", icon: Timer, onClick: () => setOpenPomodoro(true) },
    { label: "Log workout", icon: Dumbbell, onClick: () => router.push("/gym") },
    { label: "New journal", icon: BookOpen, onClick: () => router.push("/journal") },
    { label: "Night review", icon: Moon, onClick: () => router.push("/night-review") },
  ];

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={a.onClick}
            className="flex items-center gap-2 rounded-xl border border-border bg-card/50 px-3 py-2 text-xs font-medium text-fg transition-colors hover:bg-surface"
          >
            <a.icon className="h-4 w-4 text-accent" />
            {a.label}
          </button>
        ))}
      </div>

      <AddTaskModal
        open={openTask}
        onClose={() => setOpenTask(false)}
        onAdded={() => router.refresh()}
      />
      <PomodoroModal open={openPomodoro} onClose={() => setOpenPomodoro(false)} />
    </>
  );
}
