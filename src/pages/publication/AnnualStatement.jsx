import React from 'react';
import PageHeader from "@/components/ui/PageHeader";
import { Reveal } from "@/components/animation/Reveal";
import PDFCard from "@/components/ui/PDFCard";
import QuickPublicationNav from "@/components/ui/QuickPublicationNav";
import { getDocUrl, DOC_FOLDERS } from "@/lib/constants";


const statements = [
  { id: 1, year: "2024", file: getDocUrl(DOC_FOLDERS.STATEMENTS, "Annual-Statement-2024.pdf") },
  { id: 2, year: "2023", file: getDocUrl(DOC_FOLDERS.STATEMENTS, "Annual-Statement-2023.pdf") },
  { id: 3, year: "2022", file: getDocUrl(DOC_FOLDERS.STATEMENTS, "Annual-Statement-2022.pdf") },
  { id: 4, year: "2021", file: getDocUrl(DOC_FOLDERS.STATEMENTS, "Annual-Statement-2021.pdf") },
  { id: 5, year: "2020", file: getDocUrl(DOC_FOLDERS.STATEMENTS, "Annual-Statement-2020.pdf") },
  { id: 6, year: "2019", file: getDocUrl(DOC_FOLDERS.STATEMENTS, "Annual-Statement-2019.pdf") },
  { id: 7, year: "2018", file: getDocUrl(DOC_FOLDERS.STATEMENTS, "Annual-Statement-2018.pdf") },
];

export default function AnnualStatement() {
  return (
    <>
      <PageHeader
        title="Annual Statement"
        subtitle="Transparent financial reporting and yearly operational summaries."
      />

      <section className="py-24 px-6 bg-brand-surface">
        <div className="max-w-6xl mx-auto">
          {/* Section Heading */}


          {/* Grid Layout for Multiple Statements */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {statements.map((statement) => (
              <Reveal key={statement.id}>
                <PDFCard 
                  title={`Annual Statement ${statement.year}`}
                  description={`Official financial statement and transparency report for the year ${statement.year}.`}
                  file={statement.file}
                  zoomScale="115"
                  scrollSpeed="9000ms" // 9 seconds para sa sapat na preview time
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