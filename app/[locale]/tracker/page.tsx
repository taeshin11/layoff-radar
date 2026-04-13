import { getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoffChart from "@/components/LayoffChart";
import SectorChart from "@/components/SectorChart";
import {
  getYTDTotal,
  getMonthlyTotals,
  getSectorTotals,
  formatCount,
} from "@/lib/data";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function TrackerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tracker" });

  const ytdTotal = getYTDTotal(2024);
  const allMonthlyTotals = getMonthlyTotals();
  const monthly2024 = allMonthlyTotals.filter((m) => m.month.startsWith("2024-"));
  const sectorTotals = getSectorTotals();

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="text-2xl font-extrabold text-rose-800 mb-2">{t("title")}</h1>
        <p className="text-rose-400 mb-8">{t("subtitle")}</p>

        {/* Big counter */}
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-10 text-center mb-8">
          <p className="text-7xl font-black text-rose-600 tabular-nums">
            {ytdTotal.toLocaleString()}
          </p>
          <p className="text-rose-400 mt-3 text-lg">Jobs cut in tech in 2024</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-rose-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-rose-800 mb-4">{t("byMonth")}</h2>
            <LayoffChart data={monthly2024.length > 0 ? monthly2024 : allMonthlyTotals} />
          </div>
          <div className="bg-white rounded-xl border border-rose-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-rose-800 mb-4">{t("bySector")}</h2>
            <SectorChart data={sectorTotals} />
          </div>
        </div>

        {/* Sector totals table */}
        <div className="bg-white rounded-xl border border-rose-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-rose-800 mb-4">By Sector</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rose-100">
                  <th className="text-left py-2 text-rose-500 font-semibold">Sector</th>
                  <th className="text-right py-2 text-rose-500 font-semibold">Jobs Cut</th>
                  <th className="text-right py-2 text-rose-500 font-semibold">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {sectorTotals.map((s) => {
                  const grandTotal = sectorTotals.reduce((sum, x) => sum + x.total, 0);
                  return (
                    <tr key={s.sector} className="border-b border-rose-50">
                      <td className="py-2 capitalize text-rose-800">{s.sector.replace(/-/g, " ")}</td>
                      <td className="py-2 text-right font-bold text-rose-600">{formatCount(s.total)}</td>
                      <td className="py-2 text-right text-rose-400">
                        {((s.total / grandTotal) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
