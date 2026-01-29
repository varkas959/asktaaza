import Link from "next/link";
import { getTopCompanies } from "@/app/actions/questions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Companies | AskTaaza",
  description: "Explore interview questions from top companies. See which companies have the most interview experiences shared.",
};

export default async function CompaniesPage() {
  const result = await getTopCompanies();
  const companies = result.success && result.data ? result.data : [];

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
          <h1 className="text-2xl font-bold text-[#f1f5f9] mb-2">Top Companies</h1>
          <p className="text-[#94a3b8]">
            Browse interview questions organized by company. Click on a company to see all their interview questions.
          </p>
        </div>

        {companies.length === 0 ? (
          <div className="rounded-lg bg-[#1e293b] border border-[#334155] p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-[#64748b] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-[#94a3b8] mb-4">No companies with questions yet.</p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#3b82f6] text-white rounded-md hover:bg-[#2563eb] transition-colors"
            >
              Be the first to submit a question
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company, index) => (
              <Link
                key={index}
                href={`/?company=${encodeURIComponent(company.name)}`}
                className="rounded-lg bg-[#1e293b] border border-[#334155] p-5 hover:border-[#475569] hover:shadow-lg hover:shadow-[#3b82f6]/5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#3b82f6] flex-shrink-0">
                    <span className="text-lg font-bold text-white">{company.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-[#f1f5f9] group-hover:text-[#3b82f6] transition-colors truncate">
                      {company.name}
                    </h3>
                    <p className="text-sm text-[#94a3b8]">
                      {company.discussions} {company.discussions === 1 ? "question" : "questions"}
                    </p>
                  </div>
                  <svg className="h-5 w-5 text-[#64748b] group-hover:text-[#3b82f6] transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
