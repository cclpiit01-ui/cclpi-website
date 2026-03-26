import React, { forwardRef } from "react";
import { CheckCircle2, Globe } from "lucide-react";
import LogoImg from '@/assets/logo.png';
import { MapPin } from 'lucide-react';
import DefaultStaffImg from '@/assets/candy.jpg';  

const JobPoster = forwardRef(({ data, staffPhoto }, ref) => {
  const textToList = (text) =>
    text ? text.split("\n").filter((item) => item.trim() !== "") : [];

  return (
    <div
      ref={ref}
      className="relative w-[650px] h-[840px] bg-[#0b3d91] overflow-hidden font-sans"
    >
      {/* ================= LOGO ================= */}
      <div className="absolute top-10 right-10 z-30">
        <div className=" p-[10px]">
          <img 
            src={LogoImg} 
            alt="CCLPI Logo" 
            crossOrigin="anonymous"
            className="w-auto h-16 object-contain" 
          />
        </div>
      </div>

      {/* ================= LEFT CONTENT ================= */}
      <div className="relative z-20 p-12">
        <h1 className="text-[#ffcc00] text-[82px] font-black leading-none drop-shadow-md">
          WE'RE
        </h1>

        <h1 className="text-white text-[82px] font-black leading-[0.8] tracking-tighter uppercase">
          HIRING
        </h1>

        {/* POSITION BADGE */}
        <div className="mt-6 bg-white rounded-[30px] py-4 px-6 inline-flex flex-col items-center justify-center shadow-xl border-b-4 border-gray-300 w-[260px] min-h-[90px] overflow-hidden">
        <h2 
            className="font-black text-slate-800 tracking-tight uppercase leading-none px-2 text-center"
            style={{
            // Automatic scaling base sa character count
            fontSize: data.position.length > 25 ? '16px' : data.position.length > 15 ? '20px' : '24px',
            display: '-webkit-box',
            WebkitLineClamp: '2', // Max 2 lines bago mag-wrap nang maayos
            WebkitBoxOrient: 'vertical',
            }}
        >
            {data.position}
        </h2>
        
        <p className="text-slate-400 text-[11px] font-bold tracking-[0.3em] uppercase mt-2 border-t border-gray-100 pt-1 w-full text-center ">
            {data.area}
        </p>
        </div>
        {/* DESCRIPTION / BRIEF */}
        <div className=" max-w-[380px]  text-white">
        <div className="mt-3 pb-6"> {/* Dinagdagan ang horizontal padding */}
        <p 
            className="text-white text-[12px] leading-[1.5] font-semibold text-justify"
            style={{ 
                maxWidth: '280px',
                hyphens: 'none',
                WebkitHyphens: 'none',
                textAlign: 'left', // Mas safe kaysa justify para iwas sa "wide gaps"
                overflowWrap: 'anywhere', // Siguradong hindi lalampas sa container
                wordBreak: 'keep-all'

            }}
        >
            {data.description}
        </p>
        </div>
          <section>
            <h4 className="bg-white text-slate-800 px-6 py-1 rounded-full text-xs font-black inline-block mb-4 uppercase">
              Job Brief
            </h4>
            <p className="text-[12px] leading-[1.5] font-semibold text-justify pb-6"
            style={{ 
                maxWidth: '280px',
                hyphens: 'none',
                WebkitHyphens: 'none',
                textAlign: 'left', // Mas safe kaysa justify para iwas sa "wide gaps"
                overflowWrap: 'anywhere' // Siguradong hindi lalampas sa container
           
            }}
            >
              {data.brief}
            </p>
          </section>

          <section>
            <h4 className="bg-white text-slate-900 px-6 py-1 rounded-full text-xs font-black inline-block mb-4 uppercase">
              Educational Requirement
            </h4>
            <div className="space-y-3">
              {textToList(data.education).map((edu, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <CheckCircle2 size={16} className=" text-white flex-shrink-0" />
                  <p className="text-[12px] mt-0.3 font-semibold leading-tight "
                  style={{ 
                    maxWidth: '250px',
                    hyphens: 'none',
                    WebkitHyphens: 'none',
                    textAlign: 'left', // Mas safe kaysa justify para iwas sa "wide gaps"
                    overflowWrap: 'anywhere' // Siguradong hindi lalampas sa container
                    }}
                  >
                    {edu}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* ================= WHITE CURVE PANEL ================= */}
      <div className="absolute top-[230px] right-0 w-[45%] h-[63%] bg-white rounded-tl-[80px] pt-24 px-5 pb-12 flex flex-col z-10">
        {/* CIRCLE IMAGE - Using Fixed Staff Asset */}
        <div className="absolute -top-28 right-14">
          <div className="w-54 h-54 rounded-full border-[14px] border-yellow-400 bg-slate-100 overflow-hidden ">
            <img
              src={staffPhoto || DefaultStaffImg} 
              alt="Staff"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-[#0b3d91] font-black text-2xl mb-2 uppercase tracking-tight">
            Competencies:
          </h4>
          <div className="space-y-4">
            {textToList(data.competencies).map((item, i) => (
              <div key={i} className="flex gap-3 items-start text-slate-800">
                <CheckCircle2 size={20} className=" text-[#0b3d91] flex-shrink-0" />
                <p className="text-[14px] font-extrabold leading-tight whitespace-pre-wrap">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= FOOTER (FIXED DESIGN) ================= */}
      <div className="absolute bottom-10 w-full h-[130px] bg-brand-accent flex items-center justify-between px-12 z-30">
      <div className="flex flex-col gap-2 items-start">
            {/* NEW PARAGRAPH ABOVE APPLY NOW */}
            <p className="text-[#0b3d91] text-[11px] font-black uppercase tracking-wider leading-none ml-2">
            Applicants are required to submit an application letter, resume and TOR.
            </p>
        <div className="bg-white rounded-full py-2 px-12 flex items-center gap-4  border-b-4 border-yellow-600">
          <span className="text-[#0b3d91] font-black text-2xl tracking-tight">
            APPLY NOW
          </span>
          <div className=" text-brand-primary w-12 h-12 rounded-full flex items-center justify-center text-5xl">
            »
          </div>
        </div>
        </div>

        {/* FIXED CONTACT DETAILS */}
        <div className="text-right text-brand-primary">
          <h5 className="text-xl font-black leading-none">
            Virgin Mary S. Roxas
          </h5>
          <p className="text-xs font-bold uppercase opacity-70 mb-1">
            Administrative Assistant
          </p>
          <h4 className="text-2xl font-black tracking-tight">
            +639 688 564 627
          </h4>
          <p className="text-lg font-black underline tracking-tight">
            cclpi.careers@gmail.com
          </p>
        </div>
      </div>

      {/* ================= ADDRESS & WEBSITE STRIP ================= */}
      <div className="absolute bottom-0 right-0 w-full h-12 bg-transparent flex justify-between items-center px-12 z-40">
        {/* Website Section */}
        <div className="flex items-center gap-2 text-white/90 drop-shadow-md">
          <Globe size={16} />
          <span className="text-xs font-black tracking-tighter uppercase">www.cclpi.com.ph</span>
        </div>

        {/* Address Section */}
        <div className="absolute bottom-0 right-0 h-12 w-[400px] bg-slate-100 rounded-tl-[30px] flex items-center px-6 gap-3 shadow-md border-t border-l border-white/50">
        <MapPin size={16} className="text-brand-primary fill-brand-primary/10 flex-shrink-0" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">
            5/F CLIMBS Bldg., Tiano-Pacana Sts., Cagayan de Oro City
          </p>
        </div>
      </div>
    </div>
  );
});

export default JobPoster;