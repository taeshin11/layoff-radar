import { MetadataRoute } from "next";
import { getCompanies, getSectors, getAllMonths } from "@/lib/data";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://layoff-radar.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = routing.locales;
  const companies = getCompanies();
  const sectors = getSectors();
  const months = getAllMonths();

  const homepages = locales.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  const companyPages = locales.flatMap((locale) =>
    companies.map((c) => ({
      url: `${BASE_URL}/${locale}/companies/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  const sectorPages = locales.flatMap((locale) =>
    sectors.map((s) => ({
      url: `${BASE_URL}/${locale}/sectors/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  const monthPages = locales.flatMap((locale) =>
    months.map((m) => ({
      url: `${BASE_URL}/${locale}/months/${m.year}/${m.month}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  const staticPages = locales.flatMap((locale) =>
    ["companies", "sectors", "tracker"].map((page) => ({
      url: `${BASE_URL}/${locale}/${page}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }))
  );

  return [...homepages, ...staticPages, ...companyPages, ...sectorPages, ...monthPages];
}
