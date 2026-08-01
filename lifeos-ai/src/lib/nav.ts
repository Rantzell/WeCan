import {
  LayoutDashboard,
  GraduationCap,
  Dumbbell,
  Wallet,
  Target,
  Repeat2,
  BookOpen,
  CalendarDays,
  ListChecks,
  Sparkles,
  BarChart3,
  Trophy,
  Heart,
  Moon,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  group: "Overview" | "Life" | "Intelligence";
};

export const NAV: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, group: "Overview" },
  { label: "Calendar", href: "/calendar", icon: CalendarDays, group: "Overview" },
  { label: "Tasks", href: "/tasks", icon: ListChecks, group: "Overview" },

  { label: "School Hub", href: "/school", icon: GraduationCap, group: "Life" },
  { label: "Gym & Fitness", href: "/gym", icon: Dumbbell, group: "Life" },
  { label: "Budget", href: "/budget", icon: Wallet, group: "Life" },
  { label: "Goals", href: "/goals", icon: Target, group: "Life" },
  { label: "Habits", href: "/habits", icon: Repeat2, group: "Life" },
  { label: "Journal", href: "/journal", icon: BookOpen, group: "Life" },
  { label: "Wishlist", href: "/wishlist", icon: Heart, group: "Life" },

  { label: "AI Coach", href: "/coach", icon: Sparkles, group: "Intelligence" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, group: "Intelligence" },
  { label: "Achievements", href: "/achievements", icon: Trophy, group: "Intelligence" },
  { label: "Night Review", href: "/night-review", icon: Moon, group: "Intelligence" },
];

export const NAV_GROUPS = ["Overview", "Life", "Intelligence"] as const;
