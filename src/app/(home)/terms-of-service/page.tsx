import React from "react";

const sections = [
  {
    title: "1. Introduction",
    body: "Welcome to Errandly247. These Terms of Service govern your use of our website, platform, customer portal, employee dashboard, and services. By accessing or using Errandly247, you agree to comply with these Terms.",
  },
  {
    title: "2. Eligibility",
    body: "You must be at least 18 years old or have permission from a parent or legal guardian to use our services. You agree to provide accurate, complete, and current information when using our platform.",
  },
  {
    title: "3. Our Services",
    body: "Errandly247 provides home and maintenance support, transportation and delivery, personal and lifestyle assistance, business support, senior and family assistance, and custom errand solutions. Service availability may vary by location and operational capacity.",
  },
  {
    title: "4. User Responsibilities",
    body: "Users are responsible for providing accurate pickup, delivery, contact, and service information. Users must not use our services for unlawful, unsafe, abusive, or fraudulent purposes.",
  },
  {
    title: "5. Prohibited Activities",
    body: "You may not use Errandly247 to send illegal, hazardous, restricted, stolen, or harmful items. You may not attempt unauthorized access to our systems, impersonate others, upload malicious software, or abuse our staff, contractors, or users.",
  },
  {
    title: "6. Tracking and Delivery Updates",
    body: "Tracking information and estimated delivery dates are provided for convenience. Delivery times may change due to traffic, weather, operational delays, government restrictions, or other circumstances beyond our control.",
  },
  {
    title: "7. Payments and Fees",
    body: "Users agree to pay all applicable service fees. Errandly247 may update pricing, refuse suspicious transactions, or suspend services where payment is incomplete, disputed, or fraudulent.",
  },
  {
    title: "8. Account Suspension",
    body: "Errandly247 may suspend, restrict, or terminate access where we detect fraud, abuse, security concerns, policy violations, or misuse of our services.",
  },
  {
    title: "9. Intellectual Property",
    body: "All logos, branding, website content, designs, graphics, software, and related materials are owned by Errandly247 or its licensors. Unauthorized use, reproduction, or distribution is prohibited.",
  },
  {
    title: "10. Limitation of Liability",
    body: "To the fullest extent permitted by law, Errandly247 is not liable for indirect losses, loss of profits, delays caused by external factors, or issues caused by inaccurate information provided by users.",
  },
  {
    title: "11. Updates to These Terms",
    body: "We may update these Terms from time to time. Continued use of Errandly247 after changes are posted means you accept the updated Terms.",
  },
];

export default function TermsOfServicePage() {
  return (
    <main className="bg-gray-50 px-5 py-24 md:px-10 mt-10">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-3xl bg-black px-6 py-12 text-white md:px-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-yellow-400">
            Legal
          </p>
          <h1 className="font-Euclid text-4xl font-bold md:text-6xl">
            Terms of Service
          </h1>
          <p className="mt-5 max-w-3xl font-Poppins text-sm leading-7 text-gray-300 md:text-base">
            Please read these Terms carefully before using Errandly247’s
            website, platform, dashboard, and services.
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