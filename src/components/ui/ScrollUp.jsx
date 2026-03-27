import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from "@/lib/utils";

const ScrollUp = ({ onVisibilityChange }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const visible = window.scrollY > 300;
      setIsVisible(visible);
      // Notify Layout of visibility change
      onVisibilityChange?.(visible);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [onVisibilityChange]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "p-4 rounded-2xl shadow-xl transition-all duration-500 pointer-events-auto",
        "bg-[#013F99] text-white border border-white/10 hover:bg-[#002a66] hover:-translate-y-1",
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 pointer-events-none"
      )}
    >
      <ChevronUp size={24} strokeWidth={3} />
    </button>
  );
};

export default ScrollUp;
