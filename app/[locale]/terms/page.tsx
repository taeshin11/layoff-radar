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
    title: "Terms of Use — LayoffRadar",
    description:
      "LayoffRadar terms of use. Data sourced from public records only. Not affiliated with any company. Verify all information with official company announcements.",
    alternates: {
      canonical: `https://layoff-radar-green.vercel.app/${locale}/terms`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          `https://layoff-radar-green.vercel.app/${l}/terms`,
        ])
      ),
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await getTranslations({ locale, namespace: "hero" });

  const lastUpdated = "April 13, 2025";

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="text-3xl md:text-4xl font-extrabold text-rose-800 mb-2">
          Terms of Use
        </h1>
        <p className="text-rose-400 text-sm mb-10">Last updated: {lastUpdated}</p>

        <div className="space-y-8 text-rose-700 leading-relaxed">
          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using LayoffRadar (&quot;the Service&quot;) at{" "}
              <span className="font-medium">layoff-radar-green.vercel.app</span>,
              you agree to be bound by these Terms of Use. If you do not agree to
              these terms, please do not use the Service.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">2. Data Sources — Public Information Only</h2>
            <p className="mb-4">
              All data displayed on LayoffRadar is sourced exclusively from
              publicly available information, including but not limited to:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-rose-400">•</span>
                U.S. Securities and Exchange Commission (SEC) filings available
                on EDGAR.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-rose-400">•</span>
                WARN Act notices filed with state workforce agencies.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-rose-400">•</span>
                Official press releases and investor relations materials published
                by companies.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-rose-400">•</span>
                Reporting from major news organizations.
              </li>
            </ul>
            <p>
              We do not have access to, and do not publish, any proprietary,
              confidential, or non-public information about any company or
              individual.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">3. No Affiliation with Any Company</h2>
            <p>
              LayoffRadar is an independent information service. We are not
              affiliated with, endorsed by, sponsored by, or connected to any
              company, organization, employer, or government agency mentioned or
              tracked on the Service. Company names, logos, and trademarks
              referenced on the site are the property of their respective owners.
              Their appearance on LayoffRadar does not constitute an endorsement
              of or by those entities.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">4. Verify with Official Sources</h2>
            <p className="mb-4">
              While we strive to ensure the accuracy and timeliness of the
              information on the Service, layoff data can be complex, subject to
              revision, and may not reflect the most current developments.
            </p>
            <p className="font-semibold text-rose-800">
              Always verify layoff information with official company announcements,
              SEC filings, and primary news sources before making any decisions
              based on data from this site.
            </p>
            <p className="mt-4">
              We make no representations or warranties of any kind, express or
              implied, about the completeness, accuracy, reliability, suitability,
              or availability of the information on the Service. Any reliance you
              place on such information is strictly at your own risk.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">5. Not Career or Legal Advice</h2>
            <p className="mb-4">
              The information provided on LayoffRadar is for general informational
              purposes only and does not constitute:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-rose-400">•</span>
                <strong>Career advice:</strong> Information about companies
                hiring or conducting layoffs should not be treated as career
                counseling or employment advice.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-rose-400">•</span>
                <strong>Legal advice:</strong> Nothing on this site constitutes
                legal advice. If you have been laid off and have legal questions
                about your severance, benefits, or rights, consult a qualified
                employment attorney.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-rose-400">•</span>
                <strong>Investment advice:</strong> Layoff data on this site
                should not be used as the sole basis for investment decisions.
                Consult a qualified financial advisor.
              </li>
            </ul>
            <p>
              We expressly disclaim any liability arising from your reliance on
              information provided on the Service for career, legal, or investment
              purposes.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">6. Intellectual Property</h2>
            <p>
              The Service and its original content (excluding publicly sourced
              data), features, and functionality are owned by LayoffRadar and are
              protected by applicable intellectual property laws. The underlying
              layoff data is sourced from public records and is not claimed as
              proprietary. You may not reproduce, distribute, modify, or create
              derivative works of the Service&apos;s design or original content
              without written permission.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, LayoffRadar and its operators
              shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, including without limitation,
              loss of profits, data, or goodwill, arising out of or in connection
              with your use of, or inability to use, the Service or any content
              thereon, even if we have been advised of the possibility of such
              damages.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">8. External Links</h2>
            <p>
              The Service contains links to external websites that are not
              operated by us. We have no control over and assume no responsibility
              for the content, privacy policies, or practices of any third-party
              sites. We encourage you to review the privacy policy of every site
              you visit.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Use at any time. We
              will indicate changes by updating the &quot;Last updated&quot; date at the
              top of this page. Your continued use of the Service after any
              changes constitutes your acceptance of the new terms.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">10. Governing Law</h2>
            <p>
              These Terms of Use shall be governed by and construed in accordance
              with applicable law, without regard to its conflict of law
              provisions.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
