import React from 'react';
import { Reveal } from "@/components/animation/Reveal";
import PageHeader from "@/components/ui/PageHeader";
import { Smartphone, Landmark, CheckCircle, Mail, Info } from 'lucide-react';

// 1. Import your logos from the assets folder
import bdoLogo from "@/assets/payment/bdo.png";
import bpiLogo from "@/assets/payment/bpi.png";
import mbLogo from "@/assets/payment/metrobank.png";
import chinaLogo from "@/assets/payment/chinabank.png";
import lbLogo from "@/assets/payment/landbank.png";
import pnbLogo from "@/assets/payment/pnb-logo.jpg";
import gcashLogo from "@/assets/payment/gcash.png"; // Fixed extension
import bdoOnlineImg from "@/assets/payment/bdo-online.png";

const Payment = () => {
  const bankAccounts = [
    { bank: "BDO (Banco De Oro)", account: "003 160 169 787", logo: bdoLogo },
    { bank: "BPI", account: "232 100 1516", logo: bpiLogo },
    { bank: "Metrobank", account: "037 703 752 1660", logo: mbLogo },
    // Use the pipe "|" to trigger the line break in the UI
    { bank: "Chinabank (Cebu/CDO)", account: "117 900 002 879 (Cebu) | 127 400 010 269 (CDO)", logo: chinaLogo },
    { bank: "Landbank", account: "0152 1059 67", logo: lbLogo },
    { bank: "PNB", account: "4103 7001 1913", logo: pnbLogo },
  ];

  return (
    <div className="bg-brand-surface min-h-screen pb-24">
      <PageHeader 
        title="Payment Channels" 
        subtitle="Convenient and secure ways to keep your plan active and protected." 
      />

      <section className="py-20 px-6 max-w-7xl mx-auto">
        
        {/* Digital & Mobile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* GCash Card */}
          <Reveal direction="left">
            <div className="bg-white p-8 rounded-[2.5rem] border border-blue-50 shadow-sm h-full flex flex-col">
              <div className="flex items-center gap-5 mb-8">
                <img src={gcashLogo} alt="GCash" className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                <div>
                  <h3 className="text-2xl font-black text-[#007dfe] uppercase">GCash</h3>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Pay via Bills</p>
                </div>
              </div>
              <ul className="space-y-4 flex-grow">
                {[
                  "Login to GCash App",
                  "Tap 'Pay Bills' > 'Insurance'",
                  "Search & Select 'CCLPI'",
                  "Enter Policy Number & Name",
                  "Confirm Payment"
                ].map((step, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-700 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-blue-50 text-[#007dfe] flex items-center justify-center text-[10px] shrink-0">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* BDO Digital Card */}
          <Reveal direction="right">
            <div className="bg-brand-primary p-8 rounded-[2.5rem] text-white shadow-xl h-full relative overflow-hidden flex flex-col">
              <div className="relative z-10">
                <div className="flex items-center gap-5 mb-8">
                  <div className="bg-white p-2 rounded-xl">
                    <img src={bdoLogo} alt="BDO" className="w-12 h-12 object-contain" />
                  </div>
                  <h3 className="text-2xl font-black uppercase italic">BDO Pay / Online</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <img src={bdoOnlineImg} alt="BDO Online" className="w-20 rounded-lg border border-white/20" />
                    <div>
                      <p className="text-brand-accent text-[10px] font-black uppercase mb-1">Mobile & Web</p>
                      <p className="text-sm leading-tight opacity-90">Search Biller: <span className="font-black">CCLPI PLANS</span></p>
                    </div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                    <Info size={20} className="text-brand-accent shrink-0" />
                    <p className="text-[11px] font-bold uppercase tracking-tighter">Available via BDO Service Assist Kiosks nationwide.</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Bank Transfer Section */}
        <Reveal direction="bottom">
          <div className="text-center mb-12">
            <h2 className="text-brand-primary font-heading font-black text-3xl uppercase">Bank Partners</h2>
            <p className="text-slate-500 font-bold">Account Name: <span className="text-brand-primary">CCLPI PLANS</span></p>
            <div className="w-16 h-1.5 bg-brand-accent mx-auto mt-4 rounded-full" />
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bankAccounts.map((item, index) => (
            <Reveal key={index} delay={index * 0.05} direction="bottom">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:shadow-xl hover:border-brand-secondary transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-50 flex items-center justify-center bg-slate-50">
                    <img src={item.logo} alt={item.bank} className="w-full h-full object-contain" />
                  </div>
                  <h4 className="font-black text-brand-primary text-sm uppercase leading-tight">{item.bank}</h4>
                </div>
                <div className="bg-brand-surface p-4 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-black uppercase mb-2">Account Number</p>
                    <div className="text-lg font-mono font-black text-slate-800 tracking-tighter leading-tight">
                        {/* BREAK LINE LOGIC: Splits by '|' and maps to divs */}
                        {item.account.split('|').map((line, i) => (
                          <div key={i} className={i > 0 ? "mt-2 pt-2 border-t border-slate-200" : ""}>
                            {line.trim()}
                          </div>
                        ))}
                    </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Proof of Payment Section */}
        <Reveal direction="bottom">
          <div className="mt-20 bg-brand-primary rounded-[2rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 border-b-8 border-brand-accent">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-brand-accent rounded-2xl flex items-center justify-center shrink-0 rotate-3">
                <CheckCircle className="text-brand-primary" size={32} />
              </div>
              <div>
                <h4 className="text-2xl font-black uppercase italic">Verify Your Payment</h4>
                <p className="text-slate-400 font-medium">Please send a photo of your deposit slip or screenshot to:</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <div className="flex items-center gap-4 bg-white/5 px-6 py-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <Mail size={18} className="text-brand-accent" />
                <span className="font-bold text-sm">cclpi.payments@cclpi.com.ph</span>
              </div>
              <div className="flex items-center gap-4 bg-white/5 px-6 py-4 rounded-2xl border border-white/10">
                <Smartphone size={18} className="text-brand-accent" />
                <span className="font-bold text-sm">0968-853-0558</span>
              </div>
            </div>
          </div>
        </Reveal>

      </section>
    </div>
  );
};

export default Payment;