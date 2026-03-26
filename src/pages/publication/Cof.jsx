import React from 'react';
import { Reveal } from "@/components/animation/Reveal";
import PageHeader from "@/components/ui/PageHeader";
import PDFCard from "@/components/ui/PDFCard";
import QuickPublicationNav from "@/components/ui/QuickPublicationNav";
import { getDocUrl, DOC_FOLDERS } from "@/lib/constants";


const certificates = [
  { id: 1, title: "COR 2026", file: getDocUrl(DOC_FOLDERS.CERTIFICATES, "Certificate-of-Registration-2026.pdf") },
  { id: 2, title: "COR 2025", file: getDocUrl(DOC_FOLDERS.CERTIFICATES, "Certificate-of-Registration-2025.pdf") },
  { id: 3, title: "COR 2024", file: getDocUrl(DOC_FOLDERS.CERTIFICATES, "Certificate-of-Registration-2024.pdf") },
  { id: 4, title: "COR 2023", file: getDocUrl(DOC_FOLDERS.CERTIFICATES, "Certificate-of-Registration-2023.pdf") },
];

export default function Cof() {
  return (
    <>
      <PageHeader title="Certificate of Registration" subtitle="Official business documentation." />
      
      <section className="py-24 px-6 bg-brand-surface">
        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert) => (
              <Reveal key={cert.id}>
                <PDFCard 
                  title={cert.title}
                  description={cert.description}
                  file={cert.file}
                  zoomScale="125"
                />
              </Reveal>
            ))}
          </div>
          
        </div>
        <QuickPublicationNav />
      </section>
    </>
  );
}