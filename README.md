# We Can: AI Personal Productivity Dashboard

An all-in-one personal productivity web app that brings tasks, calendar, habits, goals, and analytics into a single dashboard, with an AI coach to help plan the day.

> **Status: In development.** Tasks, Calendar, AI Coach, and authentication are connected to the database. Several modules still use sample data or are placeholders (see [Features](#features)).

---

## Features

| Module | Status |
|---|---|
| Sign up / log in (Supabase Auth) | Working |
| Tasks | Working, saved to the database |
| Calendar & events | Working, saved to the database |
| AI Coach (Gemini, Groq, or local Ollama) | Working, with demo replies when no AI key is set |
| Quick actions | Working |
| Dashboard, Habits, Goals, Analytics, Achievements, Night Review | UI built, using sample data |
| Budget, Gym, Journal, School | Planned |

### Highlights
- **Per-user data security:** every table uses Supabase row-level security, so each user can only read and write their own data.
- **Reusable API layer:** a small helper turns a database table into authenticated REST routes, so each module gets protected `GET`/`POST`/`PATCH`/`DELETE` endpoints. The signed-in user's ID is attached to every record.
- **Swappable AI provider:** the coach works with Google Gemini, Groq, or a local Ollama model, chosen by one environment variable.
- **Light and dark themes**, charts with Recharts, and animations with Framer Motion.

---

## Tech Stack

| Area | Technologies |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion, Recharts, Lucide icons |
| Backend | Next.js Route Handlers, Supabase (Auth + PostgreSQL) |
| AI | Gemini / Groq / Ollama (provider-agnostic) |
| Landing page | Express.js serving static HTML/CSS/JS |

---

## Project Structure

```
WeCan/
├── server.js              # Express server for the landing page
├── public/                # Landing page (HTML, CSS, JS)
└── lifeos-ai/             # Main Next.js application
    ├── src/
    │   ├── app/           # Pages (tasks, calendar, coach, habits, …) and API routes
    │   │   └── api/       # REST endpoints per module
    │   ├── components/    # Shell, sidebar, top bar, charts, UI primitives
    │   └── lib/
    │       ├── api/       # Authenticated CRUD route factory
    │       ├── ai/        # AI provider (Gemini / Groq / Ollama)
    │       └── supabase/  # Browser, server, and middleware clients
    ├── supabase/
    │   └── schema.sql     # Tables + row-level security policies
    ├── scripts/           # Apply schema / inspect data (uses DATABASE_URL)
    └── .env.example       # Environment variable template
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- A free [Supabase](https://supabase.com) project
- *(Optional)* An API key for Gemini or Groq, or a local [Ollama](https://ollama.com) install

### 1. Install
```bash
git clone https://github.com/Rantzell/WeCan.git
cd WeCan/lifeos-ai
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env.local
```
Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>   # server only, never expose

AI_PROVIDER=gemini            # gemini | groq | ollama (leave blank for demo replies)
GEMINI_API_KEY=<your-gemini-key>

DATABASE_URL=postgresql://postgres:<your-db-password>@db.<your-project-ref>.supabase.co:5432/postgres
```

`.env.local` is ignored by git. Never commit real keys.

### 3. Create the database tables
Run `supabase/schema.sql` in the Supabase SQL editor, or:
```bash
node --env-file=.env.local scripts/apply-schema.mjs
```

### 4. Run the app
```bash
npm run dev     # http://localhost:3001
```

### Landing page (optional)
```bash
cd ..           # back to the WeCan root
npm install
npm start       # http://localhost:3000
```

---

## Roadmap
- Connect Habits, Goals, Dashboard, and Analytics to live data
- Build the Budget, Gym, Journal, and School modules
- Add tests and deploy to Vercel

---

<sub>Built by [Rantzel Dominguez](https://github.com/Rantzell).</sub>
