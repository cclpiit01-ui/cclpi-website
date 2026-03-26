import { Reveal } from "@/components/animation/Reveal";

const ProductReality = () => (
  <section className="py-20 px-6 max-w-5xl mx-auto text-center">
    <div className="bg-slate-50 p-8 md:p-16 rounded-[40px] border border-slate-200/60 relative overflow-hidden">
      {/* Decorative background element */}
      <Reveal direction="bottom">
      <div className="absolute top-0 left-0 w-24 h-24 bg-blue-100 rounded-full -translate-x-12 -translate-y-12 opacity-40"></div>
      
      <p className="relative z-10 text-xl md:text-2xl leading-relaxed text-slate-700 font-medium italic">
        "Your legacy deserves to be handled with grace. With Angelica Life Plan, you aren't just preparing for
        the inevitable—you’re securing comfort for the people you love. We make it simple to organize your future
         today, so your family can focus on what truly matters tomorrow."
      </p>
      </Reveal>
    </div>
  
  </section>
);

export default ProductReality;