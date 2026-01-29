# Vercel deployment & why production can look different

## 1. Environment variables (required on Vercel)

In **Vercel → Your project → Settings → Environment Variables**, set:

| Variable | Value | Notes |
|----------|--------|--------|
| `TURSO_DATABASE_URL` | `libsql://your-db-xxx.turso.io` | From `turso db show asktaaza --url` |
| `TURSO_AUTH_TOKEN` | Your Turso token | From `turso db tokens create asktaaza` |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | Your live URL (e.g. `https://asktaaza.com`) |
| `NEXTAUTH_SECRET` | Same as local | e.g. from `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Same as local | |
| `GOOGLE_CLIENT_SECRET` | Same as local | |
| `ADMIN_EMAILS` | Your admin email | e.g. `you@example.com` |

**Google OAuth:** In Google Cloud Console, add this redirect URI for production:
`https://your-domain.vercel.app/api/auth/callback/google`

If `TURSO_DATABASE_URL` or `TURSO_AUTH_TOKEN` is missing, the app will throw a clear error in production.

---

## 2. Schema vs data: why production can be “empty”

- **`npm run db:push`** only creates/updates **tables** in Turso. It does **not** copy rows from your old SQLite file.
- So:
  - **Local:** You were using `file:./sqlite.db` and had data (e.g. one question).
  - **Turso:** After `db:push`, Turso has the same **schema** but **no rows** unless you copied them.

So production (using Turso) can look “totally different” and show no questions because the Turso database is empty.

---

## 3. Copying existing data from local SQLite to Turso

If you still have your old `sqlite.db` with the one question (and any users/sessions you care about), use the included script:

1. **In `.env.local`** set:
   - `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` (your Turso DB).
   - Optionally `DATABASE_URL=./sqlite.db` if your file is elsewhere.

2. **Ensure Turso has the schema** (you already did this with `npm run db:push`).

3. **Run the copy script once** (from project root):
   ```bash
   npm run db:copy-to-turso
   ```
   This copies `users`, `accounts`, `sessions`, and `questions` from `sqlite.db` into Turso.

4. **Redeploy** (or rely on the same Turso DB). Production will then show that data.

---

## 4. Build and runtime

- **Build:** If the build fails on Vercel, check the build log. Common causes: missing env at build time, TypeScript errors, or Node version mismatch.
- **Runtime:** If the build succeeds but the app errors or shows empty data, check:
  1. Env vars above are set for the **Production** environment in Vercel.
  2. Turso has the schema (`db:push` was run against Turso).
  3. Turso has data if you expect to see questions (see section 3).

---

## 5. Quick checklist

- [ ] All env vars above set in Vercel (Production).
- [ ] `db:push` run against Turso (so schema exists).
- [ ] If you had data locally, data copied into Turso (section 3).
- [ ] Google OAuth redirect URI includes your production URL.
- [ ] Redeploy after changing env vars.
