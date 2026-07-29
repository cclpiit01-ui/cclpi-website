import { Link } from 'react-router-dom';

const TwoButtons = () => {
  return (
    /* Dinagdagan natin ng mt-10 para sa tamang spacing sa text.
       Z-50 is maintained para clickable sa mobile.
    */
    <div className="mt-10 flex flex-wrap gap-4 relative z-50">

      {/* LEFT BUTTON: Primary Yellow (Same as 'Join the Mission' in BannerTwo) */}
      <a
        href="https://portal.cclpi.com.ph/angelica"
        target="_blank"
        rel="noopener noreferrer"
        /* Ginamit natin ang rounded-full, shadow-2xl, at py-4 px-10 
           para maging kamukha ng BannerTwo.
        */
        className="bg-brand-accent hover:bg-white text-brand-primary 
                   font-black py-4 px-10 rounded-full shadow-2xl 
                   transition-all duration-300 uppercase tracking-widest text-sm
                   hover:-translate-y-1 active:scale-95"
      >
        Get Your Plan Now
      </a>

      {/* RIGHT BUTTON: Outline / Glassmorphism (Same as 'Learn More' in BannerTwo) */}
      <Link
        to="/products"
        className="border-2 border-white/30 hover:border-white 
                   text-white font-black py-4 px-10 rounded-full 
                   transition-all duration-300 uppercase tracking-widest text-sm 
                   backdrop-blur-sm hover:-translate-y-1 active:scale-95"
      >
        Learn More
      </Link>

    </div>
  );
};

export default TwoButtons;