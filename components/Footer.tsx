"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TrendingDown } from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const [visits, setVisits] = useState<{ today: number; total: number } | null>(null);

  useEffect(() => {
    fetch("/api/visits")
      .then((r) => r.json())
      .then((d) => setVisits(d))
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-white border-t border-rose-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-rose-700 font-bold">
            <TrendingDown className="w-4 h-4" />
            <span>LayoffRadar</span>
          </div>
          <p className="text-xs text-rose-400 text-center">{t("disclaimer")}</p>
          <div className="flex items-center gap-4 text-xs text-rose-300">
            {visits && (
              <span>
                {t("todayVisits")}: {visits.today.toLocaleString()} | {t("totalVisits")}: {visits.total.toLocaleString()}
              </span>
            )}
            <span>{t("copyright")}</span>
          </div>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-xs text-rose-400">
          <Link href={`/${locale}/about`} className="hover:text-rose-600 transition-colors">About</Link>
          <Link href={`/${locale}/how-to-use`} className="hover:text-rose-600 transition-colors">How to Use / FAQ</Link>
          <Link href={`/${locale}/privacy`} className="hover:text-rose-600 transition-colors">Privacy Policy</Link>
          <Link href={`/${locale}/terms`} className="hover:text-rose-600 transition-colors">Terms of Use</Link>
        </nav>
      </div>
    </footer>
  );
}
