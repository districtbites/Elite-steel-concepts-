import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export default function FleetExpansionPage() {
  return (
    <div className="pt-24">
      <Section className="bg-white">
        <Container>
           <h1 className="text-5xl md:text-6xl font-black uppercase text-secondary mb-8">Fleet Expansion</h1>
           <p className="text-xl text-gray-600 max-w-3xl mb-12 leading-relaxed">
             Scaling your mobile food empire? We offer standardized build processes for multi-unit operators and franchises. Ensure consistency across your entire fleet with our scalable manufacturing solutions.
           </p>
           
           <div className="bg-gray-50 border border-gray-100 rounded-lg p-10 mb-12 flex flex-col md:flex-row items-center gap-10">
               <div className="flex-1">
                   <h3 className="text-3xl font-bold uppercase text-secondary mb-4">Consistent Quality at Scale</h3>
                   <p className="text-gray-600 mb-6">
                       Whether you need 5 trucks or 50, we deliver identical build quality, equipment layouts, and branding. Streamline your operations with a standardized fleet.
                   </p>
                   <ul className="space-y-2 font-bold text-secondary">
                       <li>✓ Volume Pricing Available</li>
                       <li>✓ Dedicated Project Management</li>
                       <li>✓ Rapid Deployment Schedules</li>
                   </ul>
               </div>
               <div className="flex-1 bg-white p-8 rounded border border-gray-200 shadow-sm w-full">
                   <h4 className="font-bold text-secondary uppercase mb-4 text-center">Perfect For</h4>
                   <ul className="space-y-4 text-gray-600">
                       <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span> Restaurant Chains going Mobile</li>
                       <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span> Corporate Promotional Vehicles</li>
                       <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span> Franchise Operations</li>
                       <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span> University & Campus Dining</li>
                   </ul>
               </div>
           </div>

           <Button href="/contact">Discuss Fleet Options</Button>
        </Container>
      </Section>
    </div>
  );
}
