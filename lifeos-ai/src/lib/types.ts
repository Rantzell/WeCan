export type Priority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "doing" | "done";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  category: string;
  priority: Priority;
  status: TaskStatus;
  due_date: string | null;
  tags: string[];
  recurring: string | null;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  icon: string | null;
  target_days: number;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  type: "Short-term" | "Long-term";
  progress: number;
  deadline: string | null;
  milestones: unknown[];
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  kind: "income" | "expense";
  amount: number;
  category: string;
  note: string | null;
  spent_at: string;
  created_at: string;
}

export interface EventItem {
  id: string;
  user_id: string;
  title: string;
  category: string;
  color: string;
  starts_at: string;
  ends_at: string | null;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  entry_date: string;
  mood: string | null;
  gratitude: string | null;
  wins: string | null;
  challenges: string | null;
  body: string | null;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  name: string;
  target_price: number;
  saved: number;
  url: string | null;
}
