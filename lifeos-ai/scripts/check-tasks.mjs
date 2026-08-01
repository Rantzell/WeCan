import pg from "pg";
if (!process.env.DATABASE_URL) {
  console.error("Set DATABASE_URL in .env.local (run with: node --env-file=.env.local scripts/check-tasks.mjs)");
  process.exit(1);
}
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
await client.connect();
const { rows } = await client.query(
  "select title, priority, category, status, created_at from public.tasks order by created_at desc limit 5;"
);
console.log("Latest tasks in DB:");
rows.forEach((r) => console.log(" •", r.title, `[${r.priority}/${r.category}/${r.status}]`));
if (rows.length === 0) console.log("  (none yet)");
await client.end();
