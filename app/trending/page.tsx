import Link from "next/link";
import { getTrendingTopics } from "@/app/actions/questions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trending Topics | AskTaaza",
  description: "Explore trending interview topics and technologies. See what skills and technologies are being asked about most in recent interviews.",
};

function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

export default async function TrendingPage() {
  const result = await getTrendingTopics();
  const topics = result.success && result.data ? result.data : [];

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 border-b border-[#334155] bg-[#0f172a] shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#3b82f6] text-white">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-[#f1f5f9]">AskTaaza</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#f1f5f9] mb-2">Trending Topics</h1>
          <p className="text-[#94a3b8]">
            Explore the most discussed interview topics and technologies this week.
          </p>
        </div>

        {topics.length === 0 ? (
          <div className="rounded-lg bg-[#1e293b] border border-[#334155] p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-[#64748b] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <p className="text-[#94a3b8] mb-4">No trending topics yet.</p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#3b82f6] text-white rounded-md hover:bg-[#2563eb] transition-colors"
            >
              Be the first to submit a question
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic, index) => (
              <Link
                key={index}
                href={`/?skill=${encodeURIComponent(topic.name)}`}
                className="rounded-lg bg-[#1e293b] border border-[#334155] p-5 hover:border-[#475569] hover:shadow-lg hover:shadow-[#3b82f6]/5 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3b82f6]/20">
                    <svg className="h-5 w-5 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <span className="text-xs text-[#64748b]">{topic.period || "all time"}</span>
                </div>
                <h3 className="text-lg font-semibold text-[#f1f5f9] mb-1 group-hover:text-[#3b82f6] transition-colors">
                  #{topic.name}
                </h3>
                <p className="text-sm text-[#94a3b8]">
                  {formatCount(topic.count)} {topic.count === 1 ? "question" : "questions"}
                </p>
              </Link>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
