import dotenv from "dotenv";
dotenv.config();

import pool from "../lib/db.ts";

async function run() {
  console.log("Starting migration run on DB:", process.env.DB_NAME);
  const { runMigrations } = await import("../lib/migrations/index.ts");
  try {
    await runMigrations();
    console.log("Migration executed successfully!");
  } catch (e) {
    console.error("Migration failed:", e);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

run();
