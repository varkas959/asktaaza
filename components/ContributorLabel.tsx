"use client";

import { useEffect, useState } from "react";
import { getContributorType } from "@/lib/trust-score";
import { Tooltip } from "./Tooltip";

export function ContributorLabel() {
  const [contributorType, setContributorType] = useState<"trusted" | "new">("new");

  useEffect(() => {
    setContributorType(getContributorType());
  }, []);

  if (contributorType === "trusted") {
    return (
      <Tooltip content="This contributor has a history of reliable submissions.">
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Trusted Contributor
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip content="This is a new contributor. Verify information carefully.">
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
        New Contributor
      </span>
    </Tooltip>
  );
}