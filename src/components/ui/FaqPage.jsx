import React, { useState } from 'react';
import { Reveal } from "@/components/animation/Reveal";
import { ChevronRight, PhilippinePeso, PhoneCall, ShieldCheck, ShieldAlert, RefreshCcw, UserCog, FileStack } from 'lucide-react';

// Component Imports
import FaqSearch from '@/components/faq/FaqSearch';
import ContactModal from '@/components/modals/ContactModal';

// Sub-components imports (Existing)
import { PaymentFaq } from '@/components/faq/PaymentFaq';
import { MemorialClaimsFaq } from '@/components/faq/MemorialClaimsFaq';
import { InsuranceClaimsFaq } from '@/components/faq/InsuranceClaimsFaq';
import { TerminationFaq } from '@/components/faq/TerminationFaq';
import { ReinstatementFaq } from '@/components/faq/ReinstatementFaq';
import { AmendmentFaq } from '@/components/faq/AmendmentFaq';
import { ReissuanceFaq } from '@/components/faq/ReissuanceFaq';

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleFaq = (index) => setOpenIndex(openIndex === index ? null : index);

  const faqs = [
    { title: "How to pay Mobile & Online Banking (GCash, BDO Online)?", icon: <PhilippinePeso size={18}/>, component: <PaymentFaq /> },
    { title: "How can the beneficiary claim the Memorial Service Benefits of the planholder?", icon: <PhoneCall size={18}/>, component: <MemorialClaimsFaq /> },
    { title: "How can the beneficiary claim the Insurance Benefit?", icon: <ShieldCheck size={18}/>, component: <InsuranceClaimsFaq /> },
    { title: "Plan Reinstatement Process", icon: <RefreshCcw size={18}/>, component: <ReinstatementFaq /> },
    { title: "Amendment Fees & Changes", icon: <UserCog size={18}/>, component: <AmendmentFaq /> },
    { title: "Reissuance of Policy", icon: <FileStack size={18}/>, component: <ReissuanceFaq /> },
    { title: "Plan Termination Requirements", icon: <ShieldAlert size={18}/>, component: <TerminationFaq /> },
  ];

  // Logic for filtering
  const filteredFaqs = faqs.filter(faq => 
    faq.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-brand-surface min-h-screen pb-24 font-sans">
      <div className="max-w-3xl mx-auto px-6 -mt-8 relative z-10">
        
        {/* --- REUSABLE SEARCH COMPONENT --- */}
        <Reveal direction="bottom">
          <FaqSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </Reveal>

        {/* --- FAQ LIST --- */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, i) => (
              <Reveal key={faq.title} direction="bottom" delay={i * 0.05}>
                <FaqAccordion 
                  index={i} 
                  openIndex={openIndex} 
                  toggle={toggleFaq} 
                  title={faq.title} 
                  icon={faq.icon}
                >
                  {faq.component}
                </FaqAccordion>
              </Reveal>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100 animate-in fade-in duration-500">
              <p className="text-slate-400 font-medium tracking-wide italic">
                No results found for "{searchTerm}"
              </p>
            </div>
          )}
        </div>

        {/* --- CTA SECTION --- */}
        <Reveal direction="bottom" delay={0.4}>
          <div className="mt-16 bg-brand-primary rounded-[2rem] p-8 text-center md:text-left md:flex md:items-center md:justify-between shadow-xl border-b-4 border-brand-secondary">
            <div>
              <h3 className="text-white font-black uppercase italic tracking-wider text-xl">Still have questions?</h3>
              <p className="text-brand-secondary text-sm font-medium mt-1">Our dedicated support team is here to assist you.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-6 md:mt-0 bg-brand-accent text-brand-primary px-8 py-3 rounded-lg font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white transition-all shadow-lg active:scale-95"
            >
              Talk to Support
            </button>
          </div>
        </Reveal>
      </div>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

// Internal Accordion Component
const FaqAccordion = ({ index, openIndex, toggle, title, icon, children }) => {
  const isOpen = openIndex === index;
  return (
    <div className={`transition-all duration-300 ${isOpen ? 'mb-6' : 'mb-0'}`}>
      <button 
        onClick={() => toggle(index)} 
        className={`w-full flex items-center justify-between p-5 text-left transition-all rounded-xl ${
          isOpen 
          ? 'bg-brand-primary text-white shadow-lg translate-y-[-2px]' 
          : 'bg-white text-slate-600 border border-slate-100 hover:border-brand-secondary/30 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`${isOpen ? 'text-brand-accent' : 'text-brand-secondary'}`}>
            {icon}
          </div>
          <span className="font-bold text-sm tracking-wide uppercase">{title}</span>
        </div>
        <ChevronRight className={`transition-transform duration-300 ${isOpen ? 'rotate-90 text-brand-accent' : 'text-slate-300'}`} size={18} />
      </button>
      
      {isOpen && (
        <div className="mt-2 p-8 bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50 animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
};

export default FaqPage;