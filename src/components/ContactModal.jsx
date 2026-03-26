import { useState } from "react";
import { X, Mail, Phone, MapPin, PhoneCall, Send, Building2, ChevronDown, ChevronUp } from "lucide-react";

export default function ContactModal({ onClose }) {
  const [closing, setClosing] = useState(false);
  const [openSection, setOpenSection] = useState('main'); // State para sa accordion

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 300);
  };

  // Sections para sa Offices
  const offices = [
    {
      region: "Luzon",
      locations: [
        { name: "QUEZON CITY", details: "Cosmopolitan Memorial Chapel, 332 G. Araneta Ave., Quezon City", type: "Area Office" },
        { name: "GUMACA, QUEZON PROVINCE", details: "Brgy. Bagong Buhay, Gumaca, Quezon Province", type: "Sales Rep" },
        { name: "MINDORO", details: "SF Calapan Branch - M. Roxas Drive, Libis, Calapan City, Oriental Mindoro", type: "Sales Rep" },
        { name: "BATANGAS CITY", details: "SF Batangas City Branch- Gov. Antonio Carpio Rd., Sitio Silangan, Batangas City", type: "Sales Rep" }
      ]
    },
    {
      region: "Visayas",
      locations: [
        { name: "CEBU", details: "SB. Cabahug St., Ibabao-Estancia, Mandaue City, Cebu", type: "Area Office" },
        { name: "BACOLOD", details: "3rd Floor Door #7 LCCFMPC Bldg., Gatuslao St., Bacolod City", type: "Sales Rep" },
        { name: "ANTIQUE", details: "3rd Floor Door #7 LCCFMPC Bldg., Gatuslao St., Bacolod City", type: "Sales Rep" }
      ]
    },
    {
      region: "Mindanao",
      locations: [
        { name: "CAGAYAN DE ORO (Head Office)", details: "4th & 5th Floor, CLIMBS Bldg., Tiano-Pacana Sts., Cagayan de Oro City", type: "Area Office" },
        { name: "DAVAO", details: "2nd Floor, RBT Bldg., Ilustre St., Davao City", type: "Area Office" },
        { name: "BUTUAN", details: "ANTRECCO Main Office, Brgy. Dagohoy, JP Rosales Ave., Butuan City", type: "Sales Rep" },
        { name: "GENERAL SANTOS", details: "2nd floor, SAFI 4 Building, Room 202, Quezon Ave., Brgy. Dadiangas West", type: "Sales Rep" }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden">
      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${closing ? "opacity-0" : "opacity-100"}`}
        onClick={handleClose}
      />

      <div className={`relative z-50 ml-auto h-screen w-full sm:w-[500px] bg-white shadow-2xl flex flex-col ${closing ? "animate-slideOutRight" : "animate-slideInRightSlow"}`}>
        
        {/* Header */}
        <div className="bg-brand-primary p-8 text-white relative">
          <button onClick={handleClose} className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/20 transition-colors">
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold tracking-tight">Contact CCLPI</h2>
          <p className="text-blue-100 text-sm mt-1">We are here to serve you across the Philippines.</p>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          
          {/* Main Contacts */}
          <div className="p-8 space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">General Inquiries</h3>
            <div className="grid grid-cols-1 gap-4">
              <ContactItem icon={<Mail size={18}/>} label="Email" value="cclpi.preneed@cclpi.com.ph" />
              <ContactItem icon={<PhoneCall size={18}/>} label="Landline" value="(088) 880-1574" />
              <ContactItem icon={<Phone size={18}/>} label="Mobile" value="+63 998 953 4937 / +63 917 154 3459" />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Area Offices Accordion */}
          <div className="p-8 pt-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Our Offices & Sales Representatives</h3>
            
            <div className="space-y-3">
              {offices.map((section) => (
                <div key={section.region} className="border border-slate-100 rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setOpenSection(openSection === section.region ? '' : section.region)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="font-bold text-brand-primary">{section.region}</span>
                    {openSection === section.region ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                  </button>
                  
                  {openSection === section.region && (
                    <div className="p-4 bg-white space-y-4">
                      {section.locations.map((loc, idx) => (
                        <div key={idx} className="relative border-l-2 border-brand-accent pl-4 pb-2">
                          {/* Badge Indicator */}
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter mb-1 inline-block ${
                            loc.type === "Area Office" 
                              ? "bg-blue-600 text-white" 
                              : "bg-amber-100 text-amber-700 border border-amber-200"
                          }`}>
                            {loc.type}
                          </span>
                          
                          <p className="text-sm font-bold text-slate-700 leading-tight uppercase">
                            {loc.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed italic">
                            {loc.details}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-8 bg-slate-50 border-t border-slate-100">
          <button
            onClick={() => window.location.href = "mailto:cclpi.preneed@cclpi.com.ph?subject=Inquiry"}
            className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-brand-secondary transition-all"
          >
            <Send size={18} />
            Send Us an Email
          </button>
        </div>
      </div>
    </div>
  );
}

// Reusable Small Component para sa Main Contacts
function ContactItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-lg bg-blue-50 text-brand-primary">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">{label}</p>
        <p className="text-sm text-slate-700 font-semibold">{value}</p>
      </div>
    </div>
  );
}