import { notFound } from "next/navigation";
import { getCompanyQuestions } from "@/app/actions/seo";
import { QuestionCard } from "@/components/QuestionCard";
import { sortQuestionsByRank } from "@/lib/ranking";
import type { Metadata } from "next";

interface CompanyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCompanyQuestions(slug);

  if (!result.success || result.data.length === 0) {
    return {
      title: "Company Not Found | AskTaaza",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const companyName = result.companyName;
  const questionCount = result.data.length;
  const title = `${companyName} Interview Questions | Recent Questions from ${companyName} Candidates`;
  const description = `Browse ${questionCount}+ recent interview questions asked at ${companyName}. Real questions from actual interviews to help you prepare.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  const result = await getCompanyQuestions(slug);

  if (!result.success || result.data.length === 0) {
    notFound();
  }

  const companyName = result.companyName;
  const rankedQuestions = sortQuestionsByRank(result.data);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-semibold text-gray-900">
            {companyName} Interview Questions
          </h1>
          <p className="text-base text-gray-600">
            Recent interview questions from {companyName} candidates
          </p>
        </div>

        <div className="space-y-5">
          {rankedQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      </div>
    </div>
  );
}