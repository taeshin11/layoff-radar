"use client";
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import CompanyCard from "@/components/CompanyCard";
import { Search } from "lucide-react";
import type { Company } from "@/lib/data";

interface CompaniesClientProps {
  companies: Company[];
  locale: string;
}

export default function CompaniesClient({ companies, locale }: CompaniesClientProps) {
  const t = useTranslations("filter");
  const searchParams = useSearchParams();
  const initialQ = searchParams?.get("q") || "";

  const sectors = Array.from(new Set(companies.map((c) => c.sector))).sort();
  const [query, setQuery] = useState(initialQ);
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filtered = useMemo(() => {
    return companies
      .filter((c) => {
        const matchQ = query ? c.name.toLowerCase().includes(query.toLowerCase()) : true;
        const matchSector = selectedSector !== "all" ? c.sector === selectedSector : true;
        const matchStatus = selectedStatus !== "all" ? c.hiringStatus === selectedStatus : true;
        return matchQ && matchSector && matchStatus;
      })
      .sort((a, b) => b.totalLayoffs - a.totalLayoffs);
  }, [companies, query, selectedSector, selectedStatus]);

  return (
    <>
      {/* Filters */}
      <div className="bg-white rounded-xl border border-rose-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-rose-400" />
          <input
            type="search"
            placeholder="Search companies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-3 py-2 text-sm rounded-lg border border-rose-200 bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-400 w-full"
          />
        </div>
        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="text-sm border border-rose-200 rounded-lg px-3 py-2 bg-white text-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
        >
          <option value="all">{t("allSectors")}</option>
          {sectors.map((s) => (
            <option key={s} value={s}>{s.replace(/-/g, " ")}</option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="text-sm border border-rose-200 rounded-lg px-3 py-2 bg-white text-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
        >
          <option value="all">All Status</option>
          <option value="hiring">🟢 Hiring</option>
          <option value="freeze">🟡 Freeze</option>
          <option value="layoffs">🔴 Layoffs</option>
        </select>
        <button
          onClick={() => { setQuery(""); setSelectedSector("all"); setSelectedStatus("all"); }}
          className="text-sm text-rose-500 hover:text-rose-700 px-3 py-2 rounded-lg border border-rose-200 hover:bg-rose-50"
        >
          {t("clear")}
        </button>
      </div>

      <p className="text-sm text-rose-400 mb-4">{filtered.length} companies</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <CompanyCard key={c.slug} company={c} locale={locale} />
        ))}
      </div>
    </>
  );
}
