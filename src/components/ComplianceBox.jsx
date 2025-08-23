import React from 'react';

export default function ComplianceBox({
  className = '',
  maxHeight = 'max-h-56',
  showHeader = true,               // 👈 new
}) {
  return (
    <div className={`border rounded-md bg-white ${className}`}>
      {/* Header (optional) */}
      {showHeader && (
        <div className="px-3 py-2 border-b bg-gray-50 rounded-t-md">
          <h3 className="text-sm font-semibold text-gray-800">🔒 Compliance & Data Protection</h3>
        </div>
      )}

      {/* Scrollable content */}
      <div className={`p-3 text-xs leading-relaxed space-y-3 overflow-y-auto ${maxHeight}`}>
        <p>We are committed to protecting your privacy across all markets we serve.</p>

        <section>
          <h4 className="font-semibold text-blue-700">🇪🇺 GDPR – General Data Protection Regulation</h4>
          <p>The General Data Protection Regulation (GDPR) protects customers in the European Union. We follow this law by:</p>
          <ul className="list-disc ml-5 mt-1 space-y-1">
            <li><strong>Purpose-limited Data Collection:</strong> We only collect the data we need to fulfill your orders and support your experience.</li>
            <li><strong>Your Rights:</strong> You may access, correct, delete, or restrict how your personal data is used. You can also object or request to transfer it.</li>
            <li><strong>Consent Management:</strong> We always ask for your consent before using non-essential cookies or sending marketing messages.</li>
            <li><strong>International Transfers:</strong> We safeguard your data using Standard Contractual Clauses or other approved mechanisms when transferring it outside the EU.</li>
          </ul>
          <p className="mt-1">To make a GDPR-related request, contact us at <a className="underline text-blue-700" href="mailto:privacy@yourcompany.com">privacy@yourcompany.com</a>.</p>
        </section>

        <section>
          <h4 className="font-semibold text-blue-700">🇸🇬 PDPA – Personal Data Protection Act</h4>
          <p>We adhere to Singapore’s Personal Data Protection Act (PDPA) to ensure the responsible use of your data:</p>
          <ul className="list-disc ml-5 mt-1 space-y-1">
            <li><strong>Consent-Based Collection:</strong> We collect data only with your permission and only when needed.</li>
            <li><strong>Use Limitation:</strong> Your data is used only for business needs like processing orders and offering support.</li>
            <li><strong>Access & Correction:</strong> You have the right to request a copy of your data or fix any errors.</li>
            <li><strong>Data Retention:</strong> We retain your data only as long as needed for legal or business reasons.</li>
            <li><strong>Security Measures:</strong> We apply strict controls such as encryption and secure servers to protect your personal data.</li>
          </ul>
          <p className="mt-1">For PDPA-related inquiries, email <a className="underline text-blue-700" href="mailto:privacy@yourcompany.com">privacy@yourcompany.com</a>.</p>
        </section>

        <section>
          <h4 className="font-semibold text-blue-700">🍪 Cookie Policy</h4>
          <p>We use cookies to give you the best shopping experience. Here’s how:</p>
          <h5 className="font-medium mt-1">What Are Cookies?</h5>
          <p>Cookies are small files placed on your device to help our site remember your actions and preferences.</p>
          <h5 className="font-medium mt-1">Types of Cookies We Use</h5>
          <ul className="list-disc ml-5 mt-1 space-y-1">
            <li><strong>Essential Cookies:</strong> Help with login, checkout, and keeping your cart working properly.</li>
            <li><strong>Performance Cookies:</strong> Tell us how you use the website so we can make it better (e.g., analytics).</li>
            <li><strong>Functional Cookies:</strong> Remember your settings, like language and region.</li>
            <li><strong>Marketing Cookies:</strong> Show ads that are relevant to you and track ad effectiveness.</li>
          </ul>
          <p className="mt-1">
            You can accept all cookies, reject non‑essential ones, or adjust your preferences in our
            {' '}<a href="/cookie-settings" className="underline text-blue-700">Cookie Settings</a> page. You can also change your cookie settings in your browser anytime.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-blue-700">📬 Contact Us</h4>
          <p>
            <strong>Email:</strong> <a className="underline text-blue-700" href="mailto:privacy@yourcompany.com">privacy@yourcompany.com</a><br/>
            <strong>Mailing Address:</strong> [Your Company Name], [Company Address]<br/>
            <strong>Data Protection Officer:</strong> [Full Name or Job Title]
          </p>
        </section>
      </div>
    </div>
  );
}
