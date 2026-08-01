import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(__dirname, "..", "supabase", "schema.sql"), "utf8");

const connectionString = process.argv[2] || process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Set DATABASE_URL in .env.local (run with: node --env-file=.env.local scripts/apply-schema.mjs)");
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log("Connected. Applying schema…");
  await client.query(sql);
  console.log("✅ Schema applied successfully.");

  const { rows } = await client.query(
    "select table_name from information_schema.tables where table_schema='public' order by table_name;"
  );
  console.log("Tables now in public schema:");
  rows.forEach((r) => console.log("  •", r.table_name));
} catch (err) {
  console.error("❌ Error:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
