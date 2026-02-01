"use client";

import type { FeedbackRow } from "@/app/actions/feedback";

const CATEGORY_LABELS: Record<string, string> = {
  bug: "🐛 Bug",
  feature: "💡 Feature",
  question: "❓ Question",
  general: "💬 General",
};

function formatDate(d: Date | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function FeedbackListAdmin({ feedback }: { feedback: FeedbackRow[] }) {
  if (feedback.length === 0) {
    return (
      <div className="rounded-lg border border-[#334155] bg-[#1e293b] p-8 text-center">
        <p className="text-sm text-[#94a3b8]">No feedback yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#334155] bg-[#1e293b] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#334155] bg-[#0f172a]/50">
              <th className="text-left px-4 py-3 text-[#94a3b8] font-medium">Date</th>
              <th className="text-left px-4 py-3 text-[#94a3b8] font-medium">Category</th>
              <th className="text-left px-4 py-3 text-[#94a3b8] font-medium">Content</th>
              <th className="text-left px-4 py-3 text-[#94a3b8] font-medium">Email</th>
              <th className="text-left px-4 py-3 text-[#94a3b8] font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((row) => {
              let metaObj: Record<string, unknown> | null = null;
              try {
                metaObj = row.meta ? (JSON.parse(row.meta) as Record<string, unknown>) : null;
              } catch {
                // ignore
              }
              return (
                <tr key={row.id} className="border-b border-[#334155] hover:bg-[#0f172a]/30">
                  <td className="px-4 py-3 text-[#cbd5e1] whitespace-nowrap">
                    {formatDate(row.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-[#f1f5f9]">
                    {CATEGORY_LABELS[row.category] ?? row.category}
                  </td>
                  <td className="px-4 py-3 text-[#cbd5e1] max-w-md">
                    <span className="line-clamp-3">{row.content}</span>
                  </td>
                  <td className="px-4 py-3 text-[#94a3b8]">
                    {row.email ? (
                      <a
                        href={`mailto:${row.email}`}
                        className="text-[#3b82f6] hover:underline"
                      >
                        {row.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#94a3b8] text-xs">
                    {metaObj && Object.keys(metaObj).length > 0 ? (
                      <details className="cursor-pointer">
                        <summary>View</summary>
                        <pre className="mt-1 p-2 rounded bg-[#0f172a] overflow-x-auto text-[10px]">
                          {JSON.stringify(metaObj, null, 2)}
                        </pre>
                      </details>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
