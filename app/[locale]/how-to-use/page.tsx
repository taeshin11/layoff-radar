import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { routing } from "@/i18n/routing";

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
    title: "How to Use LayoffRadar — FAQ & Guide",
    description:
      "Learn how LayoffRadar tracks layoffs, what the WARN Act is, which industries have had the most layoffs, and how to use our data to make informed decisions.",
    alternates: {
      canonical: `https://layoff-radar-green.vercel.app/${locale}/how-to-use`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          `https://layoff-radar-green.vercel.app/${l}/how-to-use`,
        ])
      ),
    },
  };
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How are layoffs tracked on LayoffRadar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "LayoffRadar aggregates layoff data from SEC filings (8-K and 10-K reports), WARN Act notices filed with state agencies, official company press releases, and verified reporting from major financial and technology news outlets. Each entry is linked to its primary source so you can verify the information directly.",
      },
    },
    {
      "@type": "Question",
      name: "What is the WARN Act?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Worker Adjustment and Retraining Notification (WARN) Act is a U.S. federal law that requires employers with 100 or more full-time employees to provide at least 60 calendar days advance written notice before a plant closing or mass layoff affecting 50 or more employees. State agencies publish these notices publicly, making them a valuable source of layoff data.",
      },
    },
    {
      "@type": "Question",
      name: "How current is the layoff data on LayoffRadar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "LayoffRadar data is updated continuously as new announcements are made. SEC filings are processed as they are submitted to EDGAR, WARN Act notices are collected from state databases on a regular schedule, and major news-driven layoff announcements are typically added within 24 hours of publication.",
      },
    },
    {
      "@type": "Question",
      name: "Which industries have had the most layoffs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Software and internet companies have consistently led layoff volumes in recent years, followed by enterprise technology, fintech, e-commerce, and media. Hardware and semiconductor companies have also seen significant rounds. Use the Sectors page on LayoffRadar to compare layoff totals and trends across industries.",
      },
    },
    {
      "@type": "Question",
      name: "What companies have laid off the most workers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Large technology companies including Meta, Amazon, Google, Microsoft, and Salesforce have announced some of the largest layoff rounds in terms of absolute headcount. However, many smaller companies have had layoffs representing a higher percentage of their total workforce. The Companies page on LayoffRadar lets you sort by total jobs cut or browse by sector.",
      },
    },
    {
      "@type": "Question",
      name: "What is a mass layoff?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A mass layoff, as defined by the U.S. Bureau of Labor Statistics, is a layoff event where at least 50 workers from a single employer are laid off for more than 30 days. Under the WARN Act, a mass layoff triggers the 60-day advance notice requirement when it affects 500 or more workers, or 50-499 workers who represent at least 33% of the employer's active workforce.",
      },
    },
    {
      "@type": "Question",
      name: "What should I do if I'm laid off?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "LayoffRadar provides labor market data only and is not a career counseling service. If you have been laid off, consider: filing for unemployment benefits through your state's unemployment office, reviewing your severance agreement (ideally with an employment attorney), updating your resume and LinkedIn profile, reaching out to your professional network, and checking job boards for openings. Some companies listed on LayoffRadar as 'Still Hiring' may be good places to apply.",
      },
    },
    {
      "@type": "Question",
      name: "Are FAANG layoffs covered on LayoffRadar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. LayoffRadar tracks layoff announcements from all major technology companies, including Meta (formerly Facebook), Amazon, Apple, Netflix, and Google (Alphabet), as well as Microsoft, Salesforce, Oracle, and other large-cap tech firms. Search for a company by name on the Companies page to see its full layoff history.",
      },
    },
    {
      "@type": "Question",
      name: "How does layoff data affect the stock market?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Layoff announcements can have mixed effects on stock prices. Markets sometimes react positively to large layoffs if investors interpret them as cost-cutting measures that will improve profitability. In other cases, layoffs signal deteriorating business conditions and lead to stock price declines. The relationship depends on the size of the reduction relative to the workforce, the stated reason for the layoffs, and broader market sentiment. LayoffRadar data can be used alongside financial data for investment research purposes.",
      },
    },
  ],
};

export default async function HowToUsePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await getTranslations({ locale, namespace: "hero" });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="text-3xl md:text-4xl font-extrabold text-rose-800 mb-4">
          How to Use LayoffRadar
        </h1>
        <p className="text-rose-500 text-lg mb-10">
          Frequently asked questions about our data, methodology, and how to get
          the most out of LayoffRadar.
        </p>

        <div className="space-y-6">
          {faqSchema.mainEntity.map((item, i) => (
            <section key={i} className="card">
              <h2 className="text-lg font-bold text-rose-800 mb-2">
                {item.name}
              </h2>
              <p className="text-rose-700 leading-relaxed">
                {item.acceptedAnswer.text}
              </p>
            </section>
          ))}
        </div>

        <section className="card mt-8">
          <h2 className="text-lg font-bold text-rose-800 mb-3">
            Navigating the Site
          </h2>
          <ul className="space-y-3 text-rose-700">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-rose-400">•</span>
              <span>
                <strong>Home:</strong> See the most recent layoff announcements,
                monthly trend chart, and sector breakdown.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-rose-400">•</span>
              <span>
                <strong>Companies:</strong> Browse all tracked companies
                alphabetically or search by name. Each company page shows its
                full layoff history and current hiring status.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-rose-400">•</span>
              <span>
                <strong>Sectors:</strong> Compare layoff trends across industries
                including software, fintech, e-commerce, and more.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-rose-400">•</span>
              <span>
                <strong>YTD Tracker:</strong> See year-to-date totals broken down
                by month and sector to understand the pace of layoffs over time.
              </span>
            </li>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
