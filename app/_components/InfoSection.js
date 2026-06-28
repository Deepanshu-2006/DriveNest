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
    const [activeFaq, setActiveFaq] = useState(null);

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

    const faqs = [
        {
            q: "How do I list my car on DriveNest?",
            a: "Simply sign in to your account, click on the \"Submit Listing\" button in the header, and fill out your vehicle specifications, pricing, features, and images. Your listing will go live instantly!"
        },
        {
            q: "How do I compare different vehicles side-by-side?",
            a: "Click on the compare icon in the upper-right corner of any vehicle card. You can select up to 3 vehicles. When ready, click \"Compare Now\" in the bottom bar to view detailed, highlighted side-by-side statistics."
        },
        {
            q: "Can I message sellers directly?",
            a: "Yes! Every listing has a built-in messaging portal. Log in, open the vehicle's detail page, type your query, and send. You can view all responses and active chats in your Inbox on the Profile page."
        },
        {
            q: "How does the estimated monthly payment calculator work?",
            a: "On each car's detail page, our built-in loan estimator automatically calculates monthly payments based on vehicle price, credit scores, APR rates, and customized down payments using real-time amortization formulas."
        }
    ];

    return (
        <section>
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mt-20 mb-20"
            >
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
                        </div>
                    </div>
                </div>

                {/* Visual Separator */}
                <div className="w-full h-px my-16 bg-linear-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto mt-4">
                    <div className="flex flex-col items-center text-center mb-10">
                        <span className="text-xs font-bold tracking-widest text-teal-600 dark:text-teal-400 uppercase">
                            Support & Info
                        </span>
                        <h3 className="mt-1 text-2xl md:text-3xl font-extrabold tracking-tight bg-linear-to-b from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                            Frequently Asked Questions
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => {
                            const isOpen = activeFaq === index;
                            return (
                                <div 
                                    key={index}
                                    className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                                        isOpen 
                                            ? 'border-teal-500/50 bg-teal-500/2 dark:border-teal-400/30' 
                                            : isDark 
                                                ? 'border-white/5 bg-[#0f0f0f]/30 hover:border-white/10 hover:bg-[#0f0f0f]/50' 
                                                : 'border-slate-200 bg-white hover:border-slate-300'
                                    }`}
                                >
                                    <button
                                        onClick={() => setActiveFaq(isOpen ? null : index)}
                                        className="w-full flex items-center justify-between p-5 text-left cursor-pointer outline-none"
                                    >
                                        <span className={`text-sm md:text-base font-extrabold ${
                                            isOpen 
                                                ? 'text-teal-600 dark:text-teal-400' 
                                                : isDark ? 'text-white' : 'text-slate-800'
                                        }`}>
                                            {faq.q}
                                        </span>
                                        <motion.span
                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                            className={isOpen ? 'text-teal-500' : 'text-slate-400'}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </motion.span>
                                    </button>

                                    <motion.div
                                        initial={false}
                                        animate={isOpen ? "open" : "collapsed"}
                                        variants={{
                                            open: { height: "auto", opacity: 1 },
                                            collapsed: { height: 0, opacity: 0 }
                                        }}
                                        transition={{ type: "spring", stiffness: 220, damping: 20 }}
                                        className="overflow-hidden"
                                    >
                                        <div className={`px-5 pb-5 pt-1 text-xs md:text-sm leading-relaxed border-t border-dashed ${
                                            isDark 
                                                ? 'text-white/60 border-white/5' 
                                                : 'text-slate-500 border-slate-100'
                                        }`}>
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

export default InfoSection;