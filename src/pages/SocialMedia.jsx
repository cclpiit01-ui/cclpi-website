import React from 'react';
import PageHeader from "@/components/ui/PageHeader";
import { Reveal } from "@/components/animation/Reveal";
import { FacebookProvider, Page } from 'react-facebook';

export default function SocialMedia() {
  return (
    <>
      <PageHeader
        title="Social Media"
        subtitle="Connect with us and stay updated with our community stories."
      />

      <section className="py-24 px-6 bg-brand-surface">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* LEFT SIDE: TEXT & INFO (Para mapuno ang space) */}
            <div className="space-y-8">
              <Reveal direction="left">
                <h2 className="text-brand-primary font-heading font-black text-5xl uppercase leading-tight">
                  Be Part of Our <br />
                  <span className="text-brand-accent">Online Community</span>
                </h2>
                <div className="w-20 h-2 bg-brand-accent rounded-full mt-4" />
                
                <p className="text-slate-600 text-lg leading-relaxed mt-6">
                  Follow **Cosmopolitan Climbs Life Plan, Inc.** on Facebook to get the latest 
                  announcements, service updates, and inspirational stories from our members. 
                </p>

                <div className="space-y-4 pt-6">
                  <div className="flex items-center gap-4 text-brand-primary font-bold">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">👍</div>
                    <span>Daily Updates & News</span>
                  </div>
                  <div className="flex items-center gap-4 text-brand-primary font-bold">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">💬</div>
                    <span>Direct Customer Support</span>
                  </div>
                  <div className="flex items-center gap-4 text-brand-primary font-bold">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">📸</div>
                    <span>Event Highlights</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* RIGHT SIDE: FACEBOOK FEED (Sakto ang 500px dito) */}
            <div className="flex justify-center lg:justify-end">
              <Reveal direction="right">
                <div className="bg-white p-2  shadow-md border border-slate-100 overflow-hidden">
                  <FacebookProvider appId="YOUR_APP_ID">
                    <Page 
                      href="https://www.facebook.com/cclpi" 
                      tabs="timeline" 
                      width="500" // Ito ang max width ng Facebook
                      height="800" // Ginawa nating mas mahaba para "feel" na malaki
                      smallHeader={false}
                      adaptContainerWidth={true}
                      hideCover={false}
                      showFacepile={true}
                    />
                  </FacebookProvider>
                </div>
              </Reveal>
            </div>

          </div>

          {/* Social Links Footer */}
          <Reveal direction="bottom">
            <div className="mt-24 pt-12 border-t border-slate-200 text-center">
              <p className="text-brand-primary font-bold uppercase tracking-[0.3em] text-xs mb-8">
                Explore our other channels
              </p>
              <div className="flex justify-center gap-12 text-slate-400 font-black text-sm tracking-widest">
                <span className="hover:text-brand-accent cursor-pointer transition-all">INSTAGRAM</span>
                <span className="hover:text-brand-accent cursor-pointer transition-all">YOUTUBE</span>
                <span className="hover:text-brand-accent cursor-pointer transition-all">LINKEDIN</span>
              </div>
            </div>
          </Reveal>

        </div>
      </section>
    </>
  );
}