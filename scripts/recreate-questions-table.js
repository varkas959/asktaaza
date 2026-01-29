const Database = require("better-sqlite3");
const path = require("path");

try {
  const dbPath = process.env.DATABASE_URL || "./sqlite.db";
  console.log(`Recreating questions table at: ${dbPath}`);
  
  const db = new Database(dbPath);
  
  // Check if there's any data
  const count = db.prepare("SELECT COUNT(*) as count FROM questions").get();
  console.log(`\nCurrent questions in database: ${count.count}`);
  
  if (count.count > 0) {
    console.log("\n⚠️  WARNING: There are existing questions. Backing up...");
    const backup = db.prepare("SELECT * FROM questions").all();
    console.log(`Backed up ${backup.length} questions.`);
  }
  
  // Drop the old table
  console.log("\nDropping old questions table...");
  db.prepare("DROP TABLE IF EXISTS questions").run();
  
  // Create the new table with correct schema
  console.log("Creating new questions table with correct schema...");
  db.prepare(`
    CREATE TABLE questions (
      id TEXT PRIMARY KEY NOT NULL,
      content TEXT NOT NULL,
      company TEXT NOT NULL,
      skill TEXT,
      category TEXT,
      interview_date INTEGER NOT NULL,
      experience_level TEXT,
      round TEXT NOT NULL,
      source TEXT,
      user_id TEXT NOT NULL,
      is_flagged INTEGER DEFAULT false NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `).run();
  
  console.log("✓ Questions table recreated successfully!");
  
  db.close();
  console.log("\n✓ Done!");
  
} catch (error) {
  console.error("\n✗ Error:", error.message);
  process.exit(1);
}