// Patch existing SQLite database to add missing columns for the questions table
// This keeps existing data (users/accounts/sessions) intact.

const Database = require("better-sqlite3");

const dbPath = process.env.DATABASE_URL || "./sqlite.db";
const db = new Database(dbPath);

const columnsToAdd = [
  { name: "skill", sql: "ALTER TABLE questions ADD COLUMN skill text" },
  { name: "category", sql: "ALTER TABLE questions ADD COLUMN category text" },
  { name: "experience_level", sql: "ALTER TABLE questions ADD COLUMN experience_level text" },
  { name: "source", sql: "ALTER TABLE questions ADD COLUMN source text" },
];

function columnExists(column) {
  const pragma = db.prepare("PRAGMA table_info(questions)").all();
  return pragma.some((row) => row.name === column);
}

columnsToAdd.forEach(({ name, sql }) => {
  if (!columnExists(name)) {
    try {
      db.exec(sql);
      console.log(`Added missing column: ${name}`);
    } catch (err) {
      console.error(`Failed to add column ${name}:`, err.message);
    }
  } else {
    console.log(`Column already exists: ${name}`);
  }
});

db.close();
console.log("Patch completed.");
