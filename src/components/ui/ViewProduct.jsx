

const ViewProduct = () => {
  return (
    <section className="relative w-full py-16 md:py-24 px-6 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#013F99] via-[#1E70D1] to-[#4CB1E9]"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
        {/* Main Heading */}
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
          Ready to Secure Your Family's Future?
        </h2>

        {/* Subtext */}
        <p className="text-sm md:text-lg opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed">
          Don't wait for tomorrow. Start protecting your loved ones today with 
          Angelica Life Plan.
        </p>

        {/* CTA Button */}
        <button 
        onClick={() => window.location.href = '/products'}
        className="
          bg-brand-accent hover:bg-white 
          text-[#1E3A8A] font-bold py-3 px-8 rounded-md
          shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
          transition-all duration-300 text-sm md:text-base
        ">
          View Plans & Calculator
        </button>
      </div>
    </section>
  );
};

export default ViewProduct;