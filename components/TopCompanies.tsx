"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTopCompanies } from "@/app/actions/questions";

interface Company {
  name: string;
  discussions: number;
}

export function TopCompanies() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const result = await getTopCompanies();
        if (result.success && result.data) {
          setCompanies(result.data);
        }
      } catch (error) {
        console.error("Error fetching top companies:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  // If no data, show placeholder companies
  const displayCompanies = companies.length > 0 ? companies : [
    { name: "Google", discussions: 0 },
    { name: "Microsoft", discussions: 0 },
    { name: "Amazon", discussions: 0 },
  ];

  const handleCompanyClick = (companyName: string) => {
    // Scroll to top first
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Then navigate
    router.push(`/?company=${encodeURIComponent(companyName)}`);
  };

  const handleSeeAll = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push("/companies");
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-[#1e293b] border border-[#334155] p-3 mt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="h-3 w-20 bg-[#334155] rounded animate-pulse"></div>
          <div className="h-3 w-10 bg-[#334155] rounded animate-pulse"></div>
        </div>
        <div className="space-y-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-7 bg-[#334155] rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-[#1e293b] border border-[#334155] p-3 mt-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-[#f1f5f9]">Top Companies</h3>
        <button 
          onClick={handleSeeAll}
          className="text-[11px] text-[#3b82f6] hover:text-[#60a5fa] cursor-pointer"
        >
          See all
        </button>
      </div>
      <div className="space-y-1.5">
        {displayCompanies.map((company, index) => (
          <button
            key={index}
            onClick={() => handleCompanyClick(company.name)}
            className="w-full text-left px-2.5 py-1.5 rounded bg-[#0f172a] hover:bg-[#334155] transition-colors flex items-center justify-between cursor-pointer"
          >
            <span className="text-xs text-[#f1f5f9]">{company.name}</span>
            <span className="text-[10px] text-[#64748b]">{company.discussions}</span>
          </button>
        ))}
      </div>
      {companies.length === 0 && !loading && (
        <p className="text-[10px] text-[#64748b] mt-2 text-center">
          No company data yet.
        </p>
      )}
    </div>
  );
}
