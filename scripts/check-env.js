// Load .env.local file
require('dotenv').config({ path: '.env.local' });

console.log("Checking environment variables for NextAuth...\n");

const required = [
  { name: "GOOGLE_CLIENT_ID", alt: "AUTH_GOOGLE_ID" },
  { name: "GOOGLE_CLIENT_SECRET", alt: "AUTH_GOOGLE_SECRET" },
  { name: "NEXTAUTH_SECRET", alt: "AUTH_SECRET" },
  { name: "NEXTAUTH_URL", alt: "AUTH_URL" },
];

let allGood = true;

required.forEach(({ name, alt }) => {
  const value = process.env[name] || process.env[alt];
  if (value) {
    console.log(`✓ ${name} or ${alt}: Set (${value.substring(0, 10)}...)`);
  } else {
    console.log(`✗ ${name} or ${alt}: MISSING`);
    allGood = false;
  }
});

if (!allGood) {
  console.log("\n⚠️  Missing required environment variables!");
  console.log("\nPlease create a .env.local file with:");
  console.log(`
DATABASE_URL=./sqlite.db
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
  `);
  process.exit(1);
} else {
  console.log("\n✓ All required environment variables are set!");
}