import React, { useState } from 'react';
import { 
  ChevronRight, X, FileText, PieChart, 
  Users, Gavel, ClipboardList, Calendar, 
  LayoutGrid 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const QuickPublicationNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const subMenus = [
    { name: "Certificate of Registration", path: "/publication/cof", icon: <FileText size={18} /> },
    { name: "Annual Statement", path: "/publication/annual-statement", icon: <PieChart size={18} /> },
    { name: "Corporate Governance", path: "/publication/corporate-governance", icon: <Users size={18} /> },
    { name: "Article of Incorporation", path: "/publication/article-of-incorporation", icon: <Gavel size={18} /> },
    { name: "Minutes of Meetings", path: "/publication/minutes", icon: <ClipboardList size={18} /> },
    { name: "Annual Reports", path: "/publication/annual-report", icon: <Calendar size={18} /> }
  ];

  return (
    // Positioned on the LEFT to keep it separate from your Chat/Scroll buttons on the right
    <div className="fixed bottom-8 left-8 z-50 flex flex-col items-start gap-4 pointer-events-none">
      
      {/* The Menu Panel */}
      <div className={`transition-all duration-500 origin-bottom-left ${
        isOpen 
          ? "scale-100 opacity-100 translate-y-0" 
          : "scale-75 opacity-0 translate-y-10 pointer-events-none"
      }`}>
        <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl border border-slate-100 w-[300px]">
          <div className="px-4 py-3 mb-2 border-b border-slate-50 flex justify-between items-center">
            <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">Publication Menu</h4>
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
          </div>
          
          <div className="flex flex-col gap-1">
            {subMenus.map((menu, index) => {
              const isActive = location.pathname === menu.path;
              return (
                <Link
                  key={index}
                  to={menu.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    group px-4 py-3.5 rounded-2xl flex items-center justify-between gap-4 transition-all
                    ${isActive 
                      ? "bg-brand-primary text-white shadow-lg translate-x-2" 
                      : "hover:bg-brand-surface text-slate-600 hover:text-brand-primary hover:translate-x-1"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className={`${isActive ? "text-brand-accent" : "text-slate-400 group-hover:text-brand-primary"}`}>
                      {menu.icon}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wide">
                      {menu.name}
                    </span>
                  </div>
                  <ChevronRight size={14} className={`${isActive ? "text-brand-accent" : "opacity-0 group-hover:opacity-100"}`} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Standalone Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-16 h-16 rounded-[2rem] flex flex-col items-center justify-center shadow-2xl transition-all duration-300 border-b-4 active:scale-90
          ${isOpen 
            ? "bg-brand-accent text-brand-primary border-yellow-600" 
            : "bg-white text-brand-primary border-slate-200 hover:border-brand-secondary"
          }
        `}
      >
        {isOpen ? <X size={24} /> : <LayoutGrid size={24} />}
        <span className="text-[8px] font-black uppercase mt-1 leading-none tracking-tighter">
          {isOpen ? "Close" : "Pubs"}
        </span>
      </button>
    </div>
  );
};

export default QuickPublicationNav;