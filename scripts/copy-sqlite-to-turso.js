/**
 * One-time script: copy data from local SQLite (sqlite.db) to Turso.
 * Run from project root with: node scripts/copy-sqlite-to-turso.js
 *
 * Prerequisites:
 * - .env.local has TURSO_DATABASE_URL and TURSO_AUTH_TOKEN (Turso)
 * - Local file sqlite.db exists with data (or set DATABASE_URL to your file path)
 * - You have already run: npm run db:push (so Turso has the schema)
 */

require("dotenv").config({ path: ".env.local" });
const Database = require("better-sqlite3");
const { createClient } = require("@libsql/client");
const path = require("path");
const fs = require("fs");

const sqlitePath = process.env.DATABASE_URL?.replace("file:", "") || path.join(__dirname, "..", "sqlite.db");
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl || !tursoToken) {
  console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in .env.local");
  process.exit(1);
}

if (!fs.existsSync(sqlitePath)) {
  console.error("Local SQLite file not found:", sqlitePath);
  process.exit(1);
}

const sqlite = new Database(sqlitePath, { readonly: true });
const turso = createClient({ url: tursoUrl, authToken: tursoToken });

async function copyTable(tableName, orderBy = "rowid") {
  const rows = sqlite.prepare(`SELECT * FROM ${tableName} ORDER BY ${orderBy}`).all();
  if (rows.length === 0) {
    console.log(`  ${tableName}: 0 rows (skip)`);
    return 0;
  }
  const columns = Object.keys(rows[0]).join(", ");
  const placeholders = Object.keys(rows[0]).map(() => "?").join(", ");
  const sql = `INSERT OR REPLACE INTO ${tableName} (${columns}) VALUES (${placeholders})`;
  for (const row of rows) {
    await turso.execute(sql, Object.values(row));
  }
  console.log(`  ${tableName}: ${rows.length} rows copied`);
  return rows.length;
}

async function main() {
  console.log("Copying from", sqlitePath, "to Turso...");
  await copyTable("users");
  await copyTable("accounts");
  await copyTable("sessions");
  await copyTable("questions");
  sqlite.close();
  console.log("Done. Turso now has the data from your local SQLite file.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
