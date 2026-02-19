import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <PageHeader
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your information at Elite Steel Concepts."
      />

      <Section className="bg-white">
        <Container className="max-w-4xl">
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="text-sm text-gray-400 mb-8 font-bold uppercase tracking-widest">
              Last Updated: {lastUpdated}
            </p>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-secondary uppercase mb-4 tracking-tight">1. Introduction</h2>
              <p>
                At Elite Steel Concepts ("we," "our," or "us"), we respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website at <a href="https://elitesteelconcepts.com" className="text-primary font-bold hover:underline">elitesteelconcepts.com</a>.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-secondary uppercase mb-4 tracking-tight">2. Information We Collect</h2>
              <p>We collect information that you provide directly to us when you:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Fill out a contact form or request a quote</li>
                <li>Communicate with us via email or phone</li>
                <li>Subscribe to our newsletter or blog updates</li>
              </ul>
              <p className="mt-4">
                This information may include your name, email address, phone number, company name, and details about your food truck project.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-secondary uppercase mb-4 tracking-tight">3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Provide accurate quotes for custom fabrication</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send you updates about your project or our services</li>
                <li>Improve our website and marketing efforts</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-secondary uppercase mb-4 tracking-tight">4. Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to outside parties. This does not include trusted third parties who assist us in operating our website or conducting our business, so long as those parties agree to keep this information confidential.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-secondary uppercase mb-4 tracking-tight">5. Data Security</h2>
              <p>
                We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-secondary uppercase mb-4 tracking-tight">6. Cookies</h2>
              <p>
                We may use cookies to understand and save your preferences for future visits and compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-secondary uppercase mb-4 tracking-tight">7. Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal information. If you would like to exercise these rights, please contact us at the email provided below.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-secondary uppercase mb-4 tracking-tight">8. Contact Us</h2>
              <p>
                If there are any questions regarding this privacy policy, you may contact us using the information below:
              </p>
              <div className="mt-6 p-6 bg-gray-50 border-l-4 border-primary rounded-r-md">
                <p className="font-bold text-secondary">Elite Steel Concepts</p>
                <p>8303 Rugby Rd, Manassas VA</p>
                <p>Email: esteelconcepts@gmail.com</p>
                <p>Phone: (571) 651-0337</p>
              </div>
            </section>
          </div>
        </Container>
      </Section>
    </>
  );
}
