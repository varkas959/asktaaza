import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const isProduction = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
const url = process.env.TURSO_DATABASE_URL || (!isProduction ? "file:./sqlite.db" : "");
const authToken = process.env.TURSO_AUTH_TOKEN;

if (isProduction && !url) {
  throw new Error(
    "TURSO_DATABASE_URL is required in production. Add it in Vercel → Project → Settings → Environment Variables."
  );
}

const client = createClient({
  url: url || "file:./sqlite.db",
  authToken: authToken || undefined,
});

export const db = drizzle(client, { schema });