import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSectors, getSectorTotals, formatCount } from "@/lib/data";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function SectorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sector" });
  const sectors = getSectors();
  const sectorTotals = getSectorTotals();
  const totalMap = Object.fromEntries(sectorTotals.map((s) => [s.sector, s.total]));
  const sortedSectors = [...sectors].sort(
    (a, b) => (totalMap[b.slug] || 0) - (totalMap[a.slug] || 0)
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="text-2xl font-extrabold text-rose-800 mb-6">Sectors</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedSectors.map((sector) => {
            const total = totalMap[sector.slug] || 0;
            return (
              <Link
                key={sector.slug}
                href={`/${locale}/sectors/${sector.slug}`}
                className="bg-white rounded-xl border border-rose-100 shadow-sm p-5 hover:shadow-md hover:border-rose-300 transition-all fade-in-up"
              >
                <h2 className="font-bold text-rose-900 text-lg mb-2">{sector.name}</h2>
                <p className="text-3xl font-extrabold text-rose-600 mb-1">{formatCount(total)}</p>
                <p className="text-xs text-rose-400">{t("totalLayoffs")}</p>
                <p className="text-sm text-rose-500 mt-2">
                  {sector.companies.length} {t("companiesAffected")}
                </p>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
