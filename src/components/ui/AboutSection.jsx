import React from 'react';
import TeamPhoto from '@/assets/Cclpipic.png';

const AboutUs = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        {/* Image Side */}
        <div className="w-full md:w-1/2">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            
            <img 
              src={TeamPhoto} 
              alt="CCLPI Team" 
              className="relative rounded-lg shadow-2xl w-full h-auto object-cover transform transition duration-500 hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* Text Side */}
        <div className="w-full md:w-1/2 space-y-6">
          <h2 className="text-4xl font-extrabold text-brand-primary tracking-tight">
            Securing Tomorrow with <span className="text-brand-secondary">Care & Commitment</span>
          </h2>
          <div className="w-20 h-1.5 bg-brand-accent ml-0 mt-4 rounded-full"></div>

          <p className="text-lg text-gray-600 leading-relaxed">
            At <strong>Cosmopolitan Climbs Life Plan, Inc. (CCLPI Plans)</strong>, 
            we believe that true love means being prepared for life’s 
            inevitable moments. Since our founding, our mission has been 
            to provide Filipino families with dignity, security, and peace of mind.
          </p>

          <p className="text-lg text-gray-600 leading-relaxed">
            Through our flagship product, <strong>Angelica Life Plan</strong>, 
            we offer a fixed-value life plan with increasing memorial benefits — 
            ensuring that when the time comes, families are protected from 
            financial burden and emotional stress. With affordable payment terms, 
            nationwide service coverage, and 24/7 assistance, we stand beside 
            our policyholders every step of the way.
          </p>

          <div className="pt-4">
            <button className="bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300">
              Discover Angelica Life Plan
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutUs;