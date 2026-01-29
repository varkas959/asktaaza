import { notFound } from "next/navigation";
import { getExperienceQuestions } from "@/app/actions/seo";
import { QuestionCard } from "@/components/QuestionCard";
import { sortQuestionsByRank } from "@/lib/ranking";
import type { Metadata } from "next";

interface ExperiencePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ExperiencePageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getExperienceQuestions(slug);

  if (!result.success || result.data.length === 0) {
    return {
      title: "Experience Level Not Found | AskTaaza",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const experienceName = result.experienceName;
  const questionCount = result.data.length;
  const title = `${experienceName} Experience Interview Questions | AskTaaza`;
  const description = `Browse ${questionCount}+ interview questions for ${experienceName} experience level candidates.`;

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

export default async function ExperiencePage({ params }: ExperiencePageProps) {
  const { slug } = await params;
  const result = await getExperienceQuestions(slug);

  if (!result.success || result.data.length === 0) {
    notFound();
  }

  const experienceName = result.experienceName;
  const rankedQuestions = sortQuestionsByRank(result.data);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-semibold text-gray-900">
            {experienceName} Experience Interview Questions
          </h1>
          <p className="text-base text-gray-600">
            Recent interview questions for {experienceName} experience level
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