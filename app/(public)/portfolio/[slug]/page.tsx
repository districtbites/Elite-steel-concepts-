import React from "react";
import { getProjectBySlug } from "@/lib/db";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Truck } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return notFound();
  }

  return (
    <>
      {/* Hero / Image */}
      <div className="relative h-[50vh] md:h-[60vh] bg-gray-900">
        <Image 
            src={project.image} 
            alt={project.title} 
            fill 
            className="object-cover opacity-80"
            priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <Container className="relative h-full flex flex-col justify-end pb-16 pt-32">
            <Link href="/portfolio" className="inline-flex items-center text-white/70 hover:text-primary transition-colors mb-6 text-sm font-bold uppercase tracking-wider">
                <ArrowLeft size={16} className="mr-2" /> Back to Portfolio
            </Link>
            <span className="bg-primary text-secondary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded w-fit mb-4">
                {project.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-black uppercase text-white mb-2 tracking-tight">{project.title}</h1>
        </Container>
      </div>

      <Section className="bg-white">
        <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-8">
                    <h2 className="text-2xl font-black uppercase text-secondary mb-6 tracking-tight">Project Overview</h2>
                    <p className="text-lg text-gray-600 leading-loose whitespace-pre-wrap">
                        {project.description}
                    </p>
                </div>

                {/* Sidebar Details */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-gray-50 border border-gray-100 p-8 rounded-xl">
                        <h3 className="text-xl font-black uppercase text-secondary mb-6 border-b border-gray-200 pb-2 tracking-tight">Project Specs</h3>
                        
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <User className="text-primary mt-1 shrink-0 mr-3" size={20} />
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm uppercase">Client</h4>
                                    <p className="text-gray-600">{project.client || "Private Client"}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Calendar className="text-primary mt-1 shrink-0 mr-3" size={20} />
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm uppercase">Completion Date</h4>
                                    <p className="text-gray-600">{project.completionDate || "Recently Completed"}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <Truck className="text-primary mt-1 shrink-0 mr-3" size={20} />
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm uppercase">Vehicle Type</h4>
                                    <p className="text-gray-600">{project.category}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                             <h4 className="font-bold text-secondary mb-2">Inspired by this build?</h4>
                             <p className="text-sm text-gray-500 mb-4">Get a custom quote for a similar project.</p>
                             <Button href="/quote" className="w-full text-center">Request Quote</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
      </Section>
    </>
  );
}
