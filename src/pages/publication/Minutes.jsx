import React from 'react';
import PageHeader from "@/components/ui/PageHeader";
import { Reveal } from "@/components/animation/Reveal";
import PDFCard from "@/components/ui/PDFCard";
import QuickPublicationNav from "@/components/ui/QuickPublicationNav";
import { getDocUrl, DOC_FOLDERS } from "@/lib/constants";

const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const FIRST_ASM = 3;
const LATEST_ASM = 8; //change number kung merong latest + 1

const minutesList = Array.from(
  { length: LATEST_ASM - FIRST_ASM + 1 },
  (_, i) => {
    const num = LATEST_ASM - i; // 9, 8, 7, ... 3
    const ordinal = getOrdinal(num);
    return {
      id: num,
      title: `${ordinal} Annual Stockholders Meeting`,
      file: getDocUrl(DOC_FOLDERS.MINUTES, `${ordinal}-ASM-Minutes.pdf`),
      meeting: ordinal,
    };
  }
);

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