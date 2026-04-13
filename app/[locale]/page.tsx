import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoffTable from "@/components/LayoffTable";
import LayoffChart from "@/components/LayoffChart";
import SectorChart from "@/components/SectorChart";
import StatusBadge from "@/components/StatusBadge";
import {
  getRecentLayoffs,
  getYTDTotal,
  getMonthlyTotals,
  getSectorTotals,
  getCompanies,
  formatCount,
} from "@/lib/data";
import { routing } from "@/i18n/routing";

export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  const tFeed = await getTranslations({ locale, namespace: "feed" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const recentLayoffs = getRecentLayoffs(25);
  const ytdTotal = getYTDTotal(2024);
  const monthlyTotals = getMonthlyTotals();
  const sectorTotals = getSectorTotals();
  const hiringCompanies = getCompanies()
    .filter((c) => c.hiringStatus === "hiring")
    .slice(0, 6);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LayoffRadar",
    url: "https://layoff-radar.vercel.app",
    description: t("subtitle"),
    potentialAction: {
      "@type": "SearchAction",
      target: `https://layoff-radar.vercel.app/${locale}/companies?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many tech layoffs happened in 2024?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `In 2024, major tech companies cut over ${formatCount(ytdTotal)} employees across dozens of rounds of layoffs.`,
        },
      },
      {
        "@type": "Question",
        name: "Which tech companies are still hiring in 2025?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Companies like ${hiringCompanies.map((c) => c.name).join(", ")} are actively hiring as of 2025 according to LayoffRadar data.`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Hero */}
        <section className="text-center py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-rose-800 mb-3">
            {t("title")}
          </h1>
          <p className="text-rose-500 text-lg mb-8">{t("subtitle")}</p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-white rounded-xl border border-rose-100 shadow-sm px-8 py-5 min-w-[160px]">
              <p className="text-4xl font-extrabold text-rose-600">{formatCount(ytdTotal)}</p>
              <p className="text-sm text-rose-400 mt-1">{t("ytdTotal")}</p>
            </div>
            <div className="bg-white rounded-xl border border-rose-100 shadow-sm px-8 py-5 min-w-[160px]">
              <p className="text-4xl font-extrabold text-rose-600">{recentLayoffs.length}+</p>
              <p className="text-sm text-rose-400 mt-1">{t("eventsTracked")}</p>
            </div>
            <div className="bg-white rounded-xl border border-rose-100 shadow-sm px-8 py-5 min-w-[160px]">
              <p className="text-4xl font-extrabold text-emerald-600">{hiringCompanies.length}</p>
              <p className="text-sm text-rose-400 mt-1">Still Hiring</p>
            </div>
          </div>

          {/* Adsterra Native Banner placeholder */}
          <div id="adsterra-native-banner" aria-hidden="true" className="w-full my-6 min-h-[90px] bg-rose-50 rounded-xl flex items-center justify-center text-xs text-rose-200">
            {/* Native Banner Ad */}
          </div>
        </section>

        {/* Monthly Chart */}
        <section className="mb-10">
          <div className="bg-white rounded-xl border border-rose-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-rose-800 mb-4">Monthly Layoff Trend</h2>
            <LayoffChart data={monthlyTotals} />
          </div>
        </section>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Sector breakdown */}
          <div className="bg-white rounded-xl border border-rose-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-rose-800 mb-4">Sector Breakdown</h2>
            <SectorChart data={sectorTotals} />
          </div>

          {/* Still Hiring */}
          <div className="bg-white rounded-xl border border-rose-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-rose-800 mb-4">🟢 Still Hiring</h2>
            <div className="space-y-3">
              {hiringCompanies.map((c) => (
                <div key={c.slug} className="flex items-center justify-between">
                  <Link
                    href={`/${locale}/companies/${c.slug}`}
                    className="font-medium text-rose-800 hover:text-rose-600 transition-colors"
                  >
                    {c.name}
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-rose-400 capitalize">{c.sector.replace(/-/g, " ")}</span>
                    <StatusBadge status={c.hiringStatus} size="sm" />
                  </div>
                </div>
              ))}
              <Link
                href={`/${locale}/companies`}
                className="block text-center mt-4 text-sm font-medium text-rose-600 hover:text-rose-800"
              >
                {tNav("companies")} →
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Layoffs Feed */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-rose-800 mb-4">{tFeed("recentLayoffs")}</h2>
          <LayoffTable events={recentLayoffs} />

          {/* Adsterra Display Banner placeholder */}
          <div id="adsterra-display-banner" className="flex justify-center my-8">
            <div className="w-full max-w-2xl min-h-[90px] bg-rose-50 rounded-xl flex items-center justify-center text-xs text-rose-200">
              {/* Display Banner Ad */}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
