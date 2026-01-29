"use client";

// Google Analytics 4 tracking utilities

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

// Track page view
export const pageview = (url: string) => {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "", {
    page_path: url,
  });
};

// Track custom event
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track question view
export const questionView = (questionId: string, company?: string, skill?: string) => {
  event({
    action: "view_question",
    category: "Question",
    label: questionId,
  });

  if (company) {
    event({
      action: "view_question_company",
      category: "Question",
      label: company,
    });
  }

  if (skill) {
    event({
      action: "view_question_skill",
      category: "Question",
      label: skill,
    });
  }
};

// Track question submission
export const questionSubmit = (questionCount: number, company?: string) => {
  event({
    action: "submit_question",
    category: "Submission",
    label: company || "unknown",
    value: questionCount,
  });
};

// Track filter usage
export const filterApplied = (filterType: string, filterValue: string) => {
  event({
    action: "apply_filter",
    category: "Filter",
    label: `${filterType}: ${filterValue}`,
  });
};

// Track share action
export const shareQuestion = (platform: string, questionId: string) => {
  event({
    action: "share_question",
    category: "Share",
    label: `${platform}: ${questionId}`,
  });
};
