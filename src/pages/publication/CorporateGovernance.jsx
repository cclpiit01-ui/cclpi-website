import React from 'react';
import PageHeader from "@/components/ui/PageHeader";
import { Reveal } from "@/components/animation/Reveal";
import PDFCard from "@/components/ui/PDFCard";
import QuickPublicationNav from "@/components/ui/QuickPublicationNav";
import { getDocUrl, DOC_FOLDERS } from "@/lib/constants";

const annualReports = [
  { id: 1, year: "2024", file: getDocUrl(DOC_FOLDERS.GOVERNANCE, "Annual-Corporate-Governance-2024.pdf") },
  { id: 2, year: "2023", file: getDocUrl(DOC_FOLDERS.GOVERNANCE, "Annual-Corporate-Governance-2023.pdf") },
  { id: 3, year: "2022", file: getDocUrl(DOC_FOLDERS.GOVERNANCE, "Annual-Corporate-Governance-2022.pdf") },
  { id: 4, year: "2021", file: getDocUrl(DOC_FOLDERS.GOVERNANCE, "Annual-Corporate-Governance-2021.pdf") },
  { id: 5, year: "2020", file: getDocUrl(DOC_FOLDERS.GOVERNANCE, "Annual-Corporate-Governance-2020.pdf") },
];
const CG_MANUAL = getDocUrl(DOC_FOLDERS.GOVERNANCE, "Corporate-Governance-Manual.pdf");

export default function CorporateGovernance() {
  return (
    <>
      <PageHeader 
        title="Corporate Governance" 
        subtitle="Our commitment to transparency, accountability, and ethical business practices." 
      />

      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          
          {/* 1. MAIN MANUAL SECTION - Centered for emphasis */}
          <Reveal direction="bottom">
            <div className="text-center mb-12">
              <h2 className="text-brand-primary font-heading font-black text-3xl uppercase">Governance Manual</h2>
              <div className="w-16 h-1 bg-brand-accent mx-auto mt-3 rounded-full" />
            </div>
            
            <div className="flex justify-center mb-24">
              <div className="w-full max-w-lg">
                <PDFCard 
                  title="Corporate Governance Manual"
                  description="The fundamental principles and framework of our corporate governance policies."
                  file={CG_MANUAL}
                  zoomScale="120"
                  scrollSpeed="12000ms"
                />
              </div>
            </div>
          </Reveal>

          {/* 2. ANNUAL REPORTS GRID */}
          <Reveal direction="bottom">
            <div className="text-center mb-12">
              <h2 className="text-brand-primary font-heading font-black text-3xl uppercase">Annual CG Reports</h2>
              <div className="w-16 h-1 bg-brand-accent mx-auto mt-3 rounded-full" />
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {annualReports.map((report) => (
              <Reveal key={report.id} direction="bottom">
                <PDFCard 
                  title={`Annual CG Report ${report.year}`}
                  description={`Yearly disclosure on the company's compliance with governance standards for ${report.year}.`}
                  file={report.file}
                  zoomScale="110"
                  scrollSpeed="9000ms"
                />
              </Reveal>
            ))}
          </div>
            <QuickPublicationNav />
        </div>
      </section>
    </>
  );
}