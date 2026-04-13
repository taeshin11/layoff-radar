import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatusBadge from "@/components/StatusBadge";
import LayoffChart from "@/components/LayoffChart";
import LayoffTable from "@/components/LayoffTable";
import {
  getCompanyBySlug,
  getLayoffsByCompany,
  getCompanies,
  getMonthlyTotals,
  formatCount,
  formatDate,
} from "@/lib/data";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const companies = getCompanies();
  return routing.locales.flatMap((locale) =>
    companies.map((c) => ({ locale, slug: c.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) return {};
  const t = await getTranslations({ locale, namespace: "company" });
  return {
    title: `${company.name} Layoffs 2025 — History & Hiring Signals | LayoffRadar`,
    description: `${company.name} has cut ${company.totalLayoffs.toLocaleString()} employees. See ${t("layoffHistory")}, ${t("hiringSignals")}, and ${t("relatedCompanies")}.`,
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) notFound();

  const t = await getTranslations({ locale, namespace: "company" });
  const events = getLayoffsByCompany(slug);

  // Build monthly data for this company's chart
  const monthMap: Record<string, number> = {};
  events.forEach((e) => {
    const key = e.date.slice(0, 7);
    monthMap[key] = (monthMap[key] || 0) + e.count;
  });
  const companyMonthlyData = Object.entries(monthMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, total]) => ({ month, total }));

  // Related companies in the same sector
  const relatedCompanies = getCompanies()
    .filter((c) => c.sector === company.sector && c.slug !== slug)
    .slice(0, 4);

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    event: events.map((e) => ({
      "@type": "Event",
      name: `${e.company} Layoffs ${e.date.slice(0, 7)}`,
      startDate: e.date,
      description: e.description,
    })),
  };

  const linkedinUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(company.name)}`;
  const indeedUrl = `https://www.indeed.com/jobs?q=${encodeURIComponent(company.name)}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="text-sm text-rose-400 mb-4">
          <Link href={`/${locale}/companies`} className="hover:text-rose-600">Companies</Link>
          {" / "}
          <span className="text-rose-700">{company.name}</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-xl border border-rose-100 shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-rose-900">{company.name}</h1>
              <p className="text-rose-400 capitalize mt-1">{company.sector.replace(/-/g, " ")}</p>
            </div>
            <StatusBadge status={company.hiringStatus} size="md" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-rose-600">{formatCount(company.totalLayoffs)}</p>
              <p className="text-xs text-rose-400 mt-1">{t("totalCut")}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold text-rose-600">{events.length}</p>
              <p className="text-xs text-rose-400 mt-1">{t("rounds")}</p>
            </div>
            <div className="text-center col-span-2 sm:col-span-1">
              <p className="text-sm font-semibold text-rose-600">{formatDate(company.lastLayoffDate)}</p>
              <p className="text-xs text-rose-400 mt-1">Last layoff</p>
            </div>
          </div>
        </div>

        {/* Layoff History Chart */}
        {companyMonthlyData.length > 0 && (
          <div className="bg-white rounded-xl border border-rose-100 shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-rose-800 mb-4">{t("layoffHistory")}</h2>
            <LayoffChart data={companyMonthlyData} />
          </div>
        )}

        {/* Event list */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-rose-800 mb-4">All Layoff Events</h2>
          <LayoffTable events={events} />
        </div>

        {/* Hiring signals */}
        <div className="bg-white rounded-xl border border-rose-100 shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-rose-800 mb-4">{t("hiringSignals")}</h2>
          <div className="flex flex-wrap gap-3">
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              {t("linkedinJobs")} →
            </a>
            <a
              href={indeedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors"
            >
              {t("indeedJobs")} →
            </a>
          </div>
          {events[0] && (
            <div className="mt-4 p-4 bg-rose-50 rounded-lg">
              <p className="text-sm text-rose-700">{events[0].description}</p>
              <a
                href={events[0].source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-rose-500 hover:text-rose-700 mt-2 inline-block"
              >
                Source →
              </a>
            </div>
          )}
        </div>

        {/* Related companies */}
        {relatedCompanies.length > 0 && (
          <div className="bg-white rounded-xl border border-rose-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-rose-800 mb-4">{t("relatedCompanies")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedCompanies.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${locale}/companies/${c.slug}`}
                  className="text-center p-3 rounded-lg border border-rose-100 hover:border-rose-300 hover:bg-rose-50 transition-all"
                >
                  <p className="font-medium text-rose-800 text-sm">{c.name}</p>
                  <StatusBadge status={c.hiringStatus} size="sm" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
