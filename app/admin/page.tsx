import Link from "next/link";
import { redirect } from "next/navigation";
import { ModerationDashboard } from "@/components/ModerationDashboard";
import { InterviewDetailsAdmin } from "@/components/InterviewDetailsAdmin";
import { getAllQuestionsForAdmin } from "@/app/actions/questions";
import { auth } from "@/lib/auth";

// Force dynamic rendering - no caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Admin emails - add your admin email addresses here
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);

function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  // If no admin emails configured, deny all access for security
  if (ADMIN_EMAILS.length === 0) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export default async function AdminPage() {
  const session = await auth();
  
  // Debug: Log session status
  console.log("[Admin] Session check:", { 
    hasSession: !!session, 
    hasUser: !!session?.user,
    userEmail: session?.user?.email || "none"
  });

  // Check if user is logged in
  if (!session?.user) {
    console.log("[Admin] No session - redirecting to signin");
    redirect("/auth/signin?callbackUrl=/admin");
  }

  // Check if user is an admin
  if (!isAdmin(session.user.email)) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#f1f5f9] mb-2">Access Denied</h1>
          <p className="text-[#94a3b8] mb-4">You don't have permission to access the admin dashboard.</p>
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4 mb-6 text-left">
            <p className="text-xs text-[#64748b] mb-1">Signed in as:</p>
            <p className="text-sm text-[#f1f5f9] font-mono break-all">{session.user.email}</p>
            <p className="text-xs text-[#64748b] mt-3">Make sure this email is in your ADMIN_EMAILS environment variable, then restart the server.</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#3b82f6] text-white rounded-md hover:bg-[#2563eb] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const result = await getAllQuestionsForAdmin();
  const questions = result.success && result.data ? result.data : [];

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 border-b border-[#334155] bg-[#0f172a]">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-[#3b82f6] text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-[#f1f5f9]">AskTaaza</span>
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#94a3b8]">{session.user.email}</span>
              <span className="px-3 py-1 rounded bg-[#dc2626]/20 text-[#f87171] text-xs font-medium">
                Admin
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-6 space-y-10">
        <section>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#f1f5f9]">Moderation Dashboard</h1>
            <p className="mt-1 text-sm text-[#94a3b8]">
              Review and moderate submitted interview questions ({questions.length} total)
            </p>
          </div>
          <ModerationDashboard questions={questions} />
        </section>

        <section className="pt-8 border-t border-[#334155]">
          <InterviewDetailsAdmin />
        </section>
      </div>
    </div>
  );
}