import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | AskTaaza",
  description: "AskTaaza Privacy Policy - how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/" className="text-sm text-[#94a3b8] hover:text-[#f1f5f9] mb-8 inline-block">
          ← Back to AskTaaza
        </Link>

        <article className="prose prose-invert prose-slate max-w-none">
          <h1 className="text-3xl font-bold text-[#f1f5f9] mb-2">Privacy Policy</h1>
          <p className="text-[#94a3b8] text-sm mb-8">Last Updated: January 30, 2026</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#f1f5f9] mb-4">Welcome to AskTaaza</h2>
            <p className="text-[#cbd5e1] leading-relaxed mb-4">
              At AskTaaza, we believe in transparency and respect for your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our platform. We&apos;re committed to keeping your data safe while helping you prepare for interviews with fresh, crowdsourced questions.
            </p>
            <p className="text-[#cbd5e1] leading-relaxed font-medium">
              By using AskTaaza, you agree to the practices described in this policy.
            </p>
          </section>

          <nav className="mb-10 p-4 rounded-lg bg-[#1e293b] border border-[#334155]">
            <h3 className="text-sm font-semibold text-[#f1f5f9] mb-3">Table of Contents</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-[#94a3b8]">
              <li><a href="#information-we-collect" className="hover:text-[#3b82f6]">Information We Collect</a></li>
              <li><a href="#how-we-use-your-information" className="hover:text-[#3b82f6]">How We Use Your Information</a></li>
              <li><a href="#how-we-share-your-information" className="hover:text-[#3b82f6]">How We Share Your Information</a></li>
              <li><a href="#anonymity-your-privacy" className="hover:text-[#3b82f6]">Anonymity & Your Privacy</a></li>
              <li><a href="#cookies-tracking" className="hover:text-[#3b82f6]">Cookies & Tracking Technologies</a></li>
              <li><a href="#data-security" className="hover:text-[#3b82f6]">Data Security</a></li>
              <li><a href="#your-rights" className="hover:text-[#3b82f6]">Your Rights & Choices</a></li>
              <li><a href="#childrens-privacy" className="hover:text-[#3b82f6]">Children&apos;s Privacy</a></li>
              <li><a href="#international-users" className="hover:text-[#3b82f6]">International Users</a></li>
              <li><a href="#changes" className="hover:text-[#3b82f6]">Changes to This Policy</a></li>
              <li><a href="#contact-us" className="hover:text-[#3b82f6]">Contact Us</a></li>
            </ol>
          </nav>

          <Section id="information-we-collect" title="1. Information We Collect">
            <h4 className="text-[#f1f5f9] font-medium mt-4 mb-2">Information You Provide to Us</h4>
            <p className="text-[#cbd5e1] mb-2">When you use AskTaaza, you may provide us with:</p>
            <ul className="list-disc list-inside space-y-1 text-[#cbd5e1] mb-4">
              <li><strong>Interview Questions</strong>: The technical questions, coding problems, or scenarios you encountered</li>
              <li><strong>Company Names</strong>: The organization where you interviewed</li>
              <li><strong>Job Details</strong>: Job title/role you applied for</li>
              <li><strong>Experience Level</strong>: Your years of professional experience</li>
              <li><strong>Technology/Skills</strong>: The technical stack or skills being assessed</li>
              <li><strong>Interview Details</strong>: Round type, interview date/timeframe</li>
              <li><strong>Email Address</strong> (Optional): If you choose to provide it</li>
            </ul>
            <h4 className="text-[#f1f5f9] font-medium mt-4 mb-2">Information We Collect Automatically</h4>
            <ul className="list-disc list-inside space-y-1 text-[#cbd5e1]">
              <li><strong>Device Information</strong>: Browser type, OS, device type</li>
              <li><strong>Usage Data</strong>: Pages visited, time spent, navigation paths</li>
              <li><strong>IP Address</strong>: For security and analytics</li>
              <li><strong>Cookies & Similar Technologies</strong></li>
              <li><strong>Referral Information</strong>: The website that referred you</li>
            </ul>
          </Section>

          <Section id="how-we-use-your-information" title="2. How We Use Your Information">
            <p className="text-[#cbd5e1] mb-2">We use the information to:</p>
            <ul className="list-disc list-inside space-y-1 text-[#cbd5e1]">
              <li>Display interview questions publicly (anonymously)</li>
              <li>Enable filtering and searching</li>
              <li>Improve our platform and develop new features</li>
              <li>Communicate with you and respond to support requests</li>
              <li>Maintain safety, prevent spam and abuse</li>
              <li>Comply with applicable laws</li>
            </ul>
          </Section>

          <Section id="how-we-share-your-information" title="3. How We Share Your Information">
            <p className="text-[#cbd5e1] mb-2">Interview questions are displayed publicly but <strong>always anonymously</strong>. We do <strong>NOT</strong> display your name, email, or identity. We <strong>never sell</strong> your personal information. We share limited data with trusted service providers (analytics, hosting) who are contractually obligated to protect your data. We may disclose information when required by law.</p>
          </Section>

          <Section id="anonymity-your-privacy" title="4. Anonymity & Your Privacy">
            <p className="text-[#cbd5e1] mb-2">All question submissions are anonymous. Your name and email are never displayed publicly. We retain IP, timestamp, and device info for moderation only—never shown to other users.</p>
          </Section>

          <Section id="cookies-tracking" title="5. Cookies & Tracking Technologies">
            <p className="text-[#cbd5e1] mb-2">We use essential cookies (session, preferences), analytics (e.g. Google Analytics), and preference cookies (theme). You can control cookies via your browser settings. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline">Google&apos;s Privacy Policy</a> for analytics.</p>
          </Section>

          <Section id="data-security" title="6. Data Security">
            <p className="text-[#cbd5e1] mb-2">We use HTTPS, secure hosting, access controls, and monitoring. No method is 100% secure; we work to protect your information. You can help by not sharing sensitive data in submissions and using secure connections.</p>
          </Section>

          <Section id="your-rights" title="7. Your Rights & Choices">
            <p className="text-[#cbd5e1] mb-2">You have the right to access, delete, correct, and object to certain processing. Contact <strong>privacy@asktaaza.com</strong> with your request. We respond within 30 days.</p>
          </Section>

          <Section id="childrens-privacy" title="8. Children&apos;s Privacy">
            <p className="text-[#cbd5e1] mb-2">AskTaaza is not intended for individuals under 18. We do not knowingly collect information from minors. If you believe your child has submitted data, contact us at privacy@asktaaza.com and we will delete it.</p>
          </Section>

          <Section id="international-users" title="9. International Users">
            <p className="text-[#cbd5e1] mb-2">AskTaaza is based in India. Your data may be stored or transferred internationally. By using AskTaaza, you consent to such transfer. We comply with applicable laws including GDPR and CCPA where applicable.</p>
          </Section>

          <Section id="changes" title="10. Changes to This Policy">
            <p className="text-[#cbd5e1] mb-2">We may update this policy. We will update the &quot;Last Updated&quot; date and post a notice. Continued use after changes means you accept the updated policy.</p>
          </Section>

          <Section id="contact-us" title="11. Contact Us">
            <p className="text-[#cbd5e1] mb-2">
              <strong>General Inquiries</strong>: hello@asktaaza.com<br />
              <strong>Response Time</strong>: Within 48 hours
            </p>
          </Section>

          <div className="mt-12 p-6 rounded-lg bg-[#1e293b] border border-[#334155]">
            <h3 className="text-lg font-semibold text-[#f1f5f9] mb-4">Summary</h3>
            <ul className="space-y-2 text-[#cbd5e1] text-sm">
              <li>✅ We collect interview questions and metadata you submit</li>
              <li>✅ All submissions are <strong>anonymous</strong></li>
              <li>✅ We use cookies and analytics to improve the platform</li>
              <li>✅ We <strong>never sell</strong> your data</li>
              <li>✅ You can request deletion anytime</li>
              <li>✅ Contact us with any privacy questions</li>
            </ul>
            <p className="text-[#94a3b8] text-sm mt-4">Thank you for trusting AskTaaza. This policy is effective as of January 30, 2026.</p>
          </div>
        </article>
      </div>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10 scroll-mt-24">
      <h2 className="text-xl font-semibold text-[#f1f5f9] mb-4 border-b border-[#334155] pb-2">{title}</h2>
      {children}
    </section>
  );
}
