import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import ic from "@/assets/ic.png";;
import PaymentPartners from "@/components/ui/PaymentPartners";
import acdi from "@/assets/stockholders/acdi.png";
import aimcoop from "@/assets/stockholders/aimcoop.png";
import bdmpc from "@/assets/stockholders/bdmpc.png";
import cifc from "@/assets/stockholders/cifc.png";
import climbs from "@/assets/stockholders/climbs.png";
import cosmo from "@/assets/stockholders/cosmo.png";
import guadalupe from "@/assets/stockholders/guadalupe.png";
import incomeDavao from "@/assets/stockholders/income-davao.png";
import metroOrmoc from "@/assets/stockholders/metro-ormoc.png";
import oic from "@/assets/stockholders/oic.png";
import phcci from "@/assets/stockholders/phcci.png";
import sanfernando from "@/assets/stockholders/sanfernando.png";
import scc from "@/assets/stockholders/scc.png";
import stalucia from "@/assets/stockholders/stalucia.png";
import tagum from "@/assets/stockholders/tagum.png";
import tanHassani from "@/assets/stockholders/tan-hassani.png";
import toril from "@/assets/stockholders/toril.png";




const logos = [climbs, cosmo, oic, acdi, aimcoop, bdmpc, cifc, guadalupe, incomeDavao, metroOrmoc, phcci, sanfernando, scc, stalucia, tagum, tanHassani,  toril];

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-[#f6fbfe]">

<div className="max-w-7xl mx-auto px-6 py-16 overflow-hidden w-full">
  <div>
    {/* GROUP */}
    <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12">

      {/* LABEL */}
      <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4 shrink-0">
        <span className="hidden lg:block w-1 h-10 bg-brand-primary"></span>
        <h4 className="text-xl font-bold text-brand-primary leading-tight text-center lg:text-right">
          OUR<br />STOCKHOLDERS
        </h4>
      </div>

      {/* LOGOS */}
      <div className="relative w-full overflow-hidden w-full">
        <div
          className="flex w-max items-center gap-8 lg:gap-14 will-change-transform"
          style={{ animation: "scroll 30s linear infinite" }}
        >
          {[...logos, ...logos].map((logo, i) => (
            <img
              key={i}
              src={logo}
              alt="partner"
              className="h-12 lg:h-16 object-contain opacity-80 shrink-0"
            />
          ))}
        </div>
      </div>

    </div>
  </div>

  <style>{`
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `}</style>
</div>



      {/* TOP SECTION */}
      <div className="max-w-7xl px-6 mx-auto py-5">
        <div className="flex justify-center">

          {/* CENTERED GRID */}
          <div
            className="
              grid gap-16
              sm:grid-cols-2
              lg:grid-cols-4
              max-w-7xl
            "
          >

{/* OUR COMPANY */}
<div>
  <h4 className="text-sm font-bold text-brand-primary mb-4 uppercase tracking-wider">
    Our Company
  </h4>
  <ul className="space-y-2 text-sm text-gray-600 font-medium">
    <li>
      <Link to="/about/profile" className="hover:text-brand-primary transition-colors">Company Profile</Link>
    </li>
    <li>
      <Link to="/about/milestones" className="hover:text-brand-primary transition-colors">Company Milestone</Link>
    </li>
    <li>
      <Link to="/about/bod" className="hover:text-brand-primary transition-colors">Board of Directors</Link>
    </li>
    <li>
      <Link to="/about/stockholders" className="hover:text-brand-primary transition-colors">Stockholders Profile</Link>
    </li>
    <li>
      <Link to="/contact" className="hover:text-brand-primary transition-colors">Contact Us</Link>
    </li>
  </ul>
</div>

{/* CORPORATE INFO */}
<div>
  <h4 className="text-sm font-bold text-brand-primary mb-4 uppercase tracking-wider">
    Corporate Info
  </h4>
  <ul className="space-y-2 text-sm text-gray-600 font-medium">
    <li>
      <Link to="/products" className="hover:text-brand-primary transition-colors">Products</Link>
    </li>
    <li>
      <Link to="/publication/claims" className="hover:text-brand-primary transition-colors">Claims Process</Link>
    </li>
    <li>
      <Link to="/publication/cof" className="hover:text-brand-primary transition-colors">Certificate of Registration</Link>
    </li>
    <li>
      <Link to="/publication/annual-statement" className="hover:text-brand-primary transition-colors">Annual Statement</Link>
    </li>
    <li>
      <Link to="/publication/corporate-governance" className="hover:text-brand-primary transition-colors">Corporate Governance</Link>
    </li>
    <li>
      <Link to="/publication/article-of-incorporation" className="hover:text-brand-primary transition-colors">Article of Incorporation</Link>
    </li>
    <li>
      <Link to="/publication/annual-reports" className="hover:text-brand-primary transition-colors">Annual Reports</Link>
    </li>
  </ul>
</div>

      {/* GET IN TOUCH */}
      <div>
        <h4 className="text-sm font-bold text-brand-primary mb-4">
          GET IN TOUCH
        </h4>
        <ul className="space-y-3 text-sm text-gray-600">
          <li>We’re here to listen.</li>
          <li>4/F CLIMBS Bldg., Tiano-Pacana Sts., Cagayan de Oro City, Philippines</li>
          <li>(088) 880-1574</li>
          <li>8:30am to 5:30pm</li>
          <li>Monday to Friday</li>
        </ul>
      </div>

      {/* NEWSLETTER */}
      <div>
        <h4 className="text-sm font-bold text-brand-primary mb-4">
          NEWSLETTER
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Receive resources & tools that can help you prepare for the future.
          You can cancel anytime.
        </p>

        <input
          type="email"
          placeholder="YOUR MAIL HERE"
          className="w-full border px-3 py-2 text-sm mb-3"
        />

        <button className="w-full bg-brand-primary text-white text-sm py-2 rounded">
          SUBSCRIBE NOW
        </button>
      </div>

    </div>
  </div>
</div>

       {/* Payment Partners*/}
      <div className="bg-brand-primary text-white">
        <div className="max-w-7xl mx-auto px-6 py-6
                        flex flex-col md:flex-row
                        items-center  gap-4 border-b border-white/10">

        <h4 className="text-sm font-bold text-brand-primary mb-4">
          <PaymentPartners/>
        </h4>

        </div>
      </div>


      {/* BOTTOM BAR */}
      <div className="bg-brand-primary text-white">
        <div className="max-w-7xl mx-auto px-6 py-6
                        flex flex-col md:flex-row
                        items-center justify-between gap-4">

          <p className="text-sm">
            © 2026 Cosmopolitan CLIMBS Life Plan Inc(CCLPI Plans).<br></br>All rights reserved.
          </p>
         

          <img src={logo} alt="CCLPI Plans" className="h-15 " />
          <div className="flex flex-col items-start gap-1">
            <span className="text-sm">Licensed and Regulated by:</span>
            <img src={ic} alt="Insurance Commission" className="h-15" />
          </div>

        </div>
      </div>

      <div className="bg-brand-primary text-white">
        <div className="max-w-7xl mx-auto px-6 py-6
                        flex flex-col md:flex-row
                        items-center justify-center gap-4">

          <a
            href="/privacy-statement"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white-600 hover:text-brand-accent transition"
          >
            Privacy Statement
          </a>
         

       

        </div>
      </div>
    </footer>
  );
}
