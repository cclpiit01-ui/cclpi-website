import React, { useState } from 'react';
import { Smartphone, Landmark, Mail, Phone, Info, CheckCircle2 } from 'lucide-react';

const PaymentFAQ = () => {
  const [activeTab, setActiveTab] = useState('bank');

  const bankAccounts = [
    { bank: "BDO", acc: "00316-01697-87" },
    { bank: "BPI", acc: "232-100-1516" },
    { bank: "China Bank (CDO)", acc: "127-4000-10269" },
    { bank: "China Bank (Cebu)", acc: "117-9000-02879" },
    { bank: "Land Bank", acc: "000152-1059-67" },
    { bank: "Metro Bank", acc: "037-70375-21660" },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden max-w-3xl mx-auto my-8">
      {/* Header */}
      <div className="bg-blue-600 p-6 text-white text-center">
        <h3 className="text-xl font-bold">How to pay via Mobile / Online / GCash?</h3>
        <p className="text-blue-100 text-sm mt-1">Select your preferred payment method below</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        <button 
          onClick={() => setActiveTab('bank')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold text-sm transition-all ${activeTab === 'bank' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Landmark size={18} /> Online Banking
        </button>
        <button 
          onClick={() => setActiveTab('gcash')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold text-sm transition-all ${activeTab === 'gcash' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Smartphone size={18} /> GCash / *143#
        </button>
      </div>

      <div className="p-8">
        {activeTab === 'bank' ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 mb-4">
               <div className="h-2 w-2 bg-blue-600 rounded-full" />
               <p className="font-bold text-slate-800">Account Name: <span className="text-blue-600 uppercase">Cosmopolitan CLIMBS Life Plan Inc.</span></p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {bankAccounts.map((item, i) => (
                <div key={i} className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase">{item.bank}</span>
                  <span className="text-xs font-mono font-bold text-blue-700">{item.acc}</span>
                </div>
              ))}
            </div>

            {/* Email Verification Box */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center gap-2 mb-3 text-blue-800">
                <Mail size={18} />
                <span className="font-bold">Step 2: Submit Proof of Payment</span>
              </div>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Email your receipt + <span className="font-bold">1 Valid ID</span> (Company or Gov ID) to:
              </p>
              <a href="mailto:cclpi.billing@gmail.com" className="block w-full bg-white border border-blue-200 text-center py-2 rounded-xl text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-all mb-4">
                cclpi.billing@gmail.com
              </a>
              <div className="flex items-center gap-4 text-xs text-slate-500 font-medium border-t border-blue-100 pt-4">
                <div className="flex items-center gap-1"><Phone size={12}/> 09688877716</div>
                <div className="flex items-center gap-1"><Phone size={12}/> 09178523750</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* GCash App Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                 <div className="h-6 w-6 bg-blue-600 text-white rounded-lg flex items-center justify-center text-[10px] font-bold italic">G</div>
                 <h4 className="font-bold text-slate-800 uppercase tracking-tight">Via GCash App</h4>
              </div>
              
              <div className="space-y-3">
                {["Login to GCash App", "Click 'Pay Bills'", "Select 'Insurance' category", "Search & Click 'CCLPI'", "Input Policy #, Name, & Amount", "Confirm Transaction"].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="w-5 h-5 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-[10px] font-bold">{i+1}</span>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* USSD Section */}
            <div className="p-6 bg-slate-900 rounded-2xl text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Smartphone size={80} />
               </div>
               <h4 className="text-blue-400 font-bold text-sm mb-4">No App? Use *143# (USSD)</h4>
               <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                 Dial <span className="text-white font-bold">*143#</span> → GCash (9) → Pay Bills (5) → By Category (2) → More (6) → Insurance (3) → <span className="text-blue-400 font-bold underline">CCLPI (4)</span>
               </p>
               <div className="bg-slate-800 p-3 rounded-xl flex items-start gap-2 border border-slate-700">
                 <Info size={14} className="text-yellow-400 mt-1 shrink-0" />
                 <p className="text-[10px] text-slate-300">A convenience fee of <span className="text-white font-bold">₱30.00</span> will be charged for this method.</p>
               </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-xl border border-green-100">
          <CheckCircle2 size={16} />
          <p className="text-[11px] font-bold">Your payment will be verified by the billing team within 24-48 hours.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFAQ;