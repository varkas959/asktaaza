# AskTaaza - Interview Questions Platform

A credibility-first platform for crowd-reported interview questions optimized for freshness and signal quality.

## Features

- **Question Submission**: Submit interview questions with comprehensive metadata (company, role, difficulty, tags, etc.)
- **Google Authentication**: Required authentication via Google OAuth for question submissions
- **Freshness-Based Ranking**: Questions are ranked using exponential decay algorithm prioritizing recent submissions
- **Advanced Filtering**: Filter questions by company, role, difficulty, round type, and search terms
- **Clean UI**: Minimal, modern interface built with Tailwind CSS

## Tech Stack

- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Drizzle ORM**: Type-safe database queries
- **SQLite**: Lightweight database (easily upgradeable to PostgreSQL)
- **NextAuth.js v5**: Authentication with Google OAuth
- **Tailwind CSS**: Utility-first CSS framework
- **Zod**: Runtime validation

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Google OAuth credentials (for authentication)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd asktaaza
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
# Database
DATABASE_URL=./sqlite.db

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-in-production

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. Set up the database:
```bash
npm run db:push
```

5. Generate NextAuth secret (optional):
```bash
openssl rand -base64 32
```

6. Get Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI

7. Run the development server:
```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Management

- Generate migrations: `npm run db:generate`
- Push schema changes: `npm run db:push`
- Open Drizzle Studio: `npm run db:studio`

## Project Structure

```
/
├── app/
│   ├── actions/          # Server actions
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── questions/        # Question detail pages
│   ├── submit/           # Question submission page
│   └── page.tsx          # Home page
├── components/           # React components
├── lib/                  # Utility functions
│   ├── auth.ts          # NextAuth configuration
│   ├── db.ts            # Database client
│   ├── schema.ts        # Database schema
│   ├── ranking.ts       # Ranking algorithm
│   └── validation.ts    # Zod schemas
└── types/               # TypeScript types
```

## Ranking Algorithm

Questions are ranked using a freshness-based algorithm:

- **Freshness Score**: `e^(-days_old / 30)` (exponential decay over 30 days)
- **Quality Multiplier**: Questions with complete metadata get a 1.1x boost
- **Final Score**: `freshness * quality_multiplier`

Most recent questions appear first, with slight preference for well-documented submissions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT