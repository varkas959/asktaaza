import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">404</h1>
        <p className="mt-2 text-lg text-gray-600">Question not found</p>
        <Link
          href="/"
          className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
        >
          ← Back to all questions
        </Link>
      </div>
    </div>
  );
}