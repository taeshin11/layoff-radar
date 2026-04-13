import layoffsFallback from "@/data/layoffs-fallback.json";
import companiesFallback from "@/data/companies-fallback.json";
import sectorsFallback from "@/data/sectors-fallback.json";

export interface LayoffEvent {
  id: string;
  company: string;
  slug: string;
  date: string;
  count: number;
  percentage: number;
  sector: string;
  source: string;
  hiringStatus: "hiring" | "freeze" | "layoffs";
  description: string;
}

export interface Company {
  slug: string;
  name: string;
  sector: string;
  hiringStatus: "hiring" | "freeze" | "layoffs";
  totalLayoffs: number;
  lastLayoffDate: string;
}

export interface Sector {
  slug: string;
  name: string;
  totalLayoffs2024: number;
  companies: string[];
}

export function getLayoffs(): LayoffEvent[] {
  return layoffsFallback as LayoffEvent[];
}

export function getCompanies(): Company[] {
  return companiesFallback as Company[];
}

export function getSectors(): Sector[] {
  return sectorsFallback as Sector[];
}

export function getLayoffsByCompany(slug: string): LayoffEvent[] {
  return getLayoffs()
    .filter((e) => e.slug === slug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getCompanyBySlug(slug: string): Company | undefined {
  return getCompanies().find((c) => c.slug === slug);
}

export function getSectorBySlug(slug: string): Sector | undefined {
  return getSectors().find((s) => s.slug === slug);
}

export function getLayoffsBySector(sectorSlug: string): LayoffEvent[] {
  return getLayoffs()
    .filter((e) => e.sector === sectorSlug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getLayoffsByMonth(year: string, month: string): LayoffEvent[] {
  const prefix = `${year}-${month.padStart(2, "0")}`;
  return getLayoffs()
    .filter((e) => e.date.startsWith(prefix))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getYTDTotal(year: number): number {
  const prefix = `${year}-`;
  return getLayoffs()
    .filter((e) => e.date.startsWith(prefix))
    .reduce((sum, e) => sum + e.count, 0);
}

export function getMonthlyTotals(): { month: string; total: number }[] {
  const map: Record<string, number> = {};
  getLayoffs().forEach((e) => {
    const key = e.date.slice(0, 7);
    map[key] = (map[key] || 0) + e.count;
  });
  return Object.entries(map)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, total]) => ({ month, total }));
}

export function getSectorTotals(): { sector: string; total: number }[] {
  const map: Record<string, number> = {};
  getLayoffs().forEach((e) => {
    map[e.sector] = (map[e.sector] || 0) + e.count;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([sector, total]) => ({ sector, total }));
}

export function getRecentLayoffs(limit = 25): LayoffEvent[] {
  return getLayoffs()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export function getAllMonths(): { year: string; month: string }[] {
  const set = new Set<string>();
  getLayoffs().forEach((e) => {
    set.add(e.date.slice(0, 7));
  });
  return Array.from(set)
    .sort()
    .map((m) => ({ year: m.slice(0, 4), month: m.slice(5, 7) }));
}

export function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return n.toString();
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getMonthName(month: string, year: string): string {
  return new Date(`${year}-${month}-01`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}
