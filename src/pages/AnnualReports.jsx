import React from 'react';
import { Download, FileText, ExternalLink } from 'lucide-react';
import { Reveal } from "@/components/animation/Reveal";
import PageHeader from "@/components/ui/PageHeader";

const ReportCard = ({ year, image, pdfUrl, delay }) => (
  <Reveal direction="bottom" delay={delay}>
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 border-b-8 border-brand-primary hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 h-full flex flex-col">
      
      {/* 8.5x11 Image Container */}
      <div className="relative aspect-[8.5/11] bg-slate-100 overflow-hidden">
        <img 
          src={image} 
          alt={`Annual Report ${year}`} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-brand-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
           <FileText className="text-white w-12 h-12" />
        </div>
        
        {/* Year Badge */}
        <div className="absolute top-4 left-4 bg-brand-accent text-brand-primary font-heading font-black px-4 py-1 rounded-full text-sm shadow-lg">
          {year}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-grow items-center text-center">
        <h3 className="text-brand-primary font-heading font-black text-xl uppercase mb-4">
          Annual Report {year}
        </h3>
        
        <p className="text-slate-500 text-xs font-sans mb-6 leading-relaxed">
          Comprehensive financial performance and operational highlights for the fiscal year {year}.
        </p>

        {/* Download Button - Customized for your brand */}
        <a 
          href={pdfUrl} 
          download 
          className="mt-auto w-full flex items-center justify-center gap-2 bg-brand-primary text-white py-3 rounded-xl font-sans font-bold text-sm tracking-widest hover:bg-brand-secondary transition-colors shadow-md group-hover:shadow-brand-primary/20"
        >
          DOWNLOAD PDF
          <Download size={18} className="group-hover:bounce-animation" />
        </a>
      </div>
    </div>
  </Reveal>
);

const AnnualReports = () => {
  // Array from 2025 down to 2017
  const reports = [
    { year: "2025", image: "/reports/thumb-2025.jpg", pdfUrl: "/files/report-2025.pdf" },
    { year: "2024", image: "/reports/thumb-2024.jpg", pdfUrl: "/files/report-2024.pdf" },
    { year: "2023", image: "/reports/thumb-2023.jpg", pdfUrl: "/files/report-2023.pdf" },
    { year: "2022", image: "/reports/thumb-2022.jpg", pdfUrl: "/files/report-2022.pdf" },
    { year: "2021", image: "/reports/thumb-2021.jpg", pdfUrl: "/files/report-2021.pdf" },
    { year: "2020", image: "/reports/thumb-2020.jpg", pdfUrl: "/files/report-2020.pdf" },
    { year: "2019", image: "/reports/thumb-2019.jpg", pdfUrl: "/files/report-2019.pdf" },
    { year: "2018", image: "/reports/thumb-2018.jpg", pdfUrl: "/files/report-2018.pdf" },
    { year: "2017", image: "/reports/thumb-2017.jpg", pdfUrl: "/files/report-2017.pdf" },
  ];

  return (
    <>
    {/* Page Header */}
    <PageHeader
      title="Annual Report"
      subtitle="  "
    />
    <section className="py-24 px-6 bg-brand-surface">
      <div className="max-w-6xl mx-auto">
        
        {/* Template Header */}
        <Reveal direction="bottom">
          <div className="text-center mb-16">
            <h2 className="text-brand-primary font-heading font-black text-4xl md:text-5xl uppercase tracking-tighter">
              Transparency & <span className="text-brand-accent">Growth</span>
            </h2>
            <div className="w-24 h-2 bg-brand-accent mx-auto mt-6 rounded-full" />
            <p className="text-slate-500 mt-6 font-sans max-w-2xl mx-auto">
              Access our annual financial statements and operational reports from 2017 to 2025. 
              We are committed to full disclosure and accountability to our planholders.
            </p>
          </div>
        </Reveal>

        {/* Grid Layout: 3 columns for desktop, 2 for tablet, 1 for mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {reports.map((report, index) => (
            <ReportCard 
              key={report.year}
              {...report}
              delay={(index % 3) * 0.1} // Staggered delay for each row
            />
          ))}
        </div>
      </div>
    </section>
    </>
  );
};

export default AnnualReports;