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
    title: "Privacy Policy — LayoffRadar",
    description:
      "LayoffRadar privacy policy. Learn how we collect, use, and protect your information when you visit our layoff tracking platform.",
    alternates: {
      canonical: `https://layoff-radar-green.vercel.app/${locale}/privacy`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          `https://layoff-radar-green.vercel.app/${l}/privacy`,
        ])
      ),
    },
  };
}

export default async function PrivacyPage({
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
          Privacy Policy
        </h1>
        <p className="text-rose-400 text-sm mb-10">Last updated: {lastUpdated}</p>

        <div className="space-y-8 text-rose-700 leading-relaxed">
          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">1. Introduction</h2>
            <p>
              LayoffRadar (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website at{" "}
              <span className="font-medium">layoff-radar-green.vercel.app</span>{" "}
              (the &quot;Service&quot;). This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you visit our website.
              Please read this policy carefully. If you disagree with its terms,
              please discontinue use of the Service.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">2. Information We Collect</h2>
            <h3 className="font-semibold text-rose-700 mb-2">Automatically Collected Information</h3>
            <p className="mb-4">
              When you visit the Service, we may automatically collect certain
              information about your device and usage, including:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-rose-400">•</span>
                Log data such as your IP address, browser type, operating system,
                referring URLs, and pages viewed.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-rose-400">•</span>
                Aggregate visit counts (today&apos;s visits and total visits) stored
                in our database for display on the site. No personally
                identifiable information is stored in connection with these counts.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-rose-400">•</span>
                Cookies and similar tracking technologies used by third-party
                services (see Section 5).
              </li>
            </ul>
            <h3 className="font-semibold text-rose-700 mb-2">Information You Provide</h3>
            <p>
              We do not require you to create an account or submit personal
              information to use the Service. If you contact us via email, we
              will retain the contents of your message and your email address
              solely to respond to your inquiry.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-rose-400">•</span>
                Operate, maintain, and improve the Service.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-rose-400">•</span>
                Monitor and analyze usage trends to understand how visitors
                interact with the site.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-rose-400">•</span>
                Detect, prevent, and address technical issues and security threats.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-rose-400">•</span>
                Respond to your comments and questions.
              </li>
            </ul>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">4. Data Retention</h2>
            <p>
              Aggregate visit counts are retained indefinitely as they contain no
              personal data. Server log data, if retained by our hosting provider
              (Vercel), is subject to Vercel&apos;s own data retention policies.
              We do not independently store detailed server logs beyond what
              Vercel captures in the normal course of hosting operations.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">5. Third-Party Services</h2>
            <p className="mb-4">
              The Service may use third-party services that collect information
              about you. These include:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-rose-400">•</span>
                <span>
                  <strong>Vercel:</strong> Our hosting platform. Vercel may
                  collect access logs. See{" "}
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-600 underline hover:text-rose-800"
                  >
                    Vercel&apos;s Privacy Policy
                  </a>
                  .
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-rose-400">•</span>
                <span>
                  <strong>Google AdSense:</strong> We may display advertisements
                  served by Google AdSense, which uses cookies to serve ads based
                  on your prior visits to this and other websites. You can opt out
                  of personalized advertising by visiting{" "}
                  <a
                    href="https://www.google.com/settings/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-600 underline hover:text-rose-800"
                  >
                    Google Ads Settings
                  </a>
                  .
                </span>
              </li>
            </ul>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">6. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity
              on the Service and to hold certain information. Cookies are files
              with a small amount of data which may include an anonymous unique
              identifier. You can instruct your browser to refuse all cookies or
              to indicate when a cookie is being sent. However, if you do not
              accept cookies, you may not be able to use some portions of the
              Service.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">7. Children&apos;s Privacy</h2>
            <p>
              The Service does not address anyone under the age of 13. We do not
              knowingly collect personally identifiable information from children
              under 13. If you are a parent or guardian and you are aware that
              your child has provided us with personal information, please contact
              us so that we can take the necessary steps to remove that information.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">8. Your Rights</h2>
            <p className="mb-3">
              Depending on your location, you may have certain rights regarding
              your personal data, including the right to access, correct, or
              delete any personal data we hold about you. Since we do not collect
              personally identifiable information in the normal course of operating
              the Service, there is generally no personal data to access or delete.
            </p>
            <p>
              If you believe we have collected personal data about you and wish to
              exercise any applicable rights, please contact us at the address
              below.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify
              you of any changes by updating the &quot;Last updated&quot; date at the top of
              this page. You are advised to review this Privacy Policy periodically
              for any changes. Changes to this Privacy Policy are effective when
              they are posted on this page.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold text-rose-800 mb-3">10. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please
              contact us by opening an issue on the LayoffRadar repository or
              reaching out through the contact information available on the site.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
