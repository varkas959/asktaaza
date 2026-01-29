"use client";

import { useState, FormEvent, useEffect } from "react";
import { createQuestion } from "@/app/actions/questions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { QuestionSubmission } from "@/lib/validation";
import { checkSubmissionLimits, recordSubmission, checkDuplicate, isValidQuestion } from "@/lib/submission-limits";
import { ContributorImpact } from "./ContributorImpact";
import { questionSubmit } from "@/lib/analytics";

export function QuestionForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedCount, setSubmittedCount] = useState(0);
  const [companyOther, setCompanyOther] = useState("");
  const [questions, setQuestions] = useState([{ id: 1, content: "", charCount: 0 }]);
  const [activeTab, setActiveTab] = useState<"question" | "details">("question");
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [pendingQuestions, setPendingQuestions] = useState<typeof questions | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState<Partial<QuestionSubmission>>({
    company: "",
    skill: "",
    category: "",
    whenAsked: "Last 7 days",
    experienceLevel: undefined,
    round: undefined,
    source: "direct",
  });

  const companies = ["TCS", "Infosys", "Wipro", "HCL", "CTS", "Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix"];

  const updateQuestion = (id: number, content: string) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, content, charCount: content.length } : q
    ));
    // Clear rate limit error when user types
    if (rateLimitError) {
      setRateLimitError(null);
    }
  };

  // Check rate limits on mount and when questions change
  useEffect(() => {
    const limits = checkSubmissionLimits();
    if (!limits.canSubmit && limits.reason) {
      setRateLimitError(limits.reason);
    } else {
      setRateLimitError(null);
    }
  }, [questions]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setRateLimitError(null);
    setIsSubmitting(true);

    try {
      // Check rate limits
      const limits = checkSubmissionLimits();
      if (!limits.canSubmit) {
        setRateLimitError(limits.reason || "Submission limit reached. Please try again later.");
        setIsSubmitting(false);
        return;
      }

      // Validate that at least one question is filled and meaningful
      const validQuestions = questions.filter(q => {
        const trimmed = q.content.trim();
        return trimmed.length >= 10 && isValidQuestion(trimmed);
      });
      
      if (validQuestions.length === 0) {
        const firstQuestion = questions[0]?.content.trim() || "";
        if (firstQuestion.length < 15) {
          setErrors({ general: "Please provide a meaningful question (at least 15 characters)." });
        } else if (!isValidQuestion(firstQuestion)) {
          setErrors({ general: "Please provide a valid question. Avoid repetitive characters or very short text." });
        } else {
          setErrors({ general: "Please add at least one question with at least 10 characters." });
        }
        setIsSubmitting(false);
        return;
      }

      if (!agreedToTerms) {
        setErrors({ general: "Please agree to our Terms and Conditions and Privacy Policy to submit." });
        setIsSubmitting(false);
        return;
      }

      // Validate required fields before duplicate check
      if (!formData.company || formData.company === "") {
        setErrors({ general: "Please select or enter a company name." });
        setIsSubmitting(false);
        return;
      }

      if (formData.company === "Other" && (!companyOther || companyOther.trim() === "")) {
        setErrors({ general: "Please enter a company name." });
        setIsSubmitting(false);
        return;
      }

      // Check for duplicates
      const firstQuestion = validQuestions[0].content;
      if (checkDuplicate(firstQuestion)) {
        setPendingQuestions(validQuestions);
        setShowDuplicateDialog(true);
        setIsSubmitting(false);
        return;
      }

      await proceedWithSubmission(validQuestions);
    } catch (error) {
      console.error("Submit error:", error);
      setErrors({ general: "An unexpected error occurred. Please try again." });
      setIsSubmitting(false);
    }
  };

  const proceedWithSubmission = async (validQuestions: typeof questions) => {
    setIsSubmitting(true);
    setShowDuplicateDialog(false);

    try {

      // Convert whenAsked to actual date
      let interviewDate = new Date();
      if (formData.whenAsked === "Last 7 days") {
        interviewDate.setDate(interviewDate.getDate() - 7);
      } else if (formData.whenAsked === "Last 30 days") {
        interviewDate.setDate(interviewDate.getDate() - 30);
      } else if (formData.whenAsked === "Last 90 days") {
        interviewDate.setDate(interviewDate.getDate() - 90);
      }

      // Use custom company name if "Other" is selected
      const companyName = formData.company === "Other" ? companyOther : formData.company;

      // Submit all questions
      let successCount = 0;
      let firstError: { general: string; fields?: Record<string, string> } | null = null;
      
      for (const question of validQuestions) {
        const { whenAsked, ...submitData } = formData;
        
        const result = await createQuestion({
          ...submitData,
          content: question.content,
          company: companyName,
          interviewDate,
        });

        if (result.success) {
          successCount++;
          // Record successful submission for rate limiting
          recordSubmission(question.content);
        } else {
          const fieldErrors: Record<string, string> = {};
          if (result.details) {
            result.details.forEach((error: any) => {
              const field = error.path && error.path.length > 0 
                ? error.path.map((p: any) => String(p)).join(".")
                : "general";
              fieldErrors[field] = error.message;
            });
          }
          
          // Build a detailed error message
          const errorMessages = Object.values(fieldErrors);
          const detailedError = errorMessages.length > 0 
            ? `${result.error}: ${errorMessages.join(", ")}`
            : result.error;
          
          firstError = {
            general: detailedError || "Failed to submit questions. Please try again.",
            fields: fieldErrors,
          };
          break; // stop on first failure so user can fix and resubmit
        }
      }

      if (successCount > 0) {
        setShowSuccess(true);
        setSubmittedCount(submittedCount + successCount);
        
        // Track submission in analytics
        questionSubmit(successCount, formData.company || undefined);
        
        // Reset form but keep some fields
        setQuestions([{ id: 1, content: "", charCount: 0 }]);
        setFormData({
          company: formData.company,
          skill: formData.skill,
          category: "",
          whenAsked: formData.whenAsked,
          experienceLevel: formData.experienceLevel,
          round: formData.round,
          source: formData.source,
        });
        setCompanyOther("");
        setErrors({});
        
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (firstError) {
        setErrors({ 
          general: firstError.general || "Failed to submit questions. Please try again.", 
          ...(firstError.fields || {})
        });
      } else {
        setErrors({ general: "Failed to submit questions. Please try again." });
      }
    } catch (error) {
      console.error("Submit error:", error);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAnother = () => {
    setShowSuccess(false);
    setSubmittedCount(0);
    setQuestions([{ id: 1, content: "", charCount: 0 }]);
    setFormData({
      company: formData.company,
      skill: formData.skill,
      category: "",
      whenAsked: formData.whenAsked,
      experienceLevel: formData.experienceLevel,
      round: formData.round,
      source: formData.source,
    });
    setCompanyOther("");
    setErrors({});
  };

  const experienceLevels = ["0-2 years", "3-4 years", "4-6 years", "6-8 years", "8+ years"];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Message with Actions */}
      {showSuccess && (
        <div className="space-y-4">
          <div className="rounded-lg bg-green-500/20 border border-green-500/30 p-6">
            <div className="mb-4">
              <p className="text-base font-medium text-green-400 mb-2">
                Question submitted successfully. Thanks for helping others prepare.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="flex-1 rounded-md border border-green-500/50 bg-[#1e293b] px-4 py-2.5 text-center text-sm font-medium text-green-400 hover:bg-green-500/10 transition-colors"
              >
                View Recent Questions
              </Link>
              <button
                type="button"
                onClick={handleSubmitAnother}
                className="flex-1 rounded-md bg-green-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-600 transition-colors"
              >
                Submit Another Question
              </button>
            </div>
          </div>
          
          {/* Contributor Impact Message */}
          <ContributorImpact questionCount={submittedCount} />
        </div>
      )}

      {errors.general && (
        <div className="rounded-md bg-red-500/20 border border-red-500/30 p-4 text-sm text-red-400">
          {errors.general}
        </div>
      )}

      {rateLimitError && (
        <div className="rounded-md bg-yellow-500/20 border border-yellow-500/30 p-4 text-sm text-yellow-400">
          <div className="flex items-start gap-2">
            <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{rateLimitError}</span>
          </div>
        </div>
      )}

      {/* Duplicate Detection Dialog */}
      {showDuplicateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-[#f1f5f9] mb-2">Similar Question Detected</h3>
            <p className="text-sm text-[#94a3b8] mb-4">
              We found a similar question in your recent submissions. Are you sure you want to submit this again?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDuplicateDialog(false);
                  setPendingQuestions(null);
                }}
                className="flex-1 rounded-md border border-[#334155] bg-[#0f172a] px-4 py-2 text-sm font-medium text-[#f1f5f9] hover:bg-[#1e293b]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (pendingQuestions) {
                    setShowDuplicateDialog(false);
                    await proceedWithSubmission(pendingQuestions);
                    setPendingQuestions(null);
                  }
                }}
                className="flex-1 rounded-md bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563eb]"
              >
                Submit Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-[#334155] pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("question")}
          className={`pb-2 text-sm font-semibold ${activeTab === "question" ? "border-b-2 border-[#3b82f6] text-[#3b82f6]" : "text-[#94a3b8] hover:text-[#f1f5f9]"}`}
        >
          Question
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("details")}
          className={`pb-2 text-sm font-semibold ${activeTab === "details" ? "border-b-2 border-[#3b82f6] text-[#3b82f6]" : "text-[#94a3b8] hover:text-[#f1f5f9]"}`}
        >
          Interview Details
        </button>
      </div>

      {/* Question Section */}
      {activeTab === "question" && (
        <div className="space-y-4">
          <div>
            <label htmlFor="question-1" className="mb-2 block text-sm font-semibold text-[#f1f5f9]">
              Questions Asked *
            </label>
            {questions.map((question) => (
              <div key={question.id}>
                <textarea
                  id={`question-${question.id}`}
                  rows={8}
                  required
                  value={question.content}
                  onChange={(e) => updateQuestion(question.id, e.target.value)}
                  className="w-full rounded-lg bg-[#0f172a] border border-[#334155] px-4 py-3 text-base text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] transition-colors"
                  placeholder="Paste the technical questions, coding problems, or system design scenarios you encountered..."
                />
              </div>
            ))}
          </div>

          {/* Terms agreement */}
          <label className="flex items-start gap-3 cursor-pointer mt-4">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-[#334155] bg-[#0f172a] text-[#3b82f6] focus:ring-[#3b82f6]"
            />
            <span className="text-sm text-[#94a3b8]">
              I agree to the{" "}
              <Link href="/terms" target="_blank" className="text-[#3b82f6] hover:underline">
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" target="_blank" className="text-[#3b82f6] hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          {/* Buttons right after questions */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-full border border-[#334155] bg-[#1e293b] px-5 py-2 text-sm font-medium text-[#f1f5f9] hover:bg-[#334155] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting || 
                !agreedToTerms ||
                !questions[0]?.content.trim() || 
                !isValidQuestion(questions[0]?.content || "") || 
                !!rateLimitError ||
                showDuplicateDialog
              }
              className="rounded-full bg-[#3b82f6] px-5 py-2 text-sm font-semibold text-white hover:bg-[#2563eb] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}

      {/* Interview Details (tab content) */}
      {activeTab === "details" && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="company" className="mb-2 block text-sm font-medium text-[#f1f5f9]">
                Company Name
              </label>
              <div className="relative">
                <select
                  id="company"
                  required
                  value={formData.company || ""}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full rounded-lg bg-[#0f172a] border border-[#334155] px-4 py-2.5 pl-11 text-sm text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] appearance-none"
                >
                  <option value="">e.g. Google, Meta</option>
                  {companies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94a3b8] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <svg className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {formData.company === "Other" && (
                <input
                  type="text"
                  required
                  value={companyOther}
                  onChange={(e) => setCompanyOther(e.target.value)}
                  placeholder="Enter company name"
                  className="mt-2 w-full rounded-lg bg-[#0f172a] border border-[#334155] px-4 py-2.5 text-sm text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                />
              )}
              {errors.company && (
                <p className="mt-1 text-sm text-red-400">{errors.company}</p>
              )}
            </div>

            <div>
              <label htmlFor="interviewDate" className="mb-2 block text-sm font-medium text-[#f1f5f9]">
                Interview Date
              </label>
              <div className="relative">
                <select
                  id="interviewDate"
                  value={formData.whenAsked || "Last 7 days"}
                  onChange={(e) => setFormData({ ...formData, whenAsked: e.target.value as any })}
                  className="w-full rounded-lg bg-[#0f172a] border border-[#334155] px-4 py-2.5 pl-11 text-sm text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] appearance-none"
                >
                  <option value="Last 7 days">Select timeframe</option>
                  <option value="Last 7 days">Last 7 days</option>
                  <option value="Last 30 days">Last 30 days</option>
                  <option value="Last 90 days">Last 90 days</option>
                </select>
                <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94a3b8] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <svg className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="jobTitle" className="mb-2 block text-sm font-medium text-[#f1f5f9]">
                Job Title/Role
              </label>
              <input
                id="jobTitle"
                type="text"
                value={formData.experienceLevel || ""}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as any })}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full rounded-lg bg-[#0f172a] border border-[#334155] px-4 py-2.5 text-sm text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
              />
            </div>

            <div>
              <label htmlFor="yearsExperience" className="mb-2 block text-sm font-medium text-[#f1f5f9]">
                Years of Experience
              </label>
              <div className="relative">
                <select
                  id="yearsExperience"
                  value={formData.experienceLevel || ""}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as any })}
                  className="w-full rounded-lg bg-[#0f172a] border border-[#334155] px-4 py-2.5 pl-11 pr-10 text-sm text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] appearance-none"
                >
                  <option value="">Your experience at time of interview</option>
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94a3b8] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <svg className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.experienceLevel && (
                <p className="mt-1 text-sm text-red-400">{errors.experienceLevel}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="technology" className="mb-2 block text-sm font-medium text-[#f1f5f9]">
              Technology
            </label>
            <div className="relative">
              <select
                id="technology"
                value={formData.skill || ""}
                onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                className="w-full rounded-lg bg-[#0f172a] border border-[#334155] px-4 py-2.5 pr-10 text-sm text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] appearance-none"
              >
                <option value="">Select technology</option>
                <option value="Java">Java</option>
                <option value="React">React</option>
                <option value="Selenium">Selenium</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Node.js">Node.js</option>
                <option value="System Design">System Design</option>
                <option value="Algorithms">Algorithms</option>
                <option value="Data Structures">Data Structures</option>
              </select>
              <svg className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

        </div>
      )}

      {/* Terms agreement + Submit Button for Details tab */}
      {activeTab === "details" && (
        <>
          <label className="flex items-start gap-3 cursor-pointer mt-6 pt-4 border-t border-[#334155]">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-[#334155] bg-[#0f172a] text-[#3b82f6] focus:ring-[#3b82f6]"
            />
            <span className="text-sm text-[#94a3b8]">
              I agree to the{" "}
              <Link href="/terms" target="_blank" className="text-[#3b82f6] hover:underline">
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" target="_blank" className="text-[#3b82f6] hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-full border border-[#334155] bg-[#1e293b] px-5 py-2 text-sm font-medium text-[#f1f5f9] hover:bg-[#334155] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting || 
                !agreedToTerms ||
                !questions[0]?.content.trim() || 
                !isValidQuestion(questions[0]?.content || "") || 
                !!rateLimitError ||
                showDuplicateDialog
              }
              className="rounded-full bg-[#3b82f6] px-5 py-2 text-sm font-semibold text-white hover:bg-[#2563eb] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}