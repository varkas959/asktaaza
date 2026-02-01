import { notFound } from "next/navigation";
import { getQuestionBySlug } from "@/app/actions/seo";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ShareQuestion } from "@/components/ShareQuestion";
import { generateSlug } from "@/lib/seo-utils";
import { formatQuestions } from "@/lib/question-format";
import type { Question } from "@/types";
import type { Metadata } from "next";

interface QuestionPageProps {
  params: Promise<{
    company: string;
    skill: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: QuestionPageProps): Promise<Metadata> {
  const { company, skill, slug } = await params;
  const result = await getQuestionBySlug(company, skill, slug);

  if (!result.success || !result.data) {
    return {
      title: "Question Not Found | AskTaaza",
    };
  }

  const question = result.data;
  const title = `${question.content.substring(0, 60)}... | ${question.company} Interview Question`;
  const description = `Interview question asked at ${question.company} for ${skill || "software engineering"} position. ${question.content.substring(0, 150)}...`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: question.createdAt?.toISOString(),
      modifiedTime: question.updatedAt?.toISOString(),
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function QuestionSlugPage({ params }: QuestionPageProps) {
  const { company, skill, slug } = await params;
  const result = await getQuestionBySlug(company, skill, slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const question: Question = result.data;
  const timeAgo = question.createdAt
    ? formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })
    : "";
  
  const hoursAgo = question.createdAt
    ? Math.floor((Date.now() - new Date(question.createdAt).getTime()) / (1000 * 60 * 60))
    : 0;

  const roundLabels: Record<string, string> = {
    phone: "Phone Screen",
    onsite: "Onsite",
    technical: "Technical",
    behavioral: "Behavioral",
    system_design: "System Design",
    other: "Other",
  };

  // Generate SEO-friendly links
  const companySlug = generateSlug(question.company);
  const skillSlug = question.skill ? generateSlug(question.skill) : null;
  const experienceSlug = question.experienceLevel ? generateSlug(question.experienceLevel) : null;

  // QAPage Schema
  const qaPageSchema = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: question.content,
      text: question.content,
      dateCreated: question.createdAt?.toISOString(),
      author: {
        "@type": "Organization",
        name: "AskTaaza",
      },
      acceptedAnswer: {
        "@type": "Answer",
        text: `This interview question was asked at ${question.company}${question.skill ? ` for a ${question.skill} position` : ""}${question.experienceLevel ? ` (${question.experienceLevel} experience)` : ""}.`,
        dateCreated: question.createdAt?.toISOString(),
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(qaPageSchema) }}
      />
      <div className="min-h-screen bg-[#0f172a]">
        {/* Navigation */}
        <nav className="sticky top-0 z-30 border-b border-[#334155] bg-[#0f172a]">
          <div className="mx-auto max-w-4xl px-4 py-4">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-[#3b82f6] text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-[#f1f5f9]">AskTaaza</span>
            </Link>
          </div>
        </nav>

        <div className="mx-auto max-w-4xl px-4 py-6">
          {/* Breadcrumb */}
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-[#94a3b8]">
            {question.company && (
              <Link
                href={`/?company=${encodeURIComponent(question.company)}`}
                className="font-medium text-[#f1f5f9] hover:text-[#3b82f6]"
              >
                {question.company}
              </Link>
            )}
            {question.skill && (
              <>
                <span>•</span>
                <Link
                  href={`/?skill=${encodeURIComponent(question.skill)}`}
                  className="hover:text-[#3b82f6]"
                >
                  {question.skill}
                </Link>
              </>
            )}
            {question.experienceLevel && (
              <>
                <span>•</span>
                <span>{question.experienceLevel}</span>
              </>
            )}
            <div className="ml-auto">
              <ShareQuestion
                questionId={question.id}
                questionContent={question.content}
                company={question.company}
                skill={question.skill}
              />
            </div>
          </div>

          {/* Question Content - numbered list like homepage */}
          <div className="rounded-lg border border-[#334155] bg-[#1e293b] p-6">
            <ol className="mb-4 space-y-1.5">
              {formatQuestions(question.content).map((q, i) => (
                <li
                  key={i}
                  className="text-sm text-[#e2e8f0] leading-relaxed flex gap-2"
                >
                  <span className="text-[#64748b] flex-shrink-0">{i + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ol>

            <div className="flex flex-wrap items-center gap-3 text-sm text-[#94a3b8] mb-4">
              {question.round && (
                <span className="px-2.5 py-1 rounded bg-[#334155] text-xs">
                  {roundLabels[question.round] || question.round}
                </span>
              )}
              {question.category && (
                <span className="px-2.5 py-1 rounded bg-[#334155] text-xs">
                  {question.category}
                </span>
              )}
              {question.source && (
                <span className="text-xs">
                  {question.source === "direct" ? "Asked directly to me" : "Asked to another candidate"}
                </span>
              )}
            </div>

            <div className="border-t border-[#334155] pt-4">
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748b]">
                <span>
                  Interview: {new Date(question.interviewDate).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>Posted {timeAgo}</span>
                {hoursAgo < 24 && (
                  <>
                    <span>•</span>
                    <span className="font-medium text-emerald-400">Fresh ({hoursAgo}h ago)</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[#3b82f6] hover:text-[#60a5fa]"
            >
              ← Back to all questions
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}