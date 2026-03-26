import React from 'react';
import PageHeader from "@/components/ui/PageHeader";
import { Reveal } from "@/components/animation/Reveal";
import DirectorCard from "@/components/cards/DirectorCard";

// 1. Import images from your local assets folder
import renatoImg from "@/assets/bod/Dychangco.jpg";
import llantoImg from "@/assets/bod/Llanto.jpg";
import roblesImg from "@/assets/bod/Robles.jpg";
import manchingImg from "@/assets/bod/Manching.jpg";
import tanunjoImg from "@/assets/bod/tanunjo.jpg";
import hilotImg from "@/assets/bod/hilot.jpg";
import kerwinImg from "@/assets/bod/kerwin.jpg";
import chanImg from "@/assets/bod/chan.jpg";
import reyesImg from "@/assets/bod/reyes.jpg";
import viliranImg from "@/assets/bod/viliran.jpg";
import ferreriaImg from "@/assets/bod/ferreria.jpg";
import sindayenImg from "@/assets/bod/sindayen.jpg";
import evangelioImg from "@/assets/bod/evangelio.jpg";
import delapenaImg from "@/assets/bod/delapena.jpg";

const BOD = () => {
  const directors = [
    {
      name: "Renato S. Dychangco Jr.",
      role: "Chairman of the Board",
      company: "Cosmopolitan Funeral Homes Inc.",
      image: renatoImg
    },
    {
      name: "Mgen. Gilbert S. Llanto",
      role: "Vice-Chairperson (Coop)",
      company: "ACDI Multipurpose Cooperative",
      image: llantoImg
    },
    {
      name: "Exequiel D. Robles",
      role: "Vice-Chairperson (Corp)",
      company: "Sta. Lucia Realty and Development Inc.",
      image: roblesImg
    },
    {
      name: "Fr. Elmo P. Manching",
      role: "Director",
      company: "CLIMBS Life and General Insurance Cooperative",
      image: manchingImg
    },
    {
      name: "Alvin Y. Tan Unjo",
      role: "Treasurer / Director",
      company: "Cebu International Finance Corporation (CIFC)",
      image: tanunjoImg
    },
    {
      name: "Floriano R. Hilot",
      role: "Asst. Treasurer / Director",
      company: "Oro Integrated Cooperative (OIC)",
      image: hilotImg
    },
    {
      name: "Atty. Kerwin K. Tan",
      role: "Director",
      company: "Tan Hassani & Counsels",
      image: kerwinImg
    },
    {
      name: "Engr. Ronald G. Chan",
      role: "Director",
      company: "Income Credit Cooperative",
      image: chanImg
    },
    {
      name: "Ferdinand Matthew D. Reyes",
      role: "Director",
      company: "Fernando B. Reyes Enterprises Inc.",
      image: reyesImg
    },
    {
      name: "Rowena R. Viliran",
      role: "Director",
      company: "Perpetual Help Community Cooperative Dumaguete (PHCCI)",
      image: viliranImg
    },
    {
      name: "Augustus J.V. Ferreria",
      role: "Independent Director",
      company: "Corporate Leadership",
      image: ferreriaImg
    },
    {
      name: "Marlene D. Sindayen",
      role: "Independent Director",
      company: "Novaliches Development Cooperative (NOVADECI) / CLIMBS",
      image: sindayenImg
    },
    {
      name: "Atty. Daniel O. Evangelio, Jr.",
      role: "Corporate Board Secretary",
      company: "Legal Counsel",
      image: evangelioImg
    },
    {
      name: "Mansueto V. Dela Peña",
      role: "President and CEO",
      company: "CCLPI Plans",
      image: delapenaImg
    }
  ];

  return (
    <div className="bg-brand-surface min-h-screen pb-24">
      <PageHeader 
        title="Board of Directors & Officers" 
        subtitle="The visionary leaders steering CCLPI Plans towards excellence and stability."
      />

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          
          <Reveal direction="bottom">
            <div className="text-center mb-16">
              <h2 className="text-brand-primary font-heading font-black text-4xl uppercase ">
                Our Leadership
              </h2>
              <div className="w-20 h-1.5 bg-brand-accent mx-auto mt-4 rounded-full" />
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {directors.map((dir, index) => (
              <DirectorCard 
                key={index}
                {...dir}
                delay={index * 0.1} 
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BOD;