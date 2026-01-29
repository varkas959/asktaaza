# Setup Guide - Google OAuth Configuration

## The Error You're Seeing

If you're getting a "Server error" when clicking "Sign in with Google", it's because the required environment variables are missing.

## Quick Fix

1. **Create a `.env.local` file** in the root directory (same level as `package.json`)

2. **Add the following variables:**

```env
# Database
DATABASE_URL=./sqlite.db

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Google Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

3. **Generate a secret key:**
   - Run: `openssl rand -base64 32`
   - Copy the output and use it as `NEXTAUTH_SECRET`

4. **Get Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Authorized redirect URIs: `http://localhost:3001/api/auth/callback/google`
   - Copy the Client ID and Client Secret to your `.env.local` file

5. **Get Google Analytics Measurement ID (Optional):**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new GA4 property or use an existing one
   - Go to Admin → Data Streams → Web
   - Copy the Measurement ID (format: `G-XXXXXXXXXX`)
   - Add it to `.env.local` as `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - Analytics will automatically track page views, question views, submissions, filter usage, and share actions

6. **Restart the dev server** after creating `.env.local`

## Verify Setup

Run this command to check if all variables are set:
```bash
node scripts/check-env.js
```

## Common Issues

- **Port mismatch**: Make sure `NEXTAUTH_URL` matches your dev server port (3001 in this case)
- **Missing redirect URI**: The Google OAuth redirect URI must exactly match: `http://localhost:3001/api/auth/callback/google`
- **Wrong credentials**: Double-check that you copied the Client ID and Secret correctly
- **Server not restarted**: After creating `.env.local`, you must restart the dev server