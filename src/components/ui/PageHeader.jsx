import { Reveal } from "@/components/animation/Reveal";
const PageHeader = ({ title, subtitle }) => {
    return (
      <section className="bg-brand-primary">
        <div className="relative max-w-7xl mx-auto px-6 py-14 sm:py-16">
          
          {/* Accent line */}
          
  
          <div className="relative">
            <Reveal direction="left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              {title}
            </h1>
            </Reveal>
            <Reveal direction="right"><div className="w-20 h-2 bg-brand-accent rounded-full mt-4" /></Reveal>

            {subtitle && (
              <Reveal direction="left">
              <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/85">
                {subtitle}
              </p>
              </Reveal>
            )}
          </div>
  
        </div>
      </section>
    );
  };
  
  export default PageHeader;
  