import { getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompaniesClient from "./CompaniesClient";
import { getCompanies } from "@/lib/data";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return {
    title: `Tech ${t("companies")} — Layoff & Hiring Status | LayoffRadar`,
    description: "See all tech companies with their layoff history and current hiring status.",
  };
}

export default async function CompaniesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  const companies = getCompanies();

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="text-2xl font-extrabold text-rose-800 mb-6">{t("companies")}</h1>
        <CompaniesClient companies={companies} locale={locale} />
      </main>
      <Footer />
    </>
  );
}
