import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { FeedbackButton } from '@/components/FeedbackButton';
import { AdSocialBar } from '@/components/ads/AdSocialBar';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: new URL("https://layoff-radar-green.vercel.app"),
    title: "Tech Layoff Tracker 2025 — Company Layoffs & Job Cuts | LayoffRadar",
    description:
      "Track tech industry layoffs in real-time. See which companies are cutting jobs, how many employees affected, and layoff trends by sector.",
    keywords: [
      "tech layoffs",
      "company layoffs 2025",
      "layoff tracker",
      "job cuts",
      "mass layoffs",
      "WARN Act",
      "tech industry layoffs",
      "startup layoffs",
    ],
    alternates: {
      canonical: `https://layoff-radar-green.vercel.app/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          `https://layoff-radar-green.vercel.app/${l}`,
        ])
      ),
    },
    openGraph: {
      title: "Tech Layoff Tracker 2025 — Company Layoffs & Job Cuts | LayoffRadar",
      description:
        "Track tech industry layoffs in real-time. See which companies are cutting jobs, how many employees affected, and layoff trends by sector.",
      url: `https://layoff-radar-green.vercel.app/${locale}`,
      siteName: "LayoffRadar",
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Tech Layoff Tracker 2025 — Company Layoffs & Job Cuts | LayoffRadar",
      description:
        "Track tech industry layoffs in real-time. See which companies are cutting jobs, how many employees affected, and layoff trends by sector.",
    },
    other: {
      "google-adsense-account": "ca-pub-7098271335538021",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7098271335538021" crossOrigin="anonymous"></script>

        {routing.locales.map((l) => (
          <link
            key={l}
            rel="alternate"
            hrefLang={l}
            href={`https://layoff-radar-green.vercel.app/${l}`}
          />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://layoff-radar-green.vercel.app/en"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
