"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import StatusBadge from "./StatusBadge";
import { formatCount, formatDate } from "@/lib/data";
import type { Company } from "@/lib/data";

interface CompanyCardProps {
  company: Company;
  locale: string;
}

export default function CompanyCard({ company, locale }: CompanyCardProps) {
  const t = useTranslations("feed");
  return (
    <div className="bg-white rounded-xl shadow-sm border border-rose-100 p-4 hover:shadow-md transition-shadow fade-in-up">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-rose-900 text-base">{company.name}</h3>
          <p className="text-xs text-rose-400 mt-0.5 capitalize">{company.sector.replace(/-/g, " ")}</p>
        </div>
        <StatusBadge status={company.hiringStatus} size="sm" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-rose-600">{formatCount(company.totalLayoffs)}</p>
          <p className="text-xs text-rose-400">{t("jobsCut")}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-rose-400">Last: {formatDate(company.lastLayoffDate)}</p>
          <Link
            href={`/${locale}/companies/${company.slug}`}
            className="mt-1 inline-block text-xs font-medium text-rose-600 hover:text-rose-800 transition-colors"
          >
            {t("viewCompany")} →
          </Link>
        </div>
      </div>
    </div>
  );
}
