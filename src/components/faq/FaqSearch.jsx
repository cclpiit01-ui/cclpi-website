import React from 'react';
import { Search, X } from 'lucide-react';

const FaqSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative group mb-10 pt-10">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-secondary transition-colors">
          <Search size={18} />
        </div>
        
        <input 
          type="text" 
          value={searchTerm}
          placeholder="Search topics or keywords..." 
          className="w-full bg-white/90 backdrop-blur-md pl-11 pr-12 py-4 rounded-xl border border-slate-200 focus:border-brand-secondary focus:ring-4 focus:ring-brand-secondary/5 outline-none text-slate-600 transition-all shadow-sm font-sans"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {searchTerm && (
          <button 
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-brand-primary transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Quick Suggestions Tags */}
      <div className="mt-3 flex gap-2 flex-wrap">
        {['Payment', 'Claims', 'Policy'].map((tag) => (
          <button
            key={tag}
            onClick={() => setSearchTerm(tag)}
            className="text-[9px] font-black tracking-widest uppercase px-3 py-1 bg-brand-surface border border-slate-100 rounded-full text-slate-400 hover:text-brand-secondary hover:border-brand-secondary/30 transition-all"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FaqSearch;