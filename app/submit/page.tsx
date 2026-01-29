import { QuestionForm } from "@/components/QuestionForm";

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-semibold text-[#f1f5f9]">Submit Interview Experience</h1>
          <p className="text-base text-[#94a3b8]">
            Share your interview journey anonymously and help fellow professionals prepare.
          </p>
        </div>

        <div className="rounded-lg bg-[#1e293b] border border-[#334155] p-6 shadow-sm md:p-8">
          <QuestionForm />
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="rounded-lg bg-[#1e293b] border border-[#334155] p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-[#3b82f6]/20 flex items-center justify-center">
                  <svg className="h-6 w-6 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#f1f5f9] mb-1">Privacy First</h3>
                <p className="text-sm text-[#94a3b8]">
                  Submission is anonymous. Do not include personal names or specific internal project details.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-[#1e293b] border border-[#334155] p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-[#3b82f6]/20 flex items-center justify-center">
                  <svg className="h-6 w-6 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#f1f5f9] mb-1">Be Descriptive</h3>
                <p className="text-sm text-[#94a3b8]">
                  Include specific details about the technical challenges and round formats.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}