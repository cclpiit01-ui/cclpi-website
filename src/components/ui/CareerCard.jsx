import React from 'react';

const CareerCard = ({ image, position, description, qualifications, type }) => {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full">
      {/* Image Header */}
      <div className="relative h-52 overflow-hidden">
        <img 
          src={image} 
          alt={position} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-sm text-brand-primary text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-widest">
            {type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-2xl font-black text-brand-primary uppercase mb-4 leading-tight">
          {position}
        </h3>
        
        <div className="space-y-6 flex-1">
          {/* Job Description */}
          <div>
            <h4 className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em] mb-2">Job Description</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Qualifications */}
          <div>
            <h4 className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em] mb-2">Qualifications</h4>
            <ul className="list-disc list-inside text-slate-600 text-sm space-y-1">
              {qualifications.map((q, index) => (
                <li key={index} className="leading-relaxed">{q}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Apply Button */}
        <button className="mt-8 w-full bg-brand-primary text-white font-bold py-4 rounded-xl hover:bg-brand-accent transition-colors duration-300 uppercase text-xs tracking-widest shadow-lg shadow-brand-primary/20">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default CareerCard;