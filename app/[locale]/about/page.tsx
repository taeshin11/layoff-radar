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
    title: "About LayoffRadar — Tech Layoff Tracking Platform",
    description:
      "LayoffRadar aggregates tech industry and corporate layoff announcements from SEC filings, WARN Act notices, and press releases to help workers, investors, and HR professionals monitor workforce trends.",
    alternates: {
      canonical: `https://layoff-radar-green.vercel.app/${locale}/about`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          `https://layoff-radar-green.vercel.app/${l}/about`,
        ])
      ),
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await getTranslations({ locale, namespace: "hero" });

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="text-3xl md:text-4xl font-extrabold text-rose-800 mb-4">
          About LayoffRadar
        </h1>
        <p className="text-rose-500 text-lg mb-10">
          Tracking tech industry and corporate layoffs in real-time.
        </p>

        <div className="space-y-8">
          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">What Is LayoffRadar?</h2>
            <p className="text-rose-700 leading-relaxed">
              LayoffRadar is a real-time aggregation platform that monitors layoff
              announcements across the technology industry and broader corporate
              landscape. We collect and surface data from company press releases,
              SEC filings, WARN Act notices, and reputable news sources — giving
              workers, investors, and HR professionals a single place to track
              workforce reduction trends.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">Our Data Sources</h2>
            <ul className="space-y-3 text-rose-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-rose-400">•</span>
                <span>
                  <strong>SEC Filings:</strong> Public companies are required to
                  disclose material workforce changes in 8-K and 10-K filings.
                  We monitor the SEC EDGAR database for relevant disclosures.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-rose-400">•</span>
                <span>
                  <strong>WARN Act Notices:</strong> The Worker Adjustment and
                  Retraining Notification (WARN) Act requires employers with 100+
                  employees to provide 60 days advance notice of mass layoffs.
                  State agencies publish these filings publicly.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-rose-400">•</span>
                <span>
                  <strong>Company Press Releases:</strong> Official announcements
                  from corporate communications and investor relations pages.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-rose-400">•</span>
                <span>
                  <strong>News Sources:</strong> Verified reporting from major
                  financial and technology news outlets.
                </span>
              </li>
            </ul>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">Who Uses LayoffRadar?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-rose-700 mb-2">Workers & Job Seekers</h3>
                <p className="text-rose-600 text-sm leading-relaxed">
                  Monitor your employer and industry for early warning signals.
                  Identify companies that are actively hiring despite sector-wide
                  downturns.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-rose-700 mb-2">Investors & Analysts</h3>
                <p className="text-rose-600 text-sm leading-relaxed">
                  Layoff announcements often precede or coincide with stock price
                  movements, restructuring plans, and earnings guidance changes.
                  Stay ahead of the market.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-rose-700 mb-2">HR Professionals</h3>
                <p className="text-rose-600 text-sm leading-relaxed">
                  Benchmark workforce trends across sectors, understand competitor
                  headcount changes, and identify talent availability in the market.
                </p>
              </div>
            </div>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">Coverage & Scope</h2>
            <p className="text-rose-700 leading-relaxed mb-4">
              LayoffRadar covers layoff events across all major technology
              sub-sectors including software, hardware, semiconductors, fintech,
              edtech, healthtech, e-commerce, and enterprise SaaS. We also track
              layoffs at major corporations outside pure tech — including financial
              services, media, retail, and automotive companies undergoing
              digital transformation or restructuring.
            </p>
            <p className="text-rose-700 leading-relaxed">
              Data is updated continuously as new announcements are made. Historical
              records are preserved to allow trend analysis over time. Each entry
              includes the company name, sector, number of employees affected,
              announcement date, and a link to the primary source.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">Our Mission</h2>
            <p className="text-rose-700 leading-relaxed">
              We believe workforce data should be transparent, accessible, and
              easy to understand. Layoffs affect millions of people every year,
              yet the information is scattered across regulatory filings, press
              releases, and news articles. LayoffRadar brings this data together
              so that anyone — regardless of their access to Bloomberg terminals
              or expensive research subscriptions — can understand what is
              happening in the labor market.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
