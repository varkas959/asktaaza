import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions | AskTaaza",
  description: "AskTaaza Terms and Conditions - rules for using our interview questions platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/" className="text-sm text-[#94a3b8] hover:text-[#f1f5f9] mb-8 inline-block">
          ← Back to AskTaaza
        </Link>

        <article className="prose prose-invert prose-slate max-w-none">
          <h1 className="text-3xl font-bold text-[#f1f5f9] mb-2">Terms and Conditions</h1>
          <p className="text-[#94a3b8] text-sm mb-8">Last Updated: January 30, 2026</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#f1f5f9] mb-4">Welcome to AskTaaza</h2>
            <p className="text-[#cbd5e1] leading-relaxed mb-4">
              These Terms and Conditions (&quot;Terms&quot;) govern your use of AskTaaza (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) and our website, products, and services. By accessing or using AskTaaza, you agree to be bound by these Terms and our <Link href="/privacy" className="text-[#3b82f6] hover:underline">Privacy Policy</Link>.
            </p>
            <p className="text-[#cbd5e1] leading-relaxed font-medium">
              If you do not agree to these Terms, please do not use AskTaaza.
            </p>
          </section>

          <Section title="1. Use of the Service">
            <p className="text-[#cbd5e1] mb-2">You may use AskTaaza to:</p>
            <ul className="list-disc list-inside space-y-1 text-[#cbd5e1] mb-4">
              <li>Browse and search interview questions shared by the community</li>
              <li>Submit interview questions and related details anonymously</li>
              <li>Filter questions by company, technology, experience level, and other criteria</li>
            </ul>
            <p className="text-[#cbd5e1]">You must be at least 18 years old to use AskTaaza. You are responsible for ensuring that your use complies with applicable laws.</p>
          </Section>

          <Section title="2. Your Submissions">
            <p className="text-[#cbd5e1] mb-2">When you submit content to AskTaaza:</p>
            <ul className="list-disc list-inside space-y-1 text-[#cbd5e1]">
              <li>You grant us a non-exclusive, royalty-free license to display, store, and use your submissions on the platform</li>
              <li>Submissions are displayed anonymously; we do not associate your identity with your submissions publicly</li>
              <li>You must not submit confidential information, trade secrets, or content that infringes others&apos; rights</li>
              <li>You must not submit false, misleading, defamatory, or harmful content</li>
              <li>We may remove or moderate content that violates these Terms or our guidelines</li>
            </ul>
          </Section>

          <Section title="3. Acceptable Use">
            <p className="text-[#cbd5e1] mb-2">You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 text-[#cbd5e1]">
              <li>Use the service for any illegal purpose or in violation of any laws</li>
              <li>Submit spam, automated or bulk submissions, or attempt to manipulate the platform</li>
              <li>Impersonate others or misrepresent your affiliation</li>
              <li>Attempt to gain unauthorized access to our systems or other users&apos; data</li>
              <li>Use the service in a way that could harm, disable, or overburden AskTaaza</li>
            </ul>
          </Section>

          <Section title="4. Intellectual Property">
            <p className="text-[#cbd5e1]">AskTaaza and its branding, design, and technology are owned by us or our licensors. You may not copy, modify, or create derivative works without our permission. User-submitted content remains the responsibility of the submitter; we do not claim ownership of the underlying interview questions you submit.</p>
          </Section>

          <Section title="5. Disclaimer of Warranties">
            <p className="text-[#cbd5e1]">AskTaaza is provided &quot;as is&quot; and &quot;as available&quot;. We do not warrant that the service will be uninterrupted, error-free, or free of harmful components. Content on AskTaaza is crowdsourced and may contain inaccuracies. We are not responsible for decisions you make based on content on the platform.</p>
          </Section>

          <Section title="6. Limitation of Liability">
            <p className="text-[#cbd5e1]">To the fullest extent permitted by law, AskTaaza and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or data, arising from your use of the service.</p>
          </Section>

          <Section title="7. Changes to the Service and Terms">
            <p className="text-[#cbd5e1]">We may change the service or these Terms at any time. We will update the &quot;Last Updated&quot; date and, for material changes, we will provide notice on the website. Continued use after changes constitutes acceptance of the updated Terms.</p>
          </Section>

          <Section title="8. Termination">
            <p className="text-[#cbd5e1]">We may suspend or terminate your access to AskTaaza at any time, with or without cause or notice. You may stop using the service at any time. Provisions that by their nature should survive (e.g. disclaimers, limitations of liability) will survive termination.</p>
          </Section>

          <Section title="9. Governing Law">
            <p className="text-[#cbd5e1]">These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of India.</p>
          </Section>

          <Section title="10. Contact">
            <p className="text-[#cbd5e1]">For questions about these Terms, contact us at <strong>hello@asktaaza.com</strong> or <strong>privacy@asktaaza.com</strong>.</p>
          </Section>

          <div className="mt-12 p-6 rounded-lg bg-[#1e293b] border border-[#334155]">
            <p className="text-[#94a3b8] text-sm">By using AskTaaza, you agree to these Terms and our <Link href="/privacy" className="text-[#3b82f6] hover:underline">Privacy Policy</Link>. Thank you for being part of our community.</p>
          </div>
        </article>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-[#f1f5f9] mb-4 border-b border-[#334155] pb-2">{title}</h2>
      {children}
    </section>
  );
}
