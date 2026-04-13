"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Menu, X, TrendingDown, Search } from "lucide-react";

const locales = [
  { code: "en", label: "EN" },
  { code: "ko", label: "KO" },
  { code: "ja", label: "JA" },
  { code: "zh", label: "ZH" },
  { code: "es", label: "ES" },
  { code: "fr", label: "FR" },
  { code: "de", label: "DE" },
  { code: "pt", label: "PT" },
];

export default function Navbar() {
  const t = useTranslations("nav");
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "en";
  const [open, setOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/companies`, label: t("companies") },
    { href: `/${locale}/sectors`, label: t("sectors") },
    { href: `/${locale}/tracker`, label: t("tracker") },
  ];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQ.trim()) {
      router.push(`/${locale}/companies?q=${encodeURIComponent(searchQ.trim())}`);
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-rose-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-rose-700 text-lg">
            <TrendingDown className="w-5 h-5" />
            <span>LayoffRadar</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-rose-900 hover:text-rose-600 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Search + locale */}
          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-2 w-4 h-4 text-rose-400" />
              <input
                type="search"
                placeholder={t("search")}
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm rounded-full border border-rose-200 bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-400 w-40"
              />
            </form>
            <select
              value={locale}
              onChange={(e) => router.push(`/${e.target.value}`)}
              className="text-xs border border-rose-200 rounded px-2 py-1 bg-white text-rose-800"
            >
              {locales.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-rose-700"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden bg-white border-t border-rose-100 px-4 py-4 space-y-3">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block text-rose-900 font-medium py-1"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <form onSubmit={handleSearch} className="relative mt-2">
            <Search className="absolute left-2.5 top-2 w-4 h-4 text-rose-400" />
            <input
              type="search"
              placeholder={t("search")}
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm rounded-full border border-rose-200 bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-400 w-full"
            />
          </form>
          <select
            value={locale}
            onChange={(e) => { router.push(`/${e.target.value}`); setOpen(false); }}
            className="text-xs border border-rose-200 rounded px-2 py-1 bg-white text-rose-800 mt-2"
          >
            {locales.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>
      )}
    </header>
  );
}
