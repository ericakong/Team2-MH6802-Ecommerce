import React from 'react';

export default function Compliance() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Legal &amp; Compliance</h1>
      </header>

      <article className="space-y-8 text-[15px] leading-7 text-gray-800">
        <section aria-labelledby="sec-gdpr">
          <h2 id="sec-gdpr" className="text-xl font-semibold text-gray-900 mb-2">
            🇪🇺 GDPR – General Data Protection Regulation
          </h2>
          <p className="mb-2">
            The General Data Protection Regulation (GDPR) protects customers in the European Union.
            We follow this law by:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li><strong>Purpose‑limited Data Collection:</strong> We only collect the data we need to fulfill your orders and support your experience.</li>
            <li><strong>Your Rights:</strong> You may access, correct, delete, or restrict how your personal data is used. You can also object or request to transfer it.</li>
            <li><strong>Consent Management:</strong> We always ask for your consent before using non‑essential cookies or sending marketing messages.</li>
            <li><strong>International Transfers:</strong> We safeguard your data using Standard Contractual Clauses or other approved mechanisms when transferring it outside the EU.</li>
          </ul>
          <p className="mt-2">
            To make a GDPR‑related request, contact us at{' '}
            <a className="underline text-blue-700" href="mailto:privacy@yourcompany.com">
              privacy@yourcompany.com
            </a>.
          </p>
        </section>

        <section aria-labelledby="sec-pdpa">
          <h2 id="sec-pdpa" className="text-xl font-semibold text-gray-900 mb-2">
            🇸🇬 PDPA – Personal Data Protection Act
          </h2>
          <p className="mb-2">
            We adhere to Singapore’s Personal Data Protection Act (PDPA) to ensure the responsible use of your data:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li><strong>Consent‑Based Collection:</strong> We collect data only with your permission and only when needed.</li>
            <li><strong>Use Limitation:</strong> Your data is used only for business needs like processing orders and offering support.</li>
            <li><strong>Access &amp; Correction:</strong> You have the right to request a copy of your data or fix any errors.</li>
            <li><strong>Data Retention:</strong> We retain your data only as long as needed for legal or business reasons.</li>
            <li><strong>Security Measures:</strong> We apply strict controls such as encryption and secure servers to protect your personal data.</li>
          </ul>
          <p className="mt-2">
            For PDPA‑related inquiries, email{' '}
            <a className="underline text-blue-700" href="mailto:privacy@yourcompany.com">
              privacy@yourcompany.com
            </a>.
          </p>
        </section>

        <section aria-labelledby="sec-cookies">
          <h2 id="sec-cookies" className="text-xl font-semibold text-gray-900 mb-2">🍪 Cookie Policy</h2>
          <p className="mb-2">We use cookies to give you the best shopping experience. Here’s how:</p>

          <h3 className="font-medium">What Are Cookies?</h3>
          <p className="mb-2">Cookies are small files placed on your device to help our site remember your actions and preferences.</p>

          <h3 className="font-medium">Types of Cookies We Use</h3>
          <ul className="list-disc ml-6 space-y-1">
            <li><strong>Essential Cookies:</strong> Help with login, checkout, and keeping your cart working properly.</li>
            <li><strong>Performance Cookies:</strong> Tell us how you use the website so we can make it better (e.g., analytics).</li>
            <li><strong>Functional Cookies:</strong> Remember your settings, like language and region.</li>
            <li><strong>Marketing Cookies:</strong> Show ads that are relevant to you and track ad effectiveness.</li>
          </ul>
          <p className="mt-2">
            You can accept all cookies, reject non‑essential ones, or adjust your preferences in our{' '}
            <a href="/cookie-settings" className="underline text-blue-700">Cookie Settings</a> page.
            You can also change your cookie settings in your browser anytime.
          </p>
        </section>

        <section aria-labelledby="sec-contact">
          <h2 id="sec-contact" className="text-xl font-semibold text-gray-900 mb-2">📬 Contact Us</h2>
          <p>
            <strong>Email:</strong>{' '}
            <a className="underline text-blue-700" href="mailto:privacy@yourcompany.com">
              privacy@yourcompany.com
            </a><br/>
            <strong>Mailing Address:</strong> [Your Company Name], [Company Address]<br/>
            <strong>Data Protection Officer:</strong> [Full Name or Job Title]
          </p>
        </section>
      </article>
    </main>
  );
}
