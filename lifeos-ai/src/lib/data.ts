// Central mock data for LifeOS AI.
// Swap these out for Supabase queries when the backend is wired up.

export const tasks = [
  { id: 1, title: "Finish calculus problem set", priority: "high", category: "School", due: "Today", done: false, tags: ["math"] },
  { id: 2, title: "Push day — chest & triceps", priority: "medium", category: "Gym", due: "Today", done: false, tags: ["workout"] },
  { id: 3, title: "Review budget for August", priority: "medium", category: "Finance", due: "Today", done: true, tags: ["money"] },
  { id: 4, title: "Read 20 pages — Deep Work", priority: "low", category: "Personal", due: "Today", done: false, tags: ["read"] },
  { id: 5, title: "CS project: auth flow", priority: "high", category: "School", due: "Tomorrow", done: false, tags: ["code"] },
  { id: 6, title: "Meal prep for the week", priority: "low", category: "Health", due: "Sun", done: false, tags: ["food"] },
];

export const events = [
  { id: 1, title: "Physics Lecture", time: "09:00", tag: "School", color: "#6d8a74" },
  { id: 2, title: "Gym — Push", time: "17:30", tag: "Fitness", color: "#c58a4a" },
  { id: 3, title: "Study group", time: "19:00", tag: "School", color: "#6d8a74" },
  { id: 4, title: "Journal + Night Review", time: "22:00", tag: "Personal", color: "#7a6d8a" },
];

export const goals = [
  { id: 1, title: "Graduate with 3.8 GPA", progress: 72, deadline: "2026", type: "Long-term" },
  { id: 2, title: "Save $5,000", progress: 48, deadline: "Dec 2026", type: "Long-term" },
  { id: 3, title: "Bench press 100kg", progress: 61, deadline: "Q4", type: "Short-term" },
  { id: 4, title: "Ship 3 side projects", progress: 33, deadline: "2026", type: "Short-term" },
];

export const habits = [
  { id: 1, name: "Study", streak: 12, done: true, week: [1, 1, 1, 0, 1, 1, 1] },
  { id: 2, name: "Workout", streak: 5, done: true, week: [1, 0, 1, 1, 0, 1, 1] },
  { id: 3, name: "Read", streak: 8, done: false, week: [1, 1, 1, 1, 1, 0, 0] },
  { id: 4, name: "Journal", streak: 21, done: true, week: [1, 1, 1, 1, 1, 1, 1] },
  { id: 5, name: "Drink water", streak: 3, done: false, week: [1, 1, 0, 1, 0, 0, 1] },
  { id: 6, name: "Sleep 8h", streak: 4, done: true, week: [0, 1, 1, 1, 0, 1, 1] },
  { id: 7, name: "Meditate", streak: 6, done: false, week: [1, 0, 1, 1, 1, 0, 1] },
];

export const budget = {
  balance: 3240,
  monthlySpend: 1180,
  monthlySaved: 640,
  budgetTotal: 2000,
  categories: [
    { name: "Food", value: 420, color: "#6d8a74" },
    { name: "Rent", value: 500, color: "#8aa590" },
    { name: "Transport", value: 120, color: "#c4d3ba" },
    { name: "Fun", value: 90, color: "#c58a4a" },
    { name: "Other", value: 50, color: "#7a6d8a" },
  ],
};

export const workout = {
  split: "Push / Pull / Legs",
  today: "Push",
  streak: 5,
  volumeWeek: 18400,
  prs: [
    { lift: "Bench", value: "82.5kg" },
    { lift: "Squat", value: "110kg" },
    { lift: "Deadlift", value: "140kg" },
  ],
  bodyweight: 74.2,
};

export const spendingTrend = [
  { d: "Mon", spend: 40, budget: 66 },
  { d: "Tue", spend: 82, budget: 66 },
  { d: "Wed", spend: 30, budget: 66 },
  { d: "Thu", spend: 95, budget: 66 },
  { d: "Fri", spend: 120, budget: 66 },
  { d: "Sat", spend: 60, budget: 66 },
  { d: "Sun", spend: 25, budget: 66 },
];

export const productivityTrend = [
  { d: "Mon", score: 62 },
  { d: "Tue", score: 74 },
  { d: "Wed", score: 58 },
  { d: "Thu", score: 81 },
  { d: "Fri", score: 88 },
  { d: "Sat", score: 70 },
  { d: "Sun", score: 84 },
];

export const aiRecommendations = [
  "Your Friday productivity peaks — schedule the CS project deep-work block then.",
  "You've skipped water 3 days this week. Add a 2pm reminder to protect the streak.",
  "Budget: you're $180 over on 'Fun'. Skip one takeout to stay on target.",
  "Legs day is overdue by 2 days — slot it tomorrow before it breaks your split.",
];

export const gamification = {
  level: 14,
  xp: 3240,
  xpToNext: 4000,
  badges: [
    { name: "21-Day Journal", icon: "📓", earned: true },
    { name: "Early Riser", icon: "🌅", earned: true },
    { name: "Budget Boss", icon: "💰", earned: true },
    { name: "PR Machine", icon: "🏋️", earned: false },
    { name: "Straight A", icon: "🎓", earned: false },
    { name: "Zen Mind", icon: "🧘", earned: false },
  ],
};

export const productivityScore = 84;
