import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatusBadge from "@/components/StatusBadge";
import LayoffTable from "@/components/LayoffTable";
import LayoffChart from "@/components/LayoffChart";
import {
  getSectorBySlug,
  getLayoffsBySector,
  getCompanies,
  getSectors,
  formatCount,
} from "@/lib/data";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const sectors = getSectors();
  return routing.locales.flatMap((locale) =>
    sectors.map((s) => ({ locale, slug: s.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sector = getSectorBySlug(slug);
  if (!sector) return {};
  return {
    title: `${sector.name} Layoffs 2025 — Tracker & Hiring Signals | LayoffRadar`,
    description: `Track layoffs and hiring signals in the ${sector.name} sector. See all layoff events and which companies are still hiring.`,
  };
}

export default async function SectorPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const sector = getSectorBySlug(slug);
  if (!sector) notFound();

  const t = await getTranslations({ locale, namespace: "sector" });
  const events = getLayoffsBySector(slug);
  const totalLayoffs = events.reduce((s, e) => s + e.count, 0);

  // Monthly data for this sector
  const monthMap: Record<string, number> = {};
  events.forEach((e) => {
    const key = e.date.slice(0, 7);
    monthMap[key] = (monthMap[key] || 0) + e.count;
  });
  const monthlyData = Object.entries(monthMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, total]) => ({ month, total }));

  const companies = getCompanies().filter((c) => sector.companies.includes(c.slug));
  const hiringCompanies = companies.filter((c) => c.hiringStatus === "hiring");

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="text-sm text-rose-400 mb-4">
          <Link href={`/${locale}/sectors`} className="hover:text-rose-600">Sectors</Link>
          {" / "}
          <span className="text-rose-700">{sector.name}</span>
        </nav>

        <div className="bg-white rounded-xl border border-rose-100 shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-extrabold text-rose-900 mb-4">{sector.name} Sector</h1>
          <div className="flex gap-8">
            <div>
              <p className="text-3xl font-extrabold text-rose-600">{formatCount(totalLayoffs)}</p>
              <p className="text-xs text-rose-400">{t("totalLayoffs")}</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-rose-600">{events.length}</p>
              <p className="text-xs text-rose-400">{t("allEvents")}</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-600">{hiringCompanies.length}</p>
              <p className="text-xs text-rose-400">{t("stillHiring")}</p>
            </div>
          </div>
        </div>

        {/* Trend chart */}
        {monthlyData.length > 0 && (
          <div className="bg-white rounded-xl border border-rose-100 shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-rose-800 mb-4">{t("trendLine")}</h2>
            <LayoffChart data={monthlyData} />
          </div>
        )}

        {/* Still hiring */}
        {hiringCompanies.length > 0 && (
          <div className="bg-white rounded-xl border border-rose-100 shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-rose-800 mb-4">🟢 {t("stillHiring")}</h2>
            <div className="flex flex-wrap gap-3">
              {hiringCompanies.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${locale}/companies/${c.slug}`}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  <span className="font-medium text-emerald-800 text-sm">{c.name}</span>
                  <StatusBadge status={c.hiringStatus} size="sm" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Events */}
        <div>
          <h2 className="text-xl font-bold text-rose-800 mb-4">{t("allEvents")}</h2>
          <LayoffTable events={events} />
        </div>
      </main>
      <Footer />
    </>
  );
}
