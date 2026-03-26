import React from 'react';
import PageHeader from "@/components/ui/PageHeader";
import { Reveal } from "@/components/animation/Reveal";
import PDFCard from "@/components/ui/PDFCard";
import QuickPublicationNav from "@/components/ui/QuickPublicationNav";
import { getDocUrl, DOC_FOLDERS } from "@/lib/constants";

const ArticlesOfIncorporationPDF = getDocUrl(DOC_FOLDERS.INCORPORATION, "Articles-of-Incorporation.pdf");

export default function ArticlesOfIncorporation() {
  return (
    <>
      {/* Page Header */}
      <PageHeader
        title="Articles of Incorporation"
        subtitle="Our founding documents and legal framework as a corporate entity."
      />

      {/* Page Content */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Title */}


          {/* Centered PDF Card */}
          <div className="flex justify-center items-center">
            {/* max-w-lg ang ginamit ko rito para medyo mas malapad nang kaunti sa 'md' 
                dahil karaniwang maraming text ang Articles of Incorporation */}
            <div className="w-full max-w-lg"> 
              <Reveal direction="bottom">
                <PDFCard 
                  title="Articles of Incorporation"
                  description="Certified true copy of the company's articles of incorporation and by-laws."
                  file={ArticlesOfIncorporationPDF}
                  zoomScale="120" // Slightly higher zoom for readability
                  scrollSpeed="15000ms" // Slower scroll (15s) because these documents are usually very long
                />
              </Reveal>
            </div>
          </div>
          <QuickPublicationNav />
        </div>
      </section>
    </>
  );
}