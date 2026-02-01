import { notFound } from "next/navigation";
import { getQuestionById } from "@/app/actions/questions";
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";
import { ShareQuestion } from "@/components/ShareQuestion";
import { generateSlug } from "@/lib/seo-utils";
import { formatQuestions } from "@/lib/question-format";
import type { Question } from "@/types";
import type { Metadata } from "next";

interface QuestionDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: QuestionDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getQuestionById(id);

  if (!result.success || !result.data) {
    return {
      title: "Question Not Found | AskTaaza",
    };
  }

  const question = result.data;
  const title = `${question.content.substring(0, 60)}... | ${question.company} Interview Question`;
  const description = `Interview question asked at ${question.company}${question.skill ? ` for ${question.skill} position` : ""}. ${question.content.substring(0, 150)}...`;

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
  };
}

export default async function QuestionDetailPage({ params }: QuestionDetailPageProps) {
  const { id } = await params;
  const result = await getQuestionById(id);

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
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to all questions
        </Link>

        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              {question.company && (
                <Link
                  href={`/interview/company/${companySlug}`}
                  className="font-medium text-gray-900 hover:text-gray-700 hover:underline"
                >
                  {question.company}
                </Link>
              )}
              {skillSlug && question.skill && (
                <>
                  <span>•</span>
                  <Link
                    href={`/interview/skill/${skillSlug}`}
                    className="hover:text-gray-700 hover:underline"
                  >
                    {question.skill}
                  </Link>
                </>
              )}
              {experienceSlug && question.experienceLevel && (
                <>
                  <span>•</span>
                  <Link
                    href={`/interview/experience/${experienceSlug}`}
                    className="hover:text-gray-700 hover:underline"
                  >
                    {question.experienceLevel}
                  </Link>
                </>
              )}
            </div>
          <ShareQuestion
            questionId={question.id}
            questionContent={question.content}
            company={question.company}
            skill={question.skill}
          />
          </div>

          <div className="mb-6">
            <ol className="mb-4 list-decimal list-inside space-y-2 text-gray-900">
              {formatQuestions(question.content).map((q, i) => (
                <li key={i} className="text-base leading-relaxed">
                  {q}
                </li>
              ))}
            </ol>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {question.round && (
                <>
                  <span>Round: {roundLabels[question.round] || question.round}</span>
                  {question.category && (
                    <>
                      <span>•</span>
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                        {question.category}
                      </span>
                    </>
                  )}
                </>
              )}
              {question.source && (
                <>
                  <span>•</span>
                  <span>
                    {question.source === "direct" ? "Asked directly to me" : "Asked to another candidate"}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
              <span>
                Interview: {new Date(question.interviewDate).toLocaleDateString()}
              </span>
              <span>•</span>
              <span>Posted {timeAgo}</span>
              {hoursAgo < 24 && (
                <>
                  <span>•</span>
                  <span className="font-medium text-green-600">Asked {hoursAgo} hour{hoursAgo !== 1 ? "s" : ""} ago</span>
                </>
              )}
              {question.updatedAt && question.updatedAt !== question.createdAt && (
                <>
                  <span>•</span>
                  <span>Last updated: {format(new Date(question.updatedAt), "MMM d, yyyy")}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}