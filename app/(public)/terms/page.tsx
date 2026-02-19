import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";

export default function TermsPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <PageHeader
        title="Terms of Service"
        subtitle="The legal terms and conditions for working with Elite Steel Concepts."
      />

      <Section className="bg-white">
        <Container className="max-w-4xl">
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="text-sm text-gray-400 mb-8 font-bold uppercase tracking-widest">
              Last Updated: {lastUpdated}
            </p>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-secondary uppercase mb-4 tracking-tight">1. Terms</h2>
              <p>
                By accessing this website, you are agreeing to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-secondary uppercase mb-4 tracking-tight">2. Use License</h2>
              <p>
                Permission is granted to temporarily view the materials on Elite Steel Concepts' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-secondary uppercase mb-4 tracking-tight">3. Project Estimates</h2>
              <p>
                Any quotes or estimates provided through this website are preliminary and subject to change based on final design specifications, material costs, and labor requirements. A formal signed contract is required for all fabrication projects.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-secondary uppercase mb-4 tracking-tight">4. Disclaimer</h2>
              <p>
                The materials on Elite Steel Concepts' website are provided on an 'as is' basis. Elite Steel Concepts makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-secondary uppercase mb-4 tracking-tight">5. Limitations</h2>
              <p>
                In no event shall Elite Steel Concepts or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Elite Steel Concepts' website.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-secondary uppercase mb-4 tracking-tight">6. Revisions and Errata</h2>
              <p>
                The materials appearing on Elite Steel Concepts' website could include technical, typographical, or photographic errors. Elite Steel Concepts does not warrant that any of the materials on its website are accurate, complete or current.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-secondary uppercase mb-4 tracking-tight">7. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of the Commonwealth of Virginia and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
              </p>
            </section>

            <section className="mb-10 text-center pt-8 border-t border-gray-100">
               <p className="font-bold text-secondary mb-2">Questions about our Terms?</p>
               <p>Contact us at <a href="mailto:esteelconcepts@gmail.com" className="text-primary hover:underline">esteelconcepts@gmail.com</a></p>
            </section>
          </div>
        </Container>
      </Section>
    </>
  );
}
