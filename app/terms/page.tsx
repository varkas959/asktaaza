import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | AskTaaza",
  description: "AskTaaza Terms of Service - rules for using our interview questions platform.",
};

function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`mb-10 ${id ? "scroll-mt-24" : ""}`}
    >
      <h2 className="text-xl font-semibold text-[#f1f5f9] mb-4 border-b border-[#334155] pb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/" className="text-sm text-[#94a3b8] hover:text-[#f1f5f9] mb-8 inline-block">
          ← Back to AskTaaza
        </Link>

        <article className="prose prose-invert prose-slate max-w-none">
          <h1 className="text-3xl font-bold text-[#f1f5f9] mb-2">Terms of Service</h1>
          <p className="text-[#94a3b8] text-sm mb-8">Effective Date: January 30, 2026</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#f1f5f9] mb-4">Welcome to AskTaaza</h2>
            <p className="text-[#cbd5e1] leading-relaxed mb-4">
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of AskTaaza&apos;s website, mobile application, and related services (collectively, the &quot;Service&quot;). Please read these Terms carefully before using our platform.
            </p>
            <p className="text-[#cbd5e1] leading-relaxed font-medium">
              By accessing or using AskTaaza, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access or use the Service.
            </p>
          </section>

          <nav className="mb-10 p-4 rounded-lg bg-[#1e293b] border border-[#334155]">
            <h3 className="text-sm font-semibold text-[#f1f5f9] mb-3">Table of Contents</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-[#94a3b8]">
              <li><a href="#acceptance" className="hover:text-[#3b82f6]">Acceptance of Terms</a></li>
              <li><a href="#description" className="hover:text-[#3b82f6]">Description of Service</a></li>
              <li><a href="#eligibility" className="hover:text-[#3b82f6]">Eligibility</a></li>
              <li><a href="#accounts" className="hover:text-[#3b82f6]">User Accounts</a></li>
              <li><a href="#acceptable-use" className="hover:text-[#3b82f6]">Acceptable Use Policy</a></li>
              <li><a href="#user-content" className="hover:text-[#3b82f6]">User Content & Submissions</a></li>
              <li><a href="#intellectual-property" className="hover:text-[#3b82f6]">Intellectual Property Rights</a></li>
              <li><a href="#warranties" className="hover:text-[#3b82f6]">Disclaimer of Warranties</a></li>
              <li><a href="#liability" className="hover:text-[#3b82f6]">Limitation of Liability</a></li>
              <li><a href="#indemnification" className="hover:text-[#3b82f6]">Indemnification</a></li>
              <li><a href="#moderation" className="hover:text-[#3b82f6]">Content Moderation</a></li>
              <li><a href="#termination" className="hover:text-[#3b82f6]">Termination</a></li>
              <li><a href="#paid-features" className="hover:text-[#3b82f6]">Future Paid Features</a></li>
              <li><a href="#third-party" className="hover:text-[#3b82f6]">Third-Party Links & Services</a></li>
              <li><a href="#disputes" className="hover:text-[#3b82f6]">Dispute Resolution</a></li>
              <li><a href="#changes" className="hover:text-[#3b82f6]">Changes to Terms</a></li>
              <li><a href="#general" className="hover:text-[#3b82f6]">General Provisions</a></li>
              <li><a href="#contact" className="hover:text-[#3b82f6]">Contact Information</a></li>
            </ol>
          </nav>

          <Section id="acceptance" title="1. Acceptance of Terms">
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Binding Agreement</h3>
            <p className="text-[#cbd5e1] mb-4">
              By accessing or using AskTaaza, you acknowledge that you have read, understood, and agree to be bound by these Terms and our <Link href="/privacy" className="text-[#3b82f6] hover:underline">Privacy Policy</Link>. This is a legally binding agreement between you and AskTaaza.
            </p>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Age Requirement</h3>
            <p className="text-[#cbd5e1] mb-4">
              You must be at least 18 years old to use this Service. By using AskTaaza, you represent and warrant that you are 18 years of age or older.
            </p>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Modifications</h3>
            <p className="text-[#cbd5e1]">
              We reserve the right to modify these Terms at any time. Your continued use of the Service after changes are posted constitutes your acceptance of the modified Terms.
            </p>
          </Section>

          <Section id="description" title="2. Description of Service">
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">What AskTaaza Provides</h3>
            <p className="text-[#cbd5e1] mb-2">AskTaaza is a crowdsourced platform where professionals can:</p>
            <ul className="list-disc list-inside space-y-1 text-[#cbd5e1] mb-4">
              <li><strong>Share interview questions</strong> they&apos;ve encountered during job interviews</li>
              <li><strong>Browse recent interview questions</strong> from various companies and technologies</li>
              <li><strong>Filter and search</strong> questions by company, technology, experience level, and date</li>
              <li><strong>Contribute to the community</strong> by submitting authentic interview experiences</li>
            </ul>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Service Characteristics</h3>
            <ul className="list-disc list-inside space-y-1 text-[#cbd5e1]">
              <li><strong>Community-Driven</strong>: Content is submitted by users, not created by AskTaaza</li>
              <li><strong>Anonymous Submissions</strong>: All question submissions are anonymous by default</li>
              <li><strong>Free Access</strong>: Currently free to use (subject to change with notice)</li>
              <li><strong>No Guarantees</strong>: Questions are crowdsourced and may not reflect current interview practices</li>
            </ul>
          </Section>

          <Section id="eligibility" title="3. Eligibility">
            <p className="text-[#cbd5e1] mb-2">You may use the Service only if:</p>
            <ul className="list-none space-y-1 text-[#cbd5e1] mb-4">
              <li>✅ You are at least <strong>18 years old</strong></li>
              <li>✅ You have the legal capacity to enter into binding agreements</li>
              <li>✅ You are not prohibited from using the Service under applicable laws</li>
              <li>✅ You have not been previously banned or suspended from AskTaaza</li>
              <li>✅ You comply with all local, state, national, and international laws</li>
            </ul>
            <p className="text-[#cbd5e1] font-medium">
              We reserve the right to refuse service to anyone for any reason at any time.
            </p>
          </Section>

          <Section id="accounts" title="4. User Accounts">
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Current Status</h3>
            <p className="text-[#cbd5e1] mb-4">
              As of the effective date of these Terms, <strong>AskTaaza does not require user accounts</strong>. Submissions are anonymous and no registration is needed.
            </p>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Future Implementation</h3>
            <p className="text-[#cbd5e1] mb-2">We may introduce user accounts in the future. If we do:</p>
            <ul className="list-disc list-inside space-y-1 text-[#cbd5e1]">
              <li>You&apos;ll be responsible for maintaining account security</li>
              <li>You&apos;ll be responsible for all activities under your account</li>
              <li>You must provide accurate, current, and complete information</li>
              <li>You must not share your account credentials</li>
              <li>You must notify us immediately of any unauthorized use</li>
            </ul>
          </Section>

          <Section id="acceptable-use" title="5. Acceptable Use Policy">
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">You Agree NOT To:</h3>
            <h4 className="text-[#e2e8f0] font-medium mt-3 mb-2">Content Violations</h4>
            <ul className="list-none space-y-1 text-[#cbd5e1] mb-4">
              <li>❌ Post <strong>false, misleading, or fabricated</strong> interview questions</li>
              <li>❌ Post <strong>spam, advertisements, or promotional content</strong></li>
              <li>❌ Submit <strong>duplicate or repetitive</strong> content</li>
              <li>❌ Post content that is <strong>offensive, abusive, or harassing</strong></li>
              <li>❌ Share <strong>confidential or proprietary information</strong> from companies</li>
              <li>❌ Violate any <strong>non-disclosure agreements (NDAs)</strong> you&apos;ve signed</li>
            </ul>
            <h4 className="text-[#e2e8f0] font-medium mt-3 mb-2">Platform Abuse</h4>
            <ul className="list-none space-y-1 text-[#cbd5e1] mb-4">
              <li>❌ Attempt to <strong>scrape, harvest, or extract data</strong> without permission</li>
              <li>❌ Use <strong>automated tools, bots, or scripts</strong> to access the Service</li>
              <li>❌ <strong>Interfere with or disrupt</strong> the platform&apos;s functionality</li>
              <li>❌ Upload <strong>viruses, malware, or malicious code</strong></li>
              <li>❌ Attempt to <strong>bypass security measures</strong> or access restrictions</li>
              <li>❌ <strong>Manipulate voting systems</strong> (upvotes/downvotes) artificially</li>
            </ul>
            <h4 className="text-[#e2e8f0] font-medium mt-3 mb-2">Impersonation & Fraud</h4>
            <ul className="list-none space-y-1 text-[#cbd5e1] mb-4">
              <li>❌ <strong>Impersonate</strong> any person, company, or entity</li>
              <li>❌ <strong>Misrepresent your affiliation</strong> with any company</li>
              <li>❌ Create <strong>fake or misleading</strong> company profiles</li>
            </ul>
            <h4 className="text-[#e2e8f0] font-medium mt-3 mb-2">Legal Violations</h4>
            <ul className="list-none space-y-1 text-[#cbd5e1] mb-4">
              <li>❌ Use the Service for any <strong>illegal purpose</strong></li>
              <li>❌ Violate any applicable <strong>local, state, national, or international laws</strong></li>
              <li>❌ Infringe on <strong>intellectual property rights</strong> of others</li>
              <li>❌ Violate <strong>privacy rights</strong> of individuals</li>
            </ul>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Consequences of Violations</h3>
            <p className="text-[#cbd5e1]">
              Violations may result in: content removal; account suspension (if accounts implemented); permanent ban from the Service; legal action if warranted.
            </p>
          </Section>

          <Section id="user-content" title="6. User Content & Submissions">
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Ownership</h3>
            <p className="text-[#cbd5e1] mb-4">
              You retain <strong>ownership</strong> of the content you submit (interview questions, feedback, etc.).
            </p>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">License to AskTaaza</h3>
            <p className="text-[#cbd5e1] mb-2">By submitting content, you grant AskTaaza a:</p>
            <ul className="list-disc list-inside space-y-1 text-[#cbd5e1] mb-4">
              <li><strong>Worldwide, non-exclusive, royalty-free, perpetual, irrevocable license</strong> to: display your content publicly on the platform; store, reproduce, and distribute your content; modify or adapt your content for technical purposes (formatting, etc.); use your content for promotional purposes (showcasing the platform)</li>
            </ul>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Your Representations</h3>
            <p className="text-[#cbd5e1] mb-2">By submitting content, you represent and warrant that:</p>
            <ul className="list-none space-y-1 text-[#cbd5e1] mb-4">
              <li>✅ You have the right to submit the content</li>
              <li>✅ The content is <strong>accurate to the best of your knowledge</strong></li>
              <li>✅ The content doesn&apos;t violate any laws or third-party rights</li>
              <li>✅ The content doesn&apos;t breach any confidentiality obligations</li>
              <li>✅ You&apos;re not submitting proprietary or trade secret information</li>
            </ul>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Content Responsibility</h3>
            <p className="text-[#cbd5e1] mb-2"><strong>You are solely responsible</strong> for the content you submit. AskTaaza:</p>
            <ul className="list-none space-y-1 text-[#cbd5e1] mb-4">
              <li>❌ Does <strong>not</strong> verify the accuracy of submitted questions</li>
              <li>❌ Does <strong>not</strong> endorse any content</li>
              <li>❌ Is <strong>not</strong> responsible for user-generated content</li>
              <li>✅ Reserves the right to review, modify, or remove content</li>
            </ul>
            <p className="text-[#cbd5e1]">
              ⚠️ <strong>Important</strong>: Many companies require candidates to sign NDAs prohibiting disclosure of interview questions. By submitting content, you confirm that you are <strong>not violating any confidentiality agreements</strong> you&apos;ve signed. AskTaaza is not responsible if you breach such agreements.
            </p>
          </Section>

          <Section id="intellectual-property" title="7. Intellectual Property Rights">
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">AskTaaza&apos;s Property</h3>
            <p className="text-[#cbd5e1] mb-2">The Service, including but not limited to:</p>
            <ul className="list-disc list-inside space-y-1 text-[#cbd5e1] mb-4">
              <li>Website design, layout, and user interface</li>
              <li>Source code, software, and databases</li>
              <li>AskTaaza name, logo, and branding</li>
              <li>Original content created by AskTaaza</li>
            </ul>
            <p className="text-[#cbd5e1] mb-4">
              ...is the exclusive property of AskTaaza and is protected by copyright, trademark, and other intellectual property laws.
            </p>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Trademarks</h3>
            <p className="text-[#cbd5e1] mb-4">
              &quot;AskTaaza&quot; and associated logos are trademarks of AskTaaza. You may not use these trademarks without our prior written permission.
            </p>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Company Names</h3>
            <p className="text-[#cbd5e1] mb-4">
              Company names mentioned on the platform are the property of their respective owners. Their presence on AskTaaza does not imply any affiliation, endorsement, or partnership.
            </p>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Restrictions</h3>
            <p className="text-[#cbd5e1] mb-2">You may <strong>NOT</strong>:</p>
            <ul className="list-disc list-inside space-y-1 text-[#cbd5e1] mb-4">
              <li>Copy, modify, or create derivative works of the Service</li>
              <li>Reverse engineer, decompile, or disassemble the platform</li>
              <li>Remove copyright or proprietary notices</li>
              <li>Use AskTaaza branding without permission</li>
              <li>Frame or mirror the Service on another website</li>
            </ul>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Fair Use</h3>
            <p className="text-[#cbd5e1] mb-2">You may:</p>
            <ul className="list-disc list-inside space-y-1 text-[#cbd5e1]">
              <li>Link to AskTaaza from your website or social media</li>
              <li>Share individual question links (with attribution)</li>
              <li>Quote limited excerpts for educational purposes (with attribution)</li>
            </ul>
          </Section>

          <Section id="warranties" title="8. Disclaimer of Warranties">
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">&quot;AS IS&quot; Service</h3>
            <p className="text-[#cbd5e1] mb-4 font-medium">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
            </p>
            <p className="text-[#cbd5e1] mb-2">AskTaaza disclaims all warranties, including but not limited to:</p>
            <ul className="list-none space-y-1 text-[#cbd5e1] mb-4">
              <li>❌ <strong>Accuracy</strong>: We don&apos;t guarantee questions are current, accurate, or complete</li>
              <li>❌ <strong>Availability</strong>: The Service may be interrupted, delayed, or unavailable</li>
              <li>❌ <strong>Reliability</strong>: We don&apos;t guarantee error-free or uninterrupted service</li>
              <li>❌ <strong>Interview Success</strong>: Using AskTaaza does not guarantee job offers or interview success</li>
              <li>❌ <strong>Fitness for Purpose</strong>: The Service may not meet your specific needs</li>
            </ul>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">No Professional Advice</h3>
            <p className="text-[#cbd5e1] mb-4">
              AskTaaza is <strong>not</strong> providing: career counseling or coaching; legal advice regarding NDAs or employment; guaranteed interview preparation; employment services or job placement.
            </p>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Question Authenticity</h3>
            <p className="text-[#cbd5e1] mb-2"><strong>We do not verify</strong> that submitted questions:</p>
            <ul className="list-disc list-inside space-y-1 text-[#cbd5e1] mb-4">
              <li>Were actually asked in interviews</li>
              <li>Reflect current company interview practices</li>
              <li>Are still relevant or up-to-date</li>
              <li>Represent official company positions</li>
            </ul>
            <p className="text-[#cbd5e1] font-medium">Use questions at your own discretion and risk.</p>
            <p className="text-[#cbd5e1] mt-4">
              We are not responsible for the accuracy, legality, or appropriateness of user-submitted content or third-party links.
            </p>
          </Section>

          <Section id="liability" title="9. Limitation of Liability">
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Maximum Liability</h3>
            <p className="text-[#cbd5e1] mb-4 font-medium">
              TO THE FULLEST EXTENT PERMITTED BY LAW, ASKTAAZA&apos;S TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING FROM OR RELATED TO THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE PAST 12 MONTHS (CURRENTLY ₹0).
            </p>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Excluded Damages</h3>
            <p className="text-[#cbd5e1] mb-2"><strong>IN NO EVENT SHALL ASKTAAZA BE LIABLE FOR:</strong></p>
            <ul className="list-none space-y-1 text-[#cbd5e1] mb-4">
              <li>❌ Indirect, incidental, special, consequential, or punitive damages</li>
              <li>❌ Loss of profits, revenue, data, or business opportunities</li>
              <li>❌ Interview failures or job rejections</li>
              <li>❌ Reliance on inaccurate information</li>
              <li>❌ NDA violations by users</li>
              <li>❌ Unauthorized access to your submissions</li>
              <li>❌ Service interruptions or data loss</li>
            </ul>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Interview Outcomes</h3>
            <p className="text-[#cbd5e1] mb-4">
              <strong>AskTaaza is NOT responsible for:</strong> whether you get a job interview; whether you pass an interview; whether you receive a job offer; any employment-related outcomes. Interview preparation is your responsibility. Questions may be outdated, inaccurate, or irrelevant.
            </p>
            <p className="text-[#cbd5e1]">
              Some jurisdictions do not allow limitation of certain warranties or liabilities. In such jurisdictions, our liability is limited to the fullest extent permitted by law.
            </p>
          </Section>

          <Section id="indemnification" title="10. Indemnification">
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Your Agreement to Defend Us</h3>
            <p className="text-[#cbd5e1] mb-4">
              You agree to <strong>indemnify, defend, and hold harmless</strong> AskTaaza, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from: your use of the Service; your submitted content; your violation of these Terms; your violation of any laws or third-party rights; your breach of any confidentiality agreements (NDAs); any dispute between you and another user.
            </p>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Procedure</h3>
            <p className="text-[#cbd5e1]">
              If we&apos;re subject to a claim you&apos;re responsible for: we&apos;ll notify you promptly; you&apos;ll cooperate with our defense; we may participate in defense at our expense; you may not settle without our written consent.
            </p>
          </Section>

          <Section id="moderation" title="11. Content Moderation">
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Our Rights</h3>
            <p className="text-[#cbd5e1] mb-2">AskTaaza reserves the right, but has no obligation, to:</p>
            <ul className="list-none space-y-1 text-[#cbd5e1] mb-4">
              <li>✅ Monitor, review, and moderate all user submissions</li>
              <li>✅ Remove or refuse any content at our sole discretion</li>
              <li>✅ Edit content for formatting or clarity (not substance)</li>
              <li>✅ Flag content as potentially inaccurate or outdated</li>
              <li>✅ Investigate violations of these Terms</li>
            </ul>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">No Obligation to Monitor</h3>
            <p className="text-[#cbd5e1] mb-4">
              We are <strong>not obligated</strong> to pre-screen content before publication. The presence of content does not constitute our endorsement or verification.
            </p>
            <p className="text-[#cbd5e1] mb-4">
              Users can report inappropriate content. We&apos;ll review reports but make final decisions at our discretion. Our decision to remove (or not remove) content does not create liability on our part for that content.
            </p>
          </Section>

          <Section id="termination" title="12. Termination">
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Your Right to Stop Using</h3>
            <p className="text-[#cbd5e1] mb-4">
              You may stop using the Service at any time. Since we don&apos;t currently require accounts, there&apos;s nothing to delete.
            </p>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Our Right to Terminate</h3>
            <p className="text-[#cbd5e1] mb-2">We may, at our sole discretion, <strong>suspend or terminate</strong> your access to the Service:</p>
            <ul className="list-disc list-inside space-y-1 text-[#cbd5e1] mb-4">
              <li>Immediately, without notice or liability</li>
              <li>For violation of these Terms</li>
              <li>For abusive or fraudulent behavior</li>
              <li>For any reason we deem necessary</li>
              <li>If required by law</li>
            </ul>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Effect of Termination</h3>
            <p className="text-[#cbd5e1] mb-4">
              Upon termination: your right to access the Service immediately ceases; previously submitted content may remain on the platform (per license granted); sections of these Terms that should survive (warranties, liability, etc.) remain in effect.
            </p>
            <p className="text-[#cbd5e1]">
              Since the Service is currently free, no refunds are applicable. If we introduce paid features, our refund policy will be specified separately.
            </p>
          </Section>

          <Section id="paid-features" title="13. Future Paid Features">
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Current Status</h3>
            <p className="text-[#cbd5e1] mb-4">
              AskTaaza is currently <strong>free to use</strong>. All features are available at no cost.
            </p>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Future Changes</h3>
            <p className="text-[#cbd5e1] mb-2">We may introduce paid features or subscription tiers in the future, such as:</p>
            <ul className="list-disc list-inside space-y-1 text-[#cbd5e1] mb-4">
              <li>Premium question access</li>
              <li>Advanced filtering and analytics</li>
              <li>Ad-free experience</li>
              <li>Priority support</li>
              <li>Company-specific insights</li>
            </ul>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Your Rights</h3>
            <p className="text-[#cbd5e1] mb-2">If we introduce paid features:</p>
            <ul className="list-none space-y-1 text-[#cbd5e1] mb-4">
              <li>✅ We&apos;ll provide <strong>advance notice</strong> (at least 30 days)</li>
              <li>✅ Free content currently available will <strong>remain free</strong></li>
              <li>✅ You&apos;ll have the option to upgrade (not required)</li>
              <li>✅ Pricing and terms will be clearly stated</li>
              <li>✅ You can cancel paid features anytime</li>
            </ul>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Payment Terms (Future)</h3>
            <p className="text-[#cbd5e1]">
              When paid features are introduced: payment processed through secure third-party processors; prices in Indian Rupees (₹) unless otherwise stated; subscriptions auto-renew unless cancelled; refund policy will be provided.
            </p>
          </Section>

          <Section id="third-party" title="14. Third-Party Links & Services">
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">External Links</h3>
            <p className="text-[#cbd5e1] mb-4">
              AskTaaza may contain links to third-party websites, services, or resources. These links are provided for convenience only.
            </p>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">No Endorsement</h3>
            <p className="text-[#cbd5e1] mb-4">
              We do <strong>not</strong> endorse, control, or assume responsibility for: third-party websites or services; content on external sites; privacy practices of third parties; accuracy of external information.
            </p>
            <p className="text-[#cbd5e1] mb-4">
              Accessing third-party links is <strong>at your own risk</strong>. Review their terms and privacy policies before use. Links to company career pages or official sites are informational only and don&apos;t imply partnership or affiliation.
            </p>
          </Section>

          <Section id="disputes" title="15. Dispute Resolution">
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Governing Law</h3>
            <p className="text-[#cbd5e1] mb-4">
              These Terms are governed by the <strong>laws of India</strong>, without regard to conflict of law principles.
            </p>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Jurisdiction</h3>
            <p className="text-[#cbd5e1] mb-4">
              Any disputes arising from these Terms or the Service shall be subject to the <strong>exclusive jurisdiction of the courts in [Your City], India</strong>.
            </p>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Informal Resolution</h3>
            <p className="text-[#cbd5e1] mb-2">Before filing any legal action, you agree to:</p>
            <ol className="list-decimal list-inside space-y-1 text-[#cbd5e1] mb-4">
              <li>Contact us at legal@asktaaza.com</li>
              <li>Describe the dispute in detail</li>
              <li>Give us 30 days to attempt resolution</li>
              <li>Participate in good-faith negotiations</li>
            </ol>
            <p className="text-[#cbd5e1] mb-4">
              For disputes not resolved informally, both parties may agree to binding arbitration under the Indian Arbitration and Conciliation Act, 1996.
            </p>
            <p className="text-[#cbd5e1] font-medium">
              You agree to bring claims against AskTaaza only in your individual capacity, <strong>not as part of a class action or representative proceeding</strong>.
            </p>
          </Section>

          <Section id="changes" title="16. Changes to Terms">
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Our Right to Modify</h3>
            <p className="text-[#cbd5e1] mb-4">
              We reserve the right to modify these Terms at any time. Changes may be necessary due to: new features or services; legal or regulatory requirements; user feedback and improvements; business model changes.
            </p>
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Notice of Changes</h3>
            <p className="text-[#cbd5e1] mb-2">When we modify these Terms:</p>
            <ul className="list-disc list-inside space-y-1 text-[#cbd5e1] mb-4">
              <li>We&apos;ll update the &quot;Effective Date&quot; at the top</li>
              <li>We&apos;ll post the updated Terms on this page</li>
              <li>For material changes, we&apos;ll provide prominent notice on the Service</li>
              <li>If you have an email on file, we&apos;ll notify you</li>
            </ul>
            <p className="text-[#cbd5e1] mb-4">
              Continued use of the Service after changes constitutes your <strong>acceptance</strong> of the modified Terms. If you disagree with changes, you must stop using the Service. We encourage you to review these Terms periodically.
            </p>
          </Section>

          <Section id="general" title="17. General Provisions">
            <ul className="space-y-2 text-[#cbd5e1] text-sm">
              <li><strong>Entire Agreement</strong>: These Terms, together with our Privacy Policy, constitute the entire agreement between you and AskTaaza regarding the Service.</li>
              <li><strong>Severability</strong>: If any provision is found invalid or unenforceable, the remaining provisions remain in full force and effect.</li>
              <li><strong>No Waiver</strong>: Our failure to enforce any right or provision does not constitute a waiver.</li>
              <li><strong>Assignment</strong>: You may not assign or transfer these Terms without our written consent. We may assign these Terms at any time without notice.</li>
              <li><strong>Force Majeure</strong>: We are not liable for failure or delay due to circumstances beyond our reasonable control.</li>
              <li><strong>Headings</strong>: Section headings are for convenience only and do not affect interpretation.</li>
              <li><strong>Language</strong>: In case of conflict between English and translated versions, the English version prevails.</li>
              <li><strong>Survival</strong>: Sections that by their nature should survive termination (warranties, liability, indemnification, disputes) will survive any termination of these Terms.</li>
            </ul>
          </Section>

          <Section id="contact" title="18. Contact Information">
            <h3 className="text-[#f1f5f9] font-medium mt-4 mb-2">Questions or Concerns?</h3>
            <p className="text-[#cbd5e1]">
              If you have questions about these Terms, please contact us:<br />
              <strong>General Support</strong>: hello@asktaaza.com<br />
              <strong>Response Time</strong>: Within 48–72 hours
            </p>
          </Section>

          <div className="mt-12 p-6 rounded-lg bg-[#1e293b] border border-[#334155]">
            <h3 className="text-lg font-semibold text-[#f1f5f9] mb-4">Summary in Plain English</h3>
            <p className="text-[#cbd5e1] text-sm mb-4 font-medium">Key Takeaways:</p>
            <ul className="space-y-2 text-[#cbd5e1] text-sm mb-4">
              <li>✅ You must be 18+ to use AskTaaza</li>
              <li>✅ Don&apos;t post fake questions, spam, or violate NDAs</li>
              <li>✅ You own your content but give us license to display it publicly</li>
              <li>✅ The Service is provided &quot;as is&quot; — no guarantees about accuracy or interview success</li>
              <li>✅ We&apos;re not liable for interview outcomes or inaccurate information</li>
              <li>✅ We can remove content or ban users who violate these Terms</li>
              <li>✅ Currently free, but we may introduce paid features with notice</li>
              <li>✅ Disputes governed by Indian law, jurisdiction in [Your City]</li>
              <li>✅ We can modify these Terms; continued use = acceptance</li>
            </ul>
            <p className="text-[#94a3b8] text-sm mb-4">
              <strong>Bottom Line</strong>: Be honest, be respectful, don&apos;t violate NDAs, and use the platform at your own discretion. We provide a community platform but don&apos;t guarantee interview success.
            </p>
          </div>

          <div className="mt-8 p-6 rounded-lg border border-[#334155] bg-[#1e293b]">
            <p className="text-[#f1f5f9] font-semibold mb-2">
              BY USING ASKTAAZA, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE.
            </p>
          </div>

          <p className="mt-8 text-[#64748b] text-xs">
            These Terms of Service are effective as of January 30, 2026 and were last updated on January 30, 2026.
            <br />
            For the current version of these Terms, please visit: asktaaza.com/terms
          </p>
        </article>
      </div>
    </div>
  );
}
