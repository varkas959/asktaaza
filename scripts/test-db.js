const Database = require("better-sqlite3");
const path = require("path");

try {
  const dbPath = process.env.DATABASE_URL || "./sqlite.db";
  console.log(`Connecting to database at: ${dbPath}`);
  
  const db = new Database(dbPath);
  
  // Test query - get table names
  const tables = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `).all();
  
  console.log("\n✓ Database connection successful!");
  console.log(`\nFound ${tables.length} tables:`);
  tables.forEach(table => {
    console.log(`  - ${table.name}`);
    
    // Get row count for each table
    try {
      const count = db.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get();
      console.log(`    Rows: ${count.count}`);
    } catch (e) {
      console.log(`    (unable to count rows)`);
    }
  });
  
  // If questions table exists, show sample data
  if (tables.some(t => t.name === 'questions')) {
    const questions = db.prepare(`SELECT id, company, content, created_at FROM questions LIMIT 5`).all();
    if (questions.length > 0) {
      console.log(`\nSample questions (first ${questions.length}):`);
      questions.forEach((q, idx) => {
        console.log(`\n  ${idx + 1}. ${q.company}`);
        console.log(`     ${q.content.substring(0, 60)}...`);
        console.log(`     Created: ${new Date(q.created_at).toLocaleDateString()}`);
      });
    } else {
      console.log(`\nNo questions in database yet.`);
    }
  }
  
  db.close();
  console.log("\n✓ Database connection closed successfully!");
  
} catch (error) {
  console.error("\n✗ Database connection failed:");
  console.error(error.message);
  process.exit(1);
}