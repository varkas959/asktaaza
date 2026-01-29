import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#334155] bg-[#0f172a] mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#f1f5f9]">AskTaaza</span>
            <span className="text-[#64748b]">·</span>
            <span className="text-xs text-[#94a3b8]">Interview Questions</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-sm text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
            >
              Terms & Conditions
            </Link>
          </nav>
        </div>
        <p className="mt-4 text-center sm:text-left text-xs text-[#64748b]">
          © {new Date().getFullYear()} AskTaaza. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
