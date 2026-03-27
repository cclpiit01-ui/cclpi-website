import React, { useRef, useLayoutEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

export const Reveal = ({ children, direction = "left", delay = 0, duration = 0.8 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0 });
  const [wasInViewOnMount, setWasInViewOnMount] = useState(false);

  // FIX: useLayoutEffect runs BEFORE paint — no flicker, no opacity:0 flash
  useLayoutEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setWasInViewOnMount(true);
      }
    }
  }, []);

  const directions = {
    left: { x: -80, y: 0 },
    right: { x: 80, y: 0 },
    bottom: { x: 0, y: 50 },
    top: { x: 0, y: -50 },
    scale: { x: 0, y: 0, scale: 0.8 }
  };

  const selectedDirection = directions[direction];

  if (wasInViewOnMount) {
    return <div style={{ opacity: 1, transform: 'none', pointerEvents: 'auto' }}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...selectedDirection }}
      animate={isInView ? { opacity: 1, x: 0, y: 0, scale: 1 } : {}}
      transition={{ duration, delay, ease: "easeOut" }}
      style={!isInView ? { pointerEvents: 'none' } : { pointerEvents: 'auto' }}
    >
      {children}
    </motion.div>
  );
};