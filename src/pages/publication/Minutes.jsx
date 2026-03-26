import React from 'react';
import PageHeader from "@/components/ui/PageHeader";
import { Reveal } from "@/components/animation/Reveal";
import PDFCard from "@/components/ui/PDFCard";
import QuickPublicationNav from "@/components/ui/QuickPublicationNav";
import { getDocUrl, DOC_FOLDERS } from "@/lib/constants";
// I-import ang lahat ng Minutes mula sa iyong assets/documents/minutes folder


const minutesList = [
  { id: 1, title: "7th Annual Stockholders Meeting", file: getDocUrl(DOC_FOLDERS.MINUTES, "7th-ASM-Minutes.pdf"), meeting: "7th" },
  { id: 2, title: "6th Annual Stockholders Meeting", file: getDocUrl(DOC_FOLDERS.MINUTES, "6th-ASM-Minutes.pdf"), meeting: "6th" },
  { id: 3, title: "5th Annual Stockholders Meeting", file: getDocUrl(DOC_FOLDERS.MINUTES, "5th-ASM-Minutes.pdf"), meeting: "5th" },
  { id: 4, title: "4th Annual Stockholders Meeting", file: getDocUrl(DOC_FOLDERS.MINUTES, "4th-ASM-Minutes.pdf"), meeting: "4th" },
  { id: 5, title: "3rd Annual Stockholders Meeting", file: getDocUrl(DOC_FOLDERS.MINUTES, "3rd-ASM-Minutes.pdf"), meeting: "3rd" },
];

export default function Minutes() {
  return (
    <>
      <PageHeader 
        title="Minutes of Meetings" 
        subtitle="Official records of the proceedings and resolutions of the Annual Stockholders' Meetings." 
      />

      <section className="py-24 px-6 bg-brand-surface">
        <div className="max-w-6xl mx-auto">
          

          {/* Grid Layout for Minutes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {minutesList.map((item) => (
              <Reveal key={item.id} direction="bottom">
                <PDFCard 
                  title={item.title}
                  description={`Official documentation of the ${item.meeting} Annual Stockholders' Meeting proceedings and votes.`}
                  file={item.file}
                  zoomScale="115"
                  scrollSpeed="11000ms" // Medyo mabagal para mabasa ang attendance at resolutions
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