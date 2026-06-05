import React from "react";

const sections = [
  {
    title: "1. Information We Collect",
    body: "We may collect your name, email address, phone number, address, service details, delivery information, tracking information, payment-related information, device information, and usage data.",
  },
  {
    title: "2. How We Use Your Information",
    body: "We use your information to process requests, manage deliveries and errands, provide support, send service updates, improve our platform, prevent fraud, and comply with legal obligations.",
  },
  {
    title: "3. Tracking Information",
    body: "Tracking information is used to provide shipment updates, monitor delivery progress, improve operational efficiency, and assist customers with delivery-related questions.",
  },
  {
    title: "4. Cookies and Analytics",
    body: "We may use cookies and analytics tools to improve website performance, remember preferences, enhance security, and understand how users interact with our platform.",
  },
  {
    title: "5. Information Sharing",
    body: "We do not sell personal information. We may share information only with authorized staff, delivery partners, service providers, payment processors, or legal authorities when required.",
  },
  {
    title: "6. Data Security",
    body: "We use reasonable security measures such as access controls, secure authentication, monitoring, encryption where appropriate, and regular system updates. However, no online system is completely secure.",
  },
  {
    title: "7. Data Retention",
    body: "We retain information only for as long as necessary to provide services, meet legal requirements, resolve disputes, enforce agreements, and maintain business records.",
  },
  {
    title: "8. Your Rights",
    body: "Depending on your location, you may request access to your information, correction of inaccurate data, deletion of eligible data, or restriction of certain processing activities.",
  },
  {
    title: "9. Third-Party Services",
    body: "Our platform may link to third-party websites or services. Errandly247 is not responsible for the privacy practices, content, or policies of third-party platforms.",
  },
  {
    title: "10. Children’s Privacy",
    body: "Our services are not directed to children under 13. We do not knowingly collect personal information from children.",
  },
  {
    title: "11. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised effective date.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-gray-50 px-5 py-24 md:px-10 mt-10">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-3xl bg-black px-6 py-12 text-white md:px-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-yellow-400">
            Privacy
          </p>
          <h1 className="font-Euclid text-4xl font-bold md:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-5 max-w-3xl font-Poppins text-sm leading-7 text-gray-300 md:text-base">
            Your privacy matters to us. This policy explains how Errandly247
            collects, uses, protects, and manages your information.
          </p>
          <p className="mt-6 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm text-gray-200">
            Last Updated: July 2026
          </p>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm md:p-10">
          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-Euclid text-xl font-bold text-gray-900 md:text-2xl">
                  {section.title}
                </h2>
                <p className="mt-3 font-Poppins text-sm leading-7 text-gray-600 md:text-base">
                  {section.body}
                </p>
              </section>
            ))}

            <section>
              <h2 className="font-Euclid text-xl font-bold text-gray-900 md:text-2xl">
                12. Contact Us
              </h2>
              <div className="mt-4 rounded-2xl bg-gray-50 p-5 font-Poppins text-sm leading-7 text-gray-700">
                <p>
                  <strong>Errandly247</strong>
                </p>
                <p>Email: office@errandly247.com</p>
                <p>Address: 29 W 35th St #204, New York, NY 10001</p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}