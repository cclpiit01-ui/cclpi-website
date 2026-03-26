import React from 'react';
import { Reveal } from "@/components/animation/Reveal";
import PageHeader from "@/components/ui/PageHeader";
import PDFCard from "@/components/ui/PDFCard";
import QuickPublicationNav from "@/components/ui/QuickPublicationNav";
import { getDocUrl, DOC_FOLDERS } from "@/lib/constants";

const reports = [
  { id: 1, year: "2024", file: getDocUrl(DOC_FOLDERS.REPORTS, "Annual-Report-2024.pdf") },
  { id: 2, year: "2023", file: getDocUrl(DOC_FOLDERS.REPORTS, "Annual-Report-2023.pdf") },
  { id: 3, year: "2022", file: getDocUrl(DOC_FOLDERS.REPORTS, "Annual-Report-2022.pdf") },
  { id: 4, year: "2021", file: getDocUrl(DOC_FOLDERS.REPORTS, "Annual-Report-2021.pdf") },
  { id: 5, year: "2020", file: getDocUrl(DOC_FOLDERS.REPORTS, "Annual-Report-2020.pdf") },
  { id: 6, year: "2019", file: getDocUrl(DOC_FOLDERS.REPORTS, "Annual-Report-2019.pdf") },
  { id: 7, year: "2018", file: getDocUrl(DOC_FOLDERS.REPORTS, "Annual-Report-2018.pdf") },
  { id: 8, year: "2017", file: getDocUrl(DOC_FOLDERS.REPORTS, "Annual-Report-2017.pdf") },
];


export default function AnnualReport() {
  return (
    <>
      <PageHeader 
        title="Annual Reports" 
        subtitle="A comprehensive review of our yearly performance and financial highlights." 
      />
      
      <section className="py-24 px-6 bg-brand-surface">
        <div className="max-w-6xl mx-auto">
          {/* Grid Layout para sa maraming reports */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map((report) => (
              <Reveal key={report.id}>
                <PDFCard 
                  title={`Annual Report ${report.year}`}
                  description={`Year-end summary and performance audit for ${report.year}.`}
                  file={report.file}
                  zoomScale="110" // Standard zoom para sa reports
                  scrollSpeed="10000ms" // Mas mabagal na scroll dahil mas mahaba ang annual reports kaysa COR
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