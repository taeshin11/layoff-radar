import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoffTable from "@/components/LayoffTable";
import SectorChart from "@/components/SectorChart";
import {
  getLayoffsByMonth,
  getAllMonths,
  getMonthName,
  formatCount,
} from "@/lib/data";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const months = getAllMonths();
  return routing.locales.flatMap((locale) =>
    months.map((m) => ({ locale, year: m.year, month: m.month }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; year: string; month: string }>;
}): Promise<Metadata> {
  const { year, month } = await params;
  const events = getLayoffsByMonth(year, month);
  const total = events.reduce((s, e) => s + e.count, 0);
  const monthName = getMonthName(month, year);
  return {
    title: `Tech Layoffs ${monthName} — ${events.length} Companies, ${total.toLocaleString()} Jobs Cut | LayoffRadar`,
    description: `In ${monthName}, ${events.length} tech companies cut ${total.toLocaleString()} jobs. See breakdown by sector and top companies.`,
  };
}

export default async function MonthPage({
  params,
}: {
  params: Promise<{ locale: string; year: string; month: string }>;
}) {
  const { locale, year, month } = await params;
  const t = await getTranslations({ locale, namespace: "month" });
  const events = getLayoffsByMonth(year, month);
  const total = events.reduce((s, e) => s + e.count, 0);
  const monthName = getMonthName(month, year);

  // Sector breakdown
  const sectorMap: Record<string, number> = {};
  events.forEach((e) => {
    sectorMap[e.sector] = (sectorMap[e.sector] || 0) + e.count;
  });
  const sectorData = Object.entries(sectorMap)
    .sort((a, b) => b[1] - a[1])
    .map(([sector, total]) => ({ sector, total }));

  // Top companies
  const companyMap: Record<string, number> = {};
  events.forEach((e) => {
    companyMap[e.company] = (companyMap[e.company] || 0) + e.count;
  });
  const topCompanies = Object.entries(companyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `Tech Layoffs ${monthName}`,
    description: `Layoff events in tech sector for ${monthName}`,
    temporalCoverage: `${year}-${month}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="text-sm text-rose-400 mb-4">
          <Link href={`/${locale}`} className="hover:text-rose-600">Home</Link>
          {" / "}
          <span className="text-rose-700">{monthName}</span>
        </nav>

        <h1 className="text-2xl font-extrabold text-rose-800 mb-6">
          Tech Layoffs: {monthName}
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-rose-100 shadow-sm p-5 text-center">
            <p className="text-3xl font-extrabold text-rose-600">{formatCount(total)}</p>
            <p className="text-xs text-rose-400 mt-1">{t("totalCut")}</p>
          </div>
          <div className="bg-white rounded-xl border border-rose-100 shadow-sm p-5 text-center">
            <p className="text-3xl font-extrabold text-rose-600">{events.length}</p>
            <p className="text-xs text-rose-400 mt-1">{t("eventsThisMonth")}</p>
          </div>
          <div className="bg-white rounded-xl border border-rose-100 shadow-sm p-5 text-center col-span-2 sm:col-span-1">
            <p className="text-3xl font-extrabold text-rose-600">{sectorData.length}</p>
            <p className="text-xs text-rose-400 mt-1">Sectors affected</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sector pie */}
          {sectorData.length > 0 && (
            <div className="bg-white rounded-xl border border-rose-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-rose-800 mb-4">{t("sectorBreakdown")}</h2>
              <SectorChart data={sectorData} />
            </div>
          )}

          {/* Top companies */}
          <div className="bg-white rounded-xl border border-rose-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-rose-800 mb-4">{t("topCompanies")}</h2>
            <ol className="space-y-2">
              {topCompanies.map(([company, count], i) => (
                <li key={company} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-rose-800 font-medium text-sm">{company}</span>
                  </span>
                  <span className="font-bold text-rose-600">{formatCount(count)}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Events list */}
        <h2 className="text-xl font-bold text-rose-800 mb-4">All Events</h2>
        <LayoffTable events={events} />
      </main>
      <Footer />
    </>
  );
}
