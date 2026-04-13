"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import StatusBadge from "./StatusBadge";
import { formatCount, formatDate } from "@/lib/data";
import type { LayoffEvent } from "@/lib/data";

interface LayoffTableProps {
  events: LayoffEvent[];
}

export default function LayoffTable({ events }: LayoffTableProps) {
  const t = useTranslations("feed");
  const tCommon = useTranslations("common");
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  if (events.length === 0) {
    return <p className="text-center text-rose-400 py-12">{t("noResults")}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-rose-100 shadow-sm">
      <table className="w-full text-sm bg-white">
        <thead>
          <tr className="border-b border-rose-100 bg-rose-50">
            <th className="text-left px-4 py-3 font-semibold text-rose-700">{tCommon("company")}</th>
            <th className="text-left px-4 py-3 font-semibold text-rose-700">{tCommon("date")}</th>
            <th className="text-right px-4 py-3 font-semibold text-rose-700">{tCommon("count")}</th>
            <th className="text-left px-4 py-3 font-semibold text-rose-700 hidden sm:table-cell">{t("sector")}</th>
            <th className="text-left px-4 py-3 font-semibold text-rose-700 hidden md:table-cell">Status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b border-rose-50 hover:bg-rose-50/40 transition-colors">
              <td className="px-4 py-3 font-medium text-rose-900">{event.company}</td>
              <td className="px-4 py-3 text-rose-500 whitespace-nowrap">{formatDate(event.date)}</td>
              <td className="px-4 py-3 text-right font-bold text-rose-600">
                {formatCount(event.count)}
                {event.percentage > 0 && (
                  <span className="ml-1 text-xs text-rose-400">({event.percentage}%)</span>
                )}
              </td>
              <td className="px-4 py-3 text-rose-500 hidden sm:table-cell capitalize">
                {event.sector.replace(/-/g, " ")}
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <StatusBadge status={event.hiringStatus} size="sm" />
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/${locale}/companies/${event.slug}`}
                  className="text-xs font-medium text-rose-600 hover:text-rose-800 transition-colors whitespace-nowrap"
                >
                  {t("viewCompany")} →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
