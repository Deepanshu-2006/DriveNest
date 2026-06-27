"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  SiToyota,
  SiBmw,
  SiTesla,
  SiAudi,
  SiFord,
  SiHonda,
  SiHyundai,
  SiPorsche,
  SiChevrolet,
  SiNissan,
  SiVolkswagen,
  SiVolvo,
  SiLandrover,
  SiFerrari,
  SiLamborghini
} from 'react-icons/si';
import { TbBrandMercedes } from 'react-icons/tb';

const BRANDS = [
  { name: "Toyota", icon: SiToyota },
  { name: "BMW", icon: SiBmw },
  { name: "Tesla", icon: SiTesla },
  { name: "Audi", icon: SiAudi },
  { name: "Ford", icon: SiFord },
  { name: "Honda", icon: SiHonda },
  { name: "Hyundai", icon: SiHyundai },
  { name: "Mercedes", icon: TbBrandMercedes },
  { name: "Porsche", icon: SiPorsche },
  { name: "Chevrolet", icon: SiChevrolet },
  { name: "Nissan", icon: SiNissan },
  { name: "Volkswagen", icon: SiVolkswagen },
  { name: "Volvo", icon: SiVolvo },
  { name: "Land Rover", icon: SiLandrover },
  { name: "Ferrari", icon: SiFerrari },
  { name: "Lamborghini", icon: SiLamborghini }
];

function BrandTicker() {
  const router = useRouter();

  const handleBrandClick = (brandName) => {
    router.push(`/search?make=${encodeURIComponent(brandName)}`);
  };

  // Duplicate list to create a seamless infinite loop
  const doubleBrands = [...BRANDS, ...BRANDS];

  return (
    <div className="w-full">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-start text-left mb-8 px-10 md:px-20"
      >
        <span className="text-xs font-bold tracking-widest text-teal-600 dark:text-teal-400 uppercase">
          Brands
        </span>
        <h2 className="mt-1 text-3xl md:text-4xl font-extrabold tracking-tight bg-linear-to-b from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          Browse By Brands
        </h2>
        <p className="mt-2 text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-md">
          Search vehicles from top automotive manufacturers
        </p>
      </motion.div>

      {/* Marquee Wrapper with side fading gradients and subtle border lines */}
      <div className="relative w-full overflow-hidden py-8 border-y transition-all duration-300 border-slate-100 bg-slate-50/30 dark:border-white/5 dark:bg-white/1">
        {/* Left Fading Gradient */}
        <div className="absolute left-0 top-0 bottom-0 z-10 w-20 md:w-40 pointer-events-none bg-linear-to-r from-slate-50 dark:from-[#050505] to-transparent" />

        {/* Right Fading Gradient */}
        <div className="absolute right-0 top-0 bottom-0 z-10 w-20 md:w-40 pointer-events-none bg-linear-to-l from-slate-50 dark:from-[#050505] to-transparent" />

        {/* Marquee Inner Track */}
        <div className="animate-marquee flex w-max items-center hover:paused">
          {doubleBrands.map((brand, index) => {
            const Icon = brand.icon;
            return (
              <div
                key={index}
                onClick={() => handleBrandClick(brand.name)}
                className="shrink-0 w-28 h-28 md:w-32 md:h-32 mr-6 md:mr-8 rounded-2xl flex flex-col items-center justify-center p-3 gap-2 group cursor-pointer transition-all duration-300 bg-white border border-slate-200/60 dark:bg-white/2 dark:border-white/5 text-slate-400 dark:text-white/40 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-500/40 dark:hover:border-teal-400/40 hover:bg-slate-50 dark:hover:bg-white/6 hover:scale-105 hover:-translate-y-1 shadow-[0_8px_32px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_rgba(20,184,166,0.08)] dark:hover:shadow-[0_8px_32px_rgba(45,212,191,0.15)]"
              >
                <Icon className="w-10 h-10 md:w-12 md:h-12 transition-all duration-300 group-hover:scale-110" />
                <span className="text-[11px] font-bold tracking-wider transition-all duration-300 text-slate-500 dark:text-white/40 group-hover:text-slate-800 dark:group-hover:text-white/90">
                  {brand.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default BrandTicker;

