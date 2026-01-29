"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { deleteQuestion, flagQuestion, approveQuestion } from "@/app/actions/questions";
import type { FilterTab } from "./ModerationDashboard";
import type { Question } from "@/types";

interface ModerationTableProps {
  filter: FilterTab;
  questions: Question[];
}

export function ModerationTable({ filter, questions }: ModerationTableProps) {
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);

  // Filter questions based on active tab
  const filteredQuestions = questions.filter((q) => {
    switch (filter) {
      case "all":
        return true;
      case "active":
        return !q.isFlagged;
      case "flagged":
        return q.isFlagged;
      default:
        return true;
    }
  });

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === filteredQuestions.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredQuestions.map((q) => q.id)));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    
    setLoading(id);
    const result = await deleteQuestion(id);
    setLoading(null);
    
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Failed to delete question");
    }
  };

  const handleFlag = async (id: string) => {
    setLoading(id);
    const result = await flagQuestion(id);
    setLoading(null);
    
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Failed to flag question");
    }
  };

  const handleApprove = async (id: string) => {
    setLoading(id);
    const result = await approveQuestion(id);
    setLoading(null);
    
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Failed to approve question");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedRows.size} questions?`)) return;
    
    setLoading("bulk");
    for (const id of selectedRows) {
      await deleteQuestion(id);
    }
    setLoading(null);
    setSelectedRows(new Set());
    router.refresh();
  };

  const handleBulkFlag = async () => {
    setLoading("bulk");
    for (const id of selectedRows) {
      await flagQuestion(id);
    }
    setLoading(null);
    setSelectedRows(new Set());
    router.refresh();
  };

  const handleBulkApprove = async () => {
    setLoading("bulk");
    for (const id of selectedRows) {
      await approveQuestion(id);
    }
    setLoading(null);
    setSelectedRows(new Set());
    router.refresh();
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[#334155]">
        <thead className="bg-[#0f172a]">
          <tr>
            <th scope="col" className="w-12 px-6 py-3">
              <input
                type="checkbox"
                checked={
                  filteredQuestions.length > 0 &&
                  selectedRows.size === filteredQuestions.length
                }
                onChange={handleSelectAll}
                className="h-4 w-4 rounded border-[#475569] bg-[#1e293b] text-[#3b82f6] focus:ring-[#3b82f6]"
              />
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#94a3b8]"
            >
              Question
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#94a3b8]"
            >
              Company
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#94a3b8]"
            >
              Skill
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#94a3b8]"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#94a3b8]"
            >
              Posted
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#94a3b8]"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#334155] bg-[#1e293b]">
          {filteredQuestions.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-sm text-[#94a3b8]">
                No questions found.
              </td>
            </tr>
          ) : (
            filteredQuestions.map((question) => (
              <tr
                key={question.id}
                className={`hover:bg-[#334155]/50 ${
                  selectedRows.has(question.id) ? "bg-[#3b82f6]/10" : ""
                } ${loading === question.id ? "opacity-50" : ""}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(question.id)}
                    onChange={() => handleSelectRow(question.id)}
                    className="h-4 w-4 rounded border-[#475569] bg-[#1e293b] text-[#3b82f6] focus:ring-[#3b82f6]"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    <p className="text-sm text-[#f1f5f9] line-clamp-2">
                      {question.content}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-[#f1f5f9]">{question.company}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-[#94a3b8]">{question.skill || "—"}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {question.isFlagged ? (
                    <span className="inline-flex items-center rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs font-medium text-red-400">
                      Flagged
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#94a3b8]">
                  {question.createdAt
                    ? formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })
                    : "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {question.isFlagged ? (
                      <button
                        onClick={() => handleApprove(question.id)}
                        disabled={loading === question.id}
                        className="text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
                        title="Approve (Unflag)"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFlag(question.id)}
                        disabled={loading === question.id}
                        className="text-yellow-400 hover:text-yellow-300 disabled:opacity-50"
                        title="Flag"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                          />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(question.id)}
                      disabled={loading === question.id}
                      className="text-red-400 hover:text-red-300 disabled:opacity-50"
                      title="Delete"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Bulk Actions Bar */}
      {selectedRows.size > 0 && (
        <div className="border-t border-[#334155] bg-[#0f172a] px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#94a3b8]">
              {selectedRows.size} question{selectedRows.size > 1 ? "s" : ""} selected
            </span>
            <div className="flex gap-2">
              <button 
                onClick={handleBulkApprove}
                disabled={loading === "bulk"}
                className="rounded-md border border-[#334155] bg-[#1e293b] px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-[#334155] disabled:opacity-50"
              >
                Approve All
              </button>
              <button 
                onClick={handleBulkFlag}
                disabled={loading === "bulk"}
                className="rounded-md border border-[#334155] bg-[#1e293b] px-4 py-2 text-sm font-medium text-yellow-400 hover:bg-[#334155] disabled:opacity-50"
              >
                Flag All
              </button>
              <button 
                onClick={handleBulkDelete}
                disabled={loading === "bulk"}
                className="rounded-md border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 disabled:opacity-50"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
