import React, { useState } from 'react';
import { Landmark, Info, Mail, PhoneCall, Smartphone, ShieldCheck } from 'lucide-react';

// Import bank and payment logos from your assets/payment folder
import bdoLogo from "@/assets/payment/bdo-logo.jpg";
import bpiLogo from "@/assets/payment/bpi-logo.jpg";
import chinaLogo from "@/assets/payment/china-logo.jpg";
import landbankLogo from "@/assets/payment/landbank-copy.jpg";
import mbLogo from "@/assets/payment/mb-logo.jpg";
import gcashLogo from "@/assets/payment/gcash.jpg";
import pnbLogo from "@/assets/payment/pnb-logo.jpg";


const bankAccounts = [
  { name: "BDO", acc: "00316-01697-87", logo: bdoLogo },
  { name: "BPI", acc: "232-100-1516", logo: bpiLogo },
  { name: "CHINA BANK – CDO", acc: "127-4000-10269", logo: chinaLogo },
  { name: "CHINA BANK – CEBU", acc: "117-9000-02879", logo: chinaLogo },
  { name: "LAND BANK", acc: "000152-1059-67", logo: landbankLogo },
  { name: "METRO BANK", acc: "037-70375-21660", logo: mbLogo },
  { name: "PNB", acc: "4103 7001 1913", logo: pnbLogo },


];

export const PaymentFaq = () => {
  const [paymentTab, setPaymentTab] = useState('bank');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-100 mb-6 bg-slate-50/50 rounded-t-xl overflow-x-auto scrollbar-hide">
        {['bank', 'gcash', 'bdo'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setPaymentTab(tab)} 
            className={`flex-1 min-w-[100px] py-4 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${
              paymentTab === tab ? 'text-brand-secondary border-b-2 border-brand-secondary bg-white' : 'text-slate-400'
            }`}
          >
            {tab === 'bank' ? 'Bank Transfer' : tab === 'gcash' ? 'GCash' : 'BDO Pay'}
          </button>
        ))}
      </div>

      {/* 1. BANK TRANSFER TAB */}
      {paymentTab === 'bank' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-brand-primary border border-blue-100">
            <ShieldCheck size={18} className="text-brand-secondary shrink-0" />
            <p className="text-[10px] md:text-[11px] font-black uppercase tracking-wider">
              Account Name: <span className="text-brand-secondary">Cosmopolitan CLIMBS Life Plan Inc.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bankAccounts.map((b, i) => (
              <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 group hover:border-brand-secondary transition-all shadow-sm hover:shadow-md">
                <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center border border-slate-50">
                   <img src={b.logo} alt={b.name} className="w-full h-full object-contain p-1" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{b.name}</span>
                  <span className="text-sm font-mono font-bold text-brand-primary group-hover:text-brand-secondary transition-colors">{b.acc}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-brand-primary p-6 rounded-[2rem] text-white relative overflow-hidden">
             <div className="relative z-10">
                <h4 className="text-brand-accent font-black text-xs uppercase mb-3 tracking-widest">Verification:</h4>
                <p className="text-sm opacity-90 leading-relaxed mb-4">Email <strong>Proof of Payment</strong> + <strong>Valid ID</strong> to:</p>
                <div className="flex flex-col gap-3">
                   <a href="mailto:cclpi.payments@cclpi.com.ph" className="flex items-center gap-3 text-brand-secondary font-bold hover:text-white transition-colors"><Mail size={18} /> cclpi.payments@cclpi.com.ph</a>
                   <div className="flex items-center gap-3 text-sm opacity-80"><PhoneCall size={18} /> +63 968 853 0558</div>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          </div>
        </div>
      )}

      {/* 2. GCASH TAB */}
      {paymentTab === 'gcash' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center">
            <img src={gcashLogo} alt="GCash" className="h-12 object-contain mb-6" />
            <div className="w-full space-y-3">
              {[
                "Login to GCash App", 
                "Tap 'Pay Bills' > 'Insurance'", 
                "Search & Select 'CCLPI'", 
                "Enter Policy Number & Name", 
                "Review and Confirm Payment"
              ].map((text, i) => (
                <div key={i} className="flex gap-4 items-center p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                  <span className="bg-brand-secondary text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shrink-0">{i+1}</span>
                  <p className="text-sm font-bold text-slate-700">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. BDO PAY TAB */}
      {paymentTab === 'bdo' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-[#003da5] p-8 rounded-[2.5rem] shadow-lg text-white">
            <div className="flex justify-between items-start mb-8">
               <div className="bg-white p-2 rounded-lg"><img src={bdoLogo} alt="BDO" className="h-6" /></div>
               <Smartphone size={24} className="text-white/50" />
            </div>
            <h4 className="font-heading font-black text-xl uppercase  mb-6">Mobile App Payment</h4>
            <div className="space-y-4">
              {[
                { label: "Step 1", val: "Open BDO Pay app and Tap 'Pay'" },
                { label: "Step 2", val: "Tap 'Pay Bills' and search: (CCLPI PLANS)" },
                { label: "Step 3", val: "Input 7 Digits Policy No. (0XXXXXXX) & Name" },
                { label: "Step 4", val: "Select source account and Tap 'Pay'" }
              ].map((step, i) => (
                <div key={i} className="border-l-2 border-brand-accent/30 pl-4 py-1">
                  <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest">{step.label}</p>
                  <p className="text-sm font-medium">{step.val}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl flex gap-4 items-center">
             <div className="p-2 bg-white rounded-full shadow-sm"><Info size={20} className="text-[#003da5]" /></div>
             <p className="text-[11px] font-bold text-[#003da5] uppercase tracking-tight">
                Important: Use Biller Name <span className="bg-yellow-200 px-1 italic">CCLPI PLANS</span> only.
             </p>
          </div>
        </div>
      )}
    </div>
  );
};