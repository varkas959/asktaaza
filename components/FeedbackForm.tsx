"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { submitFeedback, type FeedbackCategory, type SubmitFeedbackInput } from "@/app/actions/feedback";

const CATEGORIES: { id: FeedbackCategory; label: string; icon: string; description: string }[] = [
  { id: "bug", label: "Report a Bug", icon: "🐛", description: "Found something broken? Let us know!" },
  { id: "feature", label: "Suggest a Feature", icon: "💡", description: "Have an idea? We're all ears!" },
  { id: "question", label: "Ask a Question", icon: "❓", description: "Confused about something?" },
  { id: "general", label: "General Feedback", icon: "💬", description: "Tell us what you think!" },
];

const MAX_CONTENT = 5000;
const MAX_SHORT = 500;

function getDeviceInfo(): string {
  if (typeof window === "undefined") return "";
  const ua = navigator.userAgent;
  const platform = navigator.platform || "";
  return `${ua} | ${platform}`.slice(0, 500);
}

type FormState = {
  category: FeedbackCategory;
  // Bug
  whatWentWrong: string;
  stepsToReproduce: string;
  deviceBrowser: string;
  email: string;
  // Feature
  featureDescription: string;
  whyUseful: string;
  priority: "low" | "medium" | "high";
  // Question
  question: string;
  questionCategory: "technical" | "general" | "account";
  // General
  feedback: string;
  rating: number;
  // Spam
  honeypot: string;
  agreeTerms: boolean;
};

const DRAFT_KEY = "asktaaza-feedback-draft";

function loadDraft(): Partial<FormState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Partial<FormState>) : null;
  } catch {
    return null;
  }
}

function saveDraft(state: FormState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function clearDraft() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}

const initialFormState: FormState = {
  category: "general",
  whatWentWrong: "",
  stepsToReproduce: "",
  deviceBrowser: "",
  email: "",
  featureDescription: "",
  whyUseful: "",
  priority: "medium",
  question: "",
  questionCategory: "general",
  feedback: "",
  rating: 0,
  honeypot: "",
  agreeTerms: false,
};

export function FeedbackForm() {
  const [form, setForm] = useState<FormState>(() => {
    const draft = loadDraft();
    return draft ? { ...initialFormState, ...draft } : initialFormState;
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [deviceInfo, setDeviceInfo] = useState("");
  const [submittedWithEmail, setSubmittedWithEmail] = useState(false);

  useEffect(() => {
    setDeviceInfo(getDeviceInfo());
    if (!form.deviceBrowser && getDeviceInfo()) {
      setForm((prev) => ({ ...prev, deviceBrowser: getDeviceInfo() }));
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => saveDraft(form), 500);
    return () => clearTimeout(t);
  }, [form]);

  const update = useCallback((patch: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const getContentAndMeta = (): { content: string; meta: Record<string, unknown> } => {
    switch (form.category) {
      case "bug":
        return {
          content: form.whatWentWrong.trim(),
          meta: {
            stepsToReproduce: form.stepsToReproduce.trim(),
            deviceBrowser: form.deviceBrowser.trim() || deviceInfo,
          },
        };
      case "feature":
        return {
          content: form.featureDescription.trim(),
          meta: {
            whyUseful: form.whyUseful.trim(),
            priority: form.priority,
          },
        };
      case "question":
        return {
          content: form.question.trim(),
          meta: { questionCategory: form.questionCategory },
        };
      default:
        return {
          content: form.feedback.trim(),
          meta: form.rating ? { rating: form.rating } : {},
        };
    }
  };

  const validate = (): string | null => {
    if (!form.agreeTerms) return "Please agree to the Terms and Privacy Policy to submit.";
    const { content } = getContentAndMeta();
    if (!content || content.length < 10) return "Please provide at least 10 characters.";
    if (content.length > MAX_CONTENT) return `Please keep your message under ${MAX_CONTENT} characters.`;
    if (form.category === "question" && !form.email?.trim()) return "Email is required so we can respond to your question.";
    const email = form.email?.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setStatus("error");
      setErrorMessage(err);
      return;
    }
    setStatus("loading");
    setErrorMessage("");
    const { content, meta } = getContentAndMeta();
    const email = form.email?.trim() || undefined;
    const input: SubmitFeedbackInput = {
      category: form.category,
      content,
      meta: Object.keys(meta).length ? meta : undefined,
      email,
      deviceInfo: form.category === "bug" ? (form.deviceBrowser || deviceInfo) : deviceInfo,
      honeypot: form.honeypot,
    };
    const result = await submitFeedback(input);
    if (result.success) {
      setSubmittedWithEmail(!!email);
      setStatus("success");
      clearDraft();
      setForm(initialFormState);
    } else {
      setStatus("error");
      setErrorMessage(result.error || "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-xl border border-[#334155] bg-[#1e293b] p-6 md:p-8 text-center animate-[fadeIn_0.3s_ease-out]">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-xl font-semibold text-[#f1f5f9] mb-2">Feedback Received!</h3>
        <p className="text-[#cbd5e1] mb-4 max-w-md mx-auto">
          Thanks for taking the time to share your thoughts. We read every piece of feedback and use it to improve AskTaaza.
        </p>
        <p className="text-[#94a3b8] text-sm mb-6">
          {submittedWithEmail
            ? "We'll get back to you within 24–48 hours."
            : "Your feedback has been recorded anonymously."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => { setStatus("idle"); setSubmittedWithEmail(false); }}
            className="min-h-[44px] px-6 py-3 rounded-lg bg-[#3b82f6] text-white font-medium hover:bg-[#2563eb] transition-colors"
          >
            Submit Another
          </button>
          <Link
            href="/"
            className="min-h-[44px] px-6 py-3 rounded-lg border border-[#334155] text-[#f1f5f9] font-medium hover:bg-[#334155] transition-colors inline-flex items-center justify-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const currentCat = CATEGORIES.find((c) => c.id === form.category)!;

  return (
    <div className="rounded-xl border border-[#334155] bg-[#1e293b] overflow-hidden">
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-[#334155] bg-[#0f172a]/50">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => update({ category: cat.id })}
            className={`min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              form.category === cat.id
                ? "bg-[#3b82f6] text-white"
                : "text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#334155]"
            }`}
          >
            <span className="mr-1">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 md:p-6">
        <p className="text-[#94a3b8] text-sm mb-6">{currentCat.description}</p>

        {/* Bug */}
        {form.category === "bug" && (
          <>
            <label className="block text-sm font-medium text-[#f1f5f9] mb-2">
              What went wrong? <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.whatWentWrong}
              onChange={(e) => update({ whatWentWrong: e.target.value })}
              placeholder="e.g. The search page crashed when I filtered by company."
              rows={4}
              maxLength={MAX_CONTENT}
              className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] min-h-[120px]"
              required
            />
            <p className="text-xs text-[#64748b] mt-1">{form.whatWentWrong.length}/{MAX_CONTENT}</p>

            <label className="block text-sm font-medium text-[#f1f5f9] mt-4 mb-2">Steps to reproduce (optional)</label>
            <textarea
              value={form.stepsToReproduce}
              onChange={(e) => update({ stepsToReproduce: e.target.value })}
              placeholder="1. Go to... 2. Click... 3. See error"
              rows={3}
              maxLength={MAX_SHORT}
              className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] min-h-[80px]"
            />
            <p className="text-xs text-[#64748b] mt-1">{form.stepsToReproduce.length}/{MAX_SHORT}</p>

            <label className="block text-sm font-medium text-[#f1f5f9] mt-4 mb-2">Device / Browser (optional)</label>
            <input
              type="text"
              value={form.deviceBrowser}
              onChange={(e) => update({ deviceBrowser: e.target.value })}
              placeholder="e.g. Chrome on Windows 11"
              className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] min-h-[44px]"
            />
          </>
        )}

        {/* Feature */}
        {form.category === "feature" && (
          <>
            <label className="block text-sm font-medium text-[#f1f5f9] mb-2">
              Feature description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.featureDescription}
              onChange={(e) => update({ featureDescription: e.target.value })}
              placeholder="e.g. Add dark/light theme toggle in the header."
              rows={4}
              maxLength={MAX_CONTENT}
              className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] min-h-[120px]"
              required
            />
            <p className="text-xs text-[#64748b] mt-1">{form.featureDescription.length}/{MAX_CONTENT}</p>

            <label className="block text-sm font-medium text-[#f1f5f9] mt-4 mb-2">Why it would be useful (optional)</label>
            <textarea
              value={form.whyUseful}
              onChange={(e) => update({ whyUseful: e.target.value })}
              placeholder="Helps users who..."
              rows={3}
              maxLength={MAX_SHORT}
              className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] min-h-[80px]"
            />
            <p className="text-xs text-[#64748b] mt-1">{form.whyUseful.length}/{MAX_SHORT}</p>

            <fieldset className="mt-4">
              <span className="block text-sm font-medium text-[#f1f5f9] mb-2">Priority for you</span>
              <div className="flex flex-wrap gap-4">
                {(["low", "medium", "high"] as const).map((p) => (
                  <label key={p} className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                    <input
                      type="radio"
                      name="priority"
                      checked={form.priority === p}
                      onChange={() => update({ priority: p })}
                      className="w-4 h-4 text-[#3b82f6]"
                    />
                    <span className="text-[#cbd5e1] capitalize">{p}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </>
        )}

        {/* Question */}
        {form.category === "question" && (
          <>
            <label className="block text-sm font-medium text-[#f1f5f9] mb-2">
              Your question <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.question}
              onChange={(e) => update({ question: e.target.value })}
              placeholder="e.g. How do I delete my submitted question?"
              rows={4}
              maxLength={MAX_CONTENT}
              className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] min-h-[120px]"
              required
            />
            <p className="text-xs text-[#64748b] mt-1">{form.question.length}/{MAX_CONTENT}</p>

            <label className="block text-sm font-medium text-[#f1f5f9] mt-4 mb-2">Category</label>
            <select
              value={form.questionCategory}
              onChange={(e) => update({ questionCategory: e.target.value as FormState["questionCategory"] })}
              className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] min-h-[44px]"
            >
              <option value="technical">Technical</option>
              <option value="general">General</option>
              <option value="account">Account</option>
            </select>

            <label className="block text-sm font-medium text-[#f1f5f9] mt-4 mb-2">
              Email <span className="text-red-400">*</span> (required for response)
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update({ email: e.target.value })}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] min-h-[44px]"
              required
            />
          </>
        )}

        {/* General */}
        {form.category === "general" && (
          <>
            <label className="block text-sm font-medium text-[#f1f5f9] mb-2">
              Your feedback <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.feedback}
              onChange={(e) => update({ feedback: e.target.value })}
              placeholder="Love something? Hate something? We want to hear it all."
              rows={4}
              maxLength={MAX_CONTENT}
              className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] min-h-[120px]"
              required
            />
            <p className="text-xs text-[#64748b] mt-1">{form.feedback.length}/{MAX_CONTENT}</p>

            <label className="block text-sm font-medium text-[#f1f5f9] mt-4 mb-2">Rating (optional)</label>
            <div className="flex gap-2 min-h-[44px] items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => update({ rating: form.rating === star ? 0 : star })}
                  className="text-2xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6] rounded p-1"
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                >
                  {form.rating >= star ? "⭐" : "☆"}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Email for bug, feature, general */}
        {(form.category === "bug" || form.category === "feature" || form.category === "general") && (
          <>
            <label className="block text-sm font-medium text-[#f1f5f9] mt-4 mb-2">
              Email <span className="text-[#64748b] font-normal">(optional, for follow-up)</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update({ email: e.target.value })}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] min-h-[44px]"
            />
          </>
        )}

        {/* Honeypot - hidden from users */}
        <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
          <label htmlFor="feedback-website">Website</label>
          <input
            id="feedback-website"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.honeypot}
            onChange={(e) => update({ honeypot: e.target.value })}
          />
        </div>

        {/* Terms */}
        <label className="flex items-start gap-3 mt-6 cursor-pointer min-h-[44px]">
          <input
            type="checkbox"
            checked={form.agreeTerms}
            onChange={(e) => update({ agreeTerms: e.target.checked })}
            className="mt-1 w-4 h-4 rounded text-[#3b82f6]"
          />
          <span className="text-sm text-[#94a3b8]">
            I agree to the{" "}
            <Link href="/terms" className="text-[#3b82f6] hover:underline">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#3b82f6] hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        {errorMessage && (
          <p className="mt-4 text-sm text-red-400" role="alert">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-6 w-full min-h-[44px] py-3 px-6 rounded-lg bg-[#3b82f6] text-white font-medium hover:bg-[#2563eb] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {status === "loading" ? "Sending…" : "Send Feedback"}
        </button>
      </form>
    </div>
  );
}
