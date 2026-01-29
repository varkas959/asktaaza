"use client";

export function WeeklyDigest() {
  // Placeholder data - in real app, this would come from analytics
  const trendingTopics = [
    { topic: "System Design", count: 45, change: "+12%" },
    { topic: "Java Collections", count: 38, change: "+8%" },
    { topic: "React Hooks", count: 32, change: "+5%" },
    { topic: "Database Optimization", count: 28, change: "+15%" },
    { topic: "Graph Algorithms", count: 24, change: "+3%" },
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Trending Interview Topics This Week
        </h2>
        <span className="text-xs text-gray-500">Updated weekly</span>
      </div>

      <div className="space-y-3">
        {trendingTopics.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                {index + 1}
              </span>
              <span className="text-sm font-medium text-gray-900">{item.topic}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">{item.count} questions</span>
              <span className="text-xs font-medium text-green-600">{item.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4">
        <p className="text-xs text-gray-500">
          Weekly digest emails coming soon. Subscribe to get insights delivered to your inbox.
        </p>
      </div>
    </div>
  );
}