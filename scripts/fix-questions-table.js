const Database = require("better-sqlite3");
const path = require("path");

try {
  const dbPath = process.env.DATABASE_URL || "./sqlite.db";
  console.log(`Fixing questions table at: ${dbPath}`);
  
  const db = new Database(dbPath);
  
  // Check current schema
  const columns = db.prepare("PRAGMA table_info(questions)").all();
  console.log("\nCurrent columns:");
  columns.forEach(col => {
    console.log(`  - ${col.name} (${col.type}, notNull: ${col.notnull})`);
  });
  
  // Check if role column exists and is NOT NULL
  const roleColumn = columns.find(col => col.name === "role");
  if (roleColumn && roleColumn.notnull === 1) {
    console.log("\n⚠️  Found 'role' column that is NOT NULL. Making it nullable...");
    // SQLite doesn't support ALTER COLUMN directly, so we need to recreate the table
    // But first, let's just make it nullable by altering the constraint
    // Actually, SQLite has limited ALTER TABLE support, so we'll need to handle this differently
    
    // For now, let's add a default value or make it work with empty string
    console.log("Note: SQLite doesn't support ALTER COLUMN. We'll need to handle this in the insert.");
  }
  
  // Check for missing columns
  const requiredColumns = ["skill", "category", "experience_level", "source"];
  const existingColumnNames = columns.map(col => col.name);
  
  for (const colName of requiredColumns) {
    if (!existingColumnNames.includes(colName)) {
      console.log(`\nAdding missing column: ${colName}`);
      try {
        db.prepare(`ALTER TABLE questions ADD COLUMN ${colName} TEXT`).run();
        console.log(`✓ Added ${colName}`);
      } catch (error) {
        console.error(`✗ Failed to add ${colName}:`, error.message);
      }
    }
  }
  
  // If role exists and is required, we need to handle it in inserts
  // For now, let's check if we can make it nullable by recreating the table
  // But that's complex, so let's just ensure we handle it in the code
  
  db.close();
  console.log("\n✓ Database check completed!");
  console.log("\n⚠️  If 'role' column still exists and causes issues, you may need to:");
  console.log("   1. Drop and recreate the questions table (will lose data), OR");
  console.log("   2. Update the insert to include an empty role value");
  
} catch (error) {
  console.error("\n✗ Error:", error.message);
  process.exit(1);
}