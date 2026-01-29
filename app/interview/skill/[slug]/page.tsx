import { notFound } from "next/navigation";
import { getSkillQuestions } from "@/app/actions/seo";
import { QuestionCard } from "@/components/QuestionCard";
import { sortQuestionsByRank } from "@/lib/ranking";
import type { Metadata } from "next";

interface SkillPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SkillPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getSkillQuestions(slug);

  if (!result.success || result.data.length === 0) {
    return {
      title: "Skill Not Found | AskTaaza",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const skillName = result.skillName;
  const questionCount = result.data.length;
  const title = `${skillName} Interview Questions | Technical Interview Prep`;
  const description = `Browse ${questionCount}+ recent ${skillName} interview questions. Real technical questions from actual interviews.`;

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

export default async function SkillPage({ params }: SkillPageProps) {
  const { slug } = await params;
  const result = await getSkillQuestions(slug);

  if (!result.success || result.data.length === 0) {
    notFound();
  }

  const skillName = result.skillName;
  const rankedQuestions = sortQuestionsByRank(result.data);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-semibold text-gray-900">
            {skillName} Interview Questions
          </h1>
          <p className="text-base text-gray-600">
            Recent technical interview questions about {skillName}
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