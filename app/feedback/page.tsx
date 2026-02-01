import type { Metadata } from "next";
import Link from "next/link";
import { FeedbackForm } from "@/components/FeedbackForm";

export const metadata: Metadata = {
  title: "Feedback & Contact | AskTaaza",
  description: "Share your feedback, report bugs, suggest features, or ask questions. We'd love to hear from you.",
};

const FAQ_ITEMS = [
  {
    q: "How do I delete my submission?",
    a: "Contact us via this form or at hello@asktaaza.com with the same email you used (if any) and we'll remove it within 48 hours.",
  },
  {
    q: "Can I edit a question after posting?",
    a: "Currently you can't edit after posting. Submit a new entry or contact us with the correction and we'll help.",
  },
  {
    q: "How do you verify questions?",
    a: "We rely on community submissions and moderation. Questions are reviewed for relevance and quality before going live.",
  },
  {
    q: "Is my feedback anonymous?",
    a: "Yes, unless you provide an email for a response. We never share your identity. Optional email is used only for follow-up.",
  },
  {
    q: "Do you respond to all feedback?",
    a: "We read everything. We reply by email when you've shared one and when a reply is helpful (e.g. questions, bug fixes). We can't reply to every suggestion individually but we use all feedback to improve.",
  },
];

const WHAT_HAPPENS = [
  { step: 1, title: "We receive your feedback immediately", desc: "Your message is stored securely and queued for review." },
  { step: 2, title: "Our team reviews within 24–48 hours", desc: "We read every submission and triage by category." },
  { step: 3, title: "We respond via email (if provided)", desc: "When you share an email, we'll get back to you when we have an update or answer." },
  { step: 4, title: "We prioritize and work on improvements", desc: "Bug reports and feature ideas feed directly into our roadmap." },
];

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <Link href="/" className="text-sm text-[#94a3b8] hover:text-[#f1f5f9] mb-8 inline-block">
          ← Back to AskTaaza
        </Link>

        {/* Hero */}
        <section className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#f1f5f9] mb-3">
            We&apos;d Love to Hear From You 💙
          </h1>
          <p className="text-xl text-[#94a3b8] mb-2">
            Your feedback helps us improve AskTaaza
          </p>
          <p className="text-[#cbd5e1] max-w-xl mx-auto">
            Your feedback shapes AskTaaza. Whether it&apos;s a bug, idea, or just a hello—we&apos;re listening.
          </p>
        </section>

        {/* Feedback categories form */}
        <section className="mb-12" id="feedback-form">
          <FeedbackForm />
        </section>

        {/* FAQ */}
        <section className="mb-12" id="faq">
          <h2 className="text-2xl font-bold text-[#f1f5f9] mb-6">Frequently Asked Questions</h2>
          <ul className="space-y-6">
            {FAQ_ITEMS.map((item, i) => (
              <li key={i} className="rounded-lg border border-[#334155] bg-[#1e293b] p-4">
                <h3 className="font-semibold text-[#f1f5f9] mb-2">{item.q}</h3>
                <p className="text-[#94a3b8] text-sm leading-relaxed">{item.a}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* What Happens Next */}
        <section className="mb-12" id="what-happens">
          <h2 className="text-2xl font-bold text-[#f1f5f9] mb-4">After you submit, here&apos;s what happens:</h2>
          <ol className="space-y-4">
            {WHAT_HAPPENS.map((item) => (
              <li key={item.step} className="flex gap-4 rounded-lg border border-[#334155] bg-[#1e293b] p-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#3b82f6] text-white flex items-center justify-center font-semibold text-sm">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-semibold text-[#f1f5f9]">{item.title}</h3>
                  <p className="text-[#94a3b8] text-sm mt-1">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Privacy Note */}
        <section className="mb-8 rounded-xl border border-[#334155] bg-[#1e293b] p-6">
          <h2 className="text-lg font-semibold text-[#f1f5f9] mb-2">🔒 Your feedback is confidential</h2>
          <p className="text-[#94a3b8] text-sm mb-2">
            We respect your privacy. Optional email is used only for follow-up. We never sell or share your data.
          </p>
          <p className="text-sm">
            <Link href="/privacy" className="text-[#3b82f6] hover:underline">
              Privacy Policy
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
