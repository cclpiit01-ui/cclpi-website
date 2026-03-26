import { Link } from 'react-router-dom';

const TwoButtons = () => {
  return (
    // NO Reveal wrapper at all — animations on buttons cause pointer-events issues on mobile
    <div className="mt-6 flex flex-row gap-4 relative z-50">

      {/* LEFT BUTTON: Outline / Transparent */}
      <Link
        to="/products"
        className="flex-none px-3 py-1.5
                   border-2 border-white
                   bg-transparent
                   text-white text-xs font-bold uppercase tracking-wide
                   hover:bg-white hover:text-[#013F99] transition-all duration-300
                   md:px-8 md:py-3 md:text-base
                   lg:px-10 lg:text-sm hover:-translate-y-0.5"
      >
        Learn more...
      </Link>

      {/* RIGHT BUTTON: Solid Yellow */}
      <a
        href="https://sc.cclpi.com.ph:8080/#/referral/4f030d0843486b39/1"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-none px-3 py-1.5
                   bg-[#F2C94C]
                   text-[#1E3A8A] text-xs font-bold uppercase tracking-wide
                   rounded-sm
                   hover:bg-yellow-400 hover:-translate-y-0.5
                   transition-all duration-300
                   md:px-8 md:py-3 md:text-base
                   lg:px-10 lg:text-sm"
      >
        Get Your Plan Now
      </a>

    </div>
  );
};

export default TwoButtons;
