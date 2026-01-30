"use client";

import { useState, useEffect } from "react";
import {
  getInterviewDetailOptionsForAdmin,
  addInterviewDetailOption,
  removeInterviewDetailOption,
  type InterviewDetailType,
} from "@/app/actions/interview-details";

function OptionList({
  type,
  title,
}: {
  type: InterviewDetailType;
  title: string;
}) {
  const [items, setItems] = useState<{ id: string; value: string }[]>([]);
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const res = await getInterviewDetailOptionsForAdmin(type);
    if (res.success && res.data) setItems(res.data);
    else setError(res.error || "Failed to load");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [type]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = newValue.trim();
    if (!val) return;
    setAdding(true);
    setError(null);
    const res = await addInterviewDetailOption(type, val);
    if (res.success) {
      setNewValue("");
      await load();
    } else {
      setError(res.error || "Failed to add");
    }
    setAdding(false);
  };

  const handleRemove = async (id: string) => {
    setError(null);
    const res = await removeInterviewDetailOption(id);
    if (res.success) await load();
    else setError(res.error || "Failed to remove");
  };

  return (
    <div className="rounded-lg border border-[#334155] bg-[#1e293b] p-4">
      <h3 className="text-sm font-semibold text-[#f1f5f9] mb-3">{title}</h3>
      {error && (
        <p className="text-sm text-red-400 mb-2" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="text-sm text-[#94a3b8]">Loading...</p>
      ) : (
        <>
          <ul className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {items.length === 0 ? (
              <li className="text-sm text-[#64748b]">No items yet. Add below to show in the submit form.</li>
            ) : (
              items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-2 py-1.5 px-2 rounded bg-[#0f172a] text-sm text-[#f1f5f9]"
                >
                  <span>{item.value}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="text-[#94a3b8] hover:text-red-400 text-xs font-medium"
                  >
                    Remove
                  </button>
                </li>
              ))
            )}
          </ul>
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={type === "company" ? "e.g. Google" : "e.g. React"}
              className="flex-1 rounded-md bg-[#0f172a] border border-[#334155] px-3 py-2 text-sm text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
            />
            <button
              type="submit"
              disabled={adding || !newValue.trim()}
              className="rounded-md bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adding ? "Adding..." : "Add"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export function InterviewDetailsAdmin() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#f1f5f9] mb-1">Interview Details</h2>
        <p className="text-sm text-[#94a3b8]">
          Manage companies and technologies shown in the submit form. Submitters can still choose &quot;Other&quot; for company.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <OptionList type="company" title="Companies" />
        <OptionList type="technology" title="Technologies" />
      </div>
    </div>
  );
}
