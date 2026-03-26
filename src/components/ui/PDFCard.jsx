import React from 'react';

const PDFCard = ({ title, description, file, zoomScale = "110", scrollSpeed = "7000ms" }) => {
  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-slate-200 h-[500px] flex flex-col">
      
      {/* Card Header */}
      <div className="p-5 border-b border-slate-100 bg-white z-20">
        <h3 className="font-bold text-brand-primary truncate">{title}</h3>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>

      {/* PDF Preview Container */}
      <div className="relative flex-1 overflow-hidden bg-slate-200">
        {/* Dynamic Zoom and Scroll */}
        <div 
          className={`w-full h-[1000px] transition-transform ease-in-out origin-top`}
          style={{ 
            transitionDuration: scrollSpeed,
          }}
          // Gagamit tayo ng Tailwind arbitrary classes para sa hover scale at translate
          // Pero dahil dynamic ang speed, inline styles o Tailwind classes ay pwede
        >
          <div className={`w-full h-full transition-transform duration-[inherit] ease-in-out group-hover:-translate-y-[600px] group-hover:scale-${zoomScale}`}>
            <embed
              src={`${file}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
              type="application/pdf"
              className="w-full h-full pointer-events-none"
            />
            
            {/* Fallback overlay */}
            <div className="absolute inset-0 flex items-center justify-center -z-10 bg-slate-100">
              <p className="text-slate-400 text-xs italic text-[10px]">Loading Preview...</p>
            </div>
          </div>
        </div>
        
        {/* Transparent Overlay to capture clicks */}
        <div className="absolute inset-0 z-10 cursor-pointer" />
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-white border-t border-slate-50 flex justify-between items-center">
        <a 
          href={file} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs font-bold text-brand-secondary hover:text-blue-800 transition-colors"
        >
          OPEN PDF
        </a>
        <a 
          href={file} 
          download 
          className="bg-brand-primary text-white text-[10px] px-3 py-1.5 rounded-lg font-bold hover:bg-opacity-90 transition-all"
        >
          DOWNLOAD
        </a>
      </div>
    </div>
  );
};

export default PDFCard;