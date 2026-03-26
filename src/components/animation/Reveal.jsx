import React from 'react';
import { motion } from 'framer-motion';

export const Reveal = ({ children, direction = "left", delay = 0, duration = 0.8 }) => {
  const directions = {
    left: { x: -80, y: 0 },
    right: { x: 80, y: 0 },
    bottom: { x: 0, y: 50 },
    top: { x: 0, y: -50 },
    scale: { x: 0, y: 0, scale: 0.8 }
  };

  const selectedDirection = directions[direction];

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...selectedDirection 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0, 
        scale: 1 
      }}
      // FIX: Changed margin from "-100px" to "0px"
      // Negative margin meant the element had to be 100px INSIDE the viewport
      // before animating — on mobile this threshold was never met for buttons
      // near the bottom of the banner, leaving them permanently at opacity:0
      // with pointer-events blocked
      viewport={{ once: true, margin: "0px" }}
      transition={{ 
        duration: duration, 
        delay: delay, 
        ease: "easeOut" 
      }}
    >
      {children}
    </motion.div>
  );
};
