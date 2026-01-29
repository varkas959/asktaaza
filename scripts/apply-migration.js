const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const db = new Database("./sqlite.db");
const migrationSQL = fs.readFileSync(path.join(__dirname, "../drizzle/0000_wise_doorman.sql"), "utf8");

// Split by statement breakpoint and execute each statement
const statements = migrationSQL
  .split("--> statement-breakpoint")
  .map(s => s.trim())
  .filter(s => s && !s.startsWith("--"));

statements.forEach(statement => {
  try {
    db.exec(statement);
    console.log("Executed:", statement.substring(0, 50) + "...");
  } catch (error) {
    // Ignore errors for tables that already exist
    if (!error.message.includes("already exists")) {
      console.error("Error:", error.message);
    }
  }
});

db.close();
console.log("Migration applied successfully!");