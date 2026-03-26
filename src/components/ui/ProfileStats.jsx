import React from 'react';
import { Reveal } from "@/components/animation/Reveal";

const StatCard = ({ value, label, variant = 'light' }) => {
  const styles = {
    primary: "bg-brand-primary text-white",
    accent: "bg-brand-accent text-blue-950",
    light: "bg-slate-100 text-brand-primary",
  };

  return (
    <div className={`${styles[variant]} p-6 rounded-2xl text-center`}>
      <p className="text-3xl font-black mb-1">{value}</p>
      <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">{label}</p>
    </div>
  );
};

export const ProfileStats = () => (
  <Reveal direction="right">
    <div className="grid grid-cols-2 gap-4">
      <StatCard value="435+" label="Service Providers" variant="primary" />
      <StatCard value="₱1.0B+" label="Trust Fund" />
      <StatCard value="28" label="Strategic Branches" />
      <StatCard value="Top 5" label="Industry Leader" variant="accent" />
    </div>
  </Reveal>
);