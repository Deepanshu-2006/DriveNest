"use client";

import React, { useState, useEffect } from 'react'
import info from '@/public/INFO.jpg'
import { useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const CAROUSEL_SLIDES = [
    {
        image: info,
        title: "Drive Your Dream, Discover the Best Deals",
        description: "Browse an exclusive collection of new and pre-owned vehicles from trusted dealers and sellers. Compare features, explore detailed listings, and find the perfect car that fits your lifestyle and budget."
    },
    {
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
        title: "Premium Engineering & Luxury Redefined",
        description: "Experience the pinnacle of automotive craftsmanship. Explore our handpicked collection of high-performance luxury sedans equipped with cutting-edge technology and unparalleled cabin comfort."
    },
    {
        image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800',
        title: "Progress Through Innovation & Intelligence",
        description: "Discover electric and hybrid intelligence designed for the future of travel. Enjoy state-of-the-art virtual cockpits, exceptional drive efficiency, and sleek aerodynamic aesthetics."
    },
    {
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800',
        title: "The Best or Nothing — Timeless Authority",
        description: "Command the road with absolute presence. Discover premium luxury SUVs and sedans designed to deliver top-tier performance, unmatched road safety, and pure sensory refinement."
    },
    {
        image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800',
        title: "Ultimate Off-Road Luxury & Exploration",
        description: "Conquer any terrain with ease. View our selection of elite off-road crossovers and SUVs that blend ultimate lifestyle luxury with rugged capability, making every drive an adventure."
    }
];

function InfoSection() {
    const { isSignedIn } = useUser();
    const isDark = isSignedIn;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % CAROUSEL_SLIDES.length);
        }, 5000); // 5 seconds per slide is better to allow reading the text

        return () => clearInterval(interval);
    }, [isHovered]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % CAROUSEL_SLIDES.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
    };

    return (
        <section>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mt-20 mb-20">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center md:gap-12">
                    <div className="min-h-45 md:min-h-55 flex items-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="max-w-prose md:max-w-none w-full"
                            >
                                <h2 className="text-2xl font-extrabold sm:text-4xl leading-tight tracking-tight bg-linear-to-b from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                                    {CAROUSEL_SLIDES[currentIndex].title}
                                </h2>

                                <p className={`mt-4 text-pretty text-sm md:text-base leading-relaxed ${isDark ? 'text-white/70' : 'text-gray-700'}`}>
                                    {CAROUSEL_SLIDES[currentIndex].description}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div
                        className="relative group w-full overflow-hidden rounded-3xl"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div className="relative w-full h-80 md:h-100">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentIndex}
                                    src={typeof CAROUSEL_SLIDES[currentIndex].image === 'string' ? CAROUSEL_SLIDES[currentIndex].image : CAROUSEL_SLIDES[currentIndex].image.src}
                                    alt={CAROUSEL_SLIDES[currentIndex].title}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className="absolute inset-0 w-full h-full rounded-3xl object-cover shadow-[0_10px_50px_rgba(0,0,0,0.5)]"
                                />
                            </AnimatePresence>

                            {/* Left Navigation Arrow */}
                            <button
                                onClick={handlePrev}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-xs cursor-pointer select-none"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            {/* Right Navigation Arrow */}
                            <button
                                onClick={handleNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-xs cursor-pointer select-none"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            {/* Indicator Dots */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                {CAROUSEL_SLIDES.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === index
                                                ? 'bg-teal-500 scale-120'
                                                : 'bg-white/50 hover:bg-white/80'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default InfoSection;