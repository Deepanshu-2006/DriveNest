"use client";

import React from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import AntigravityCanvas from '../../components/AntigravityCanvas';
import SearchBar from './SearchBar';

function Hero() {
    const { isSignedIn, isLoaded } = useUser();
    const scrollProgress = useMotionValue(0);

    const handleScrollProgress = (latest) => {
        scrollProgress.set(latest);
    };

    // Scroll to explore indicator opacity & slight vertical drift
    const exploreOpacity = useTransform(scrollProgress, [0.0, 0.1], [1, 0]);
    const exploreY = useTransform(scrollProgress, [0.0, 0.1], [0, -10]);

    // Beat A (0% - 20% scroll)
    const beatAOpacity = useTransform(scrollProgress, [0.0, 0.02, 0.18, 0.2], [0, 1, 1, 0]);
    const beatAY = useTransform(scrollProgress, [0.0, 0.02, 0.18, 0.2], [20, 0, 0, -20]);

    // Beat B (25% - 45% scroll)
    const beatBOpacity = useTransform(scrollProgress, [0.25, 0.27, 0.43, 0.45], [0, 1, 1, 0]);
    const beatBY = useTransform(scrollProgress, [0.25, 0.27, 0.43, 0.45], [20, 0, 0, -20]);

    // Beat C (50% - 70% scroll)
    const beatCOpacity = useTransform(scrollProgress, [0.5, 0.52, 0.68, 0.7], [0, 1, 1, 0]);
    const beatCY = useTransform(scrollProgress, [0.5, 0.52, 0.68, 0.7], [20, 0, 0, -20]);

    // Beat D (75% - 100% scroll) -> Fades in and stays visible until the end of the hero container
    const beatDOpacity = useTransform(scrollProgress, [0.75, 0.77, 1.0, 1.0], [0, 1, 1, 1]);
    const beatDY = useTransform(scrollProgress, [0.75, 0.77, 1.0, 1.0], [20, 0, 0, 0]);

    // Spring-based blur values to animate text out-of-focus dynamically
    const beatABlurVal = useTransform(scrollProgress, [0.0, 0.02, 0.18, 0.2], [16, 0, 0, 16]);
    const beatABlur = useTransform(beatABlurVal, (v) => `blur(${v}px)`);

    const beatBBlurVal = useTransform(scrollProgress, [0.25, 0.27, 0.43, 0.45], [16, 0, 0, 16]);
    const beatBBlur = useTransform(beatBBlurVal, (v) => `blur(${v}px)`);

    const beatCBlurVal = useTransform(scrollProgress, [0.5, 0.52, 0.68, 0.7], [16, 0, 0, 16]);
    const beatCBlur = useTransform(beatCBlurVal, (v) => `blur(${v}px)`);

    const beatDBlurVal = useTransform(scrollProgress, [0.75, 0.77, 1.0, 1.0], [16, 0, 0, 0]);
    const beatDBlur = useTransform(beatDBlurVal, (v) => `blur(${v}px)`);

    const searchBarVisibility = useTransform(scrollProgress, (value) => {
        return value >= 0.75 ? "visible" : "hidden";
    });
    const searchBarPointerEvents = useTransform(scrollProgress, (value) => {
        return value >= 0.75 ? "auto" : "none";
    });

    if (!isLoaded) {
        // Elegant shimmer placeholder to prevent layout shifts during auth evaluation
        return (
            <div className="w-full h-150 bg-slate-50 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-teal-600 animate-spin"></div>
            </div>
        );
    }

    // Guest (Not Signed In) View
    if (!isSignedIn) {
        return (
            <div className="w-full h-full flex flex-col justify-between items-center py-6 md:py-10 relative overflow-hidden select-none">
                {/* Soft Mint Radial Glow Blob */}
                <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[80%] max-w-[800px] h-[45%] bg-[radial-gradient(circle,rgba(20,184,166,0.18)_0%,transparent_70%)] -z-10 pointer-events-none blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />

                <div className="max-w-7xl mx-auto text-center flex flex-col items-center px-4 relative z-10 flex-1 justify-center">
                    {/* Small Tagline */}
                    <motion.p 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-teal-600 text-xs md:text-sm font-bold uppercase tracking-[0.25em] mb-4 bg-teal-500/10 border border-teal-500/20 px-4 py-2 rounded-full shadow-xs"
                    >
                        Find Cars for sale and for rent near you
                    </motion.p>

                    {/* Hero Title */}
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                        className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-6 max-w-4xl leading-tight tracking-tight"
                    >
                        Find Your <span className="bg-linear-to-r from-teal-500 via-emerald-500 to-teal-700 bg-clip-text text-transparent">Dream Car</span>
                    </motion.h1>

                    {/* Description Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="text-slate-550 text-sm md:text-base max-w-xl mb-8 leading-relaxed font-semibold"
                    >
                        Discover a seamless vehicle listing and discovery portal. Experience premium tools and dynamic clarity, tailored for automotive enthusiasts.
                    </motion.p>

                    {/* Call to Action Button */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                    >
                        <Link href="/sign-in" className="inline-block rounded-full bg-teal-600 px-10 py-4 text-lg font-bold text-white transition-all hover:bg-teal-700 hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(13,148,136,0.3)] hover:shadow-[0_4px_30px_rgba(13,148,136,0.5)]">
                            Get Started
                        </Link>
                    </motion.div>
                </div>

                {/* Car Image section overlapping the boundary */}
                <div className="w-full flex flex-col items-center relative z-10 mt-6 max-h-[38vh]">
                    {/* Car Image with float animation */}
                    <motion.img
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ 
                            opacity: 1,
                            y: [0, -10, 0] 
                        }}
                        transition={{ 
                            opacity: { duration: 0.8, delay: 0.4 },
                            y: { repeat: Infinity, duration: 6, ease: "easeInOut" }
                        }}
                        src="/Tesla.png"
                        alt="Tesla Model S"
                        className="w-full max-w-md md:max-w-2xl lg:max-w-3xl object-contain relative z-10"
                    />

                    {/* Ground Shadow with scale/opacity breath animation */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ 
                            opacity: [0.32, 0.20, 0.32],
                            scaleX: [1, 0.92, 1]
                        }}
                        transition={{ 
                            opacity: { duration: 0.8, delay: 0.4 },
                            scaleX: { repeat: Infinity, duration: 6, ease: "easeInOut" },
                            opacity: { repeat: Infinity, duration: 6, ease: "easeInOut" }
                        }}
                        className="w-[60%] max-w-xl h-4 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.35)_0%,transparent_70%)] blur-md mx-auto -mt-4 z-0 pointer-events-none"
                    />
                </div>
            </div>
        );
    }

    const titleGlow = {
        textShadow: '0 2px 12px rgba(0, 0, 0, 0.9), 0 4px 24px rgba(0, 0, 0, 0.5)'
    };

    const subtitleGlow = {
        textShadow: '0 1px 6px rgba(0, 0, 0, 0.8)'
    };

    // Authenticated (Signed In) Scrollytelling View
    return (
        <div className="relative w-full bg-[#050505] text-white">
            {/* Sticky Canvas & Wrapper */}
            <AntigravityCanvas onScrollProgress={handleScrollProgress} />

            {/* Scrollytelling Text & Component Overlays */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">

                    {/* Beat A: Re-engineering the Search */}
                    <motion.div
                        style={{ opacity: beatAOpacity, y: beatAY, filter: beatABlur }}
                        className="absolute top-28 md:top-36 flex flex-col items-center text-center px-4 max-w-xl pointer-events-auto"
                    >
                        <div className="border border-white/10 bg-black/40 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] relative overflow-hidden w-full">
                            {/* Corner tech indicators */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-teal-500/60" />
                            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-teal-500/60" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-teal-500/60" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-teal-500/60" />

                            <div className="flex items-center justify-center gap-2 mb-4 font-mono text-[9px] md:text-[10px] text-teal-400 tracking-[0.2em] uppercase select-none opacity-80">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                                <span>[ SYSTEM SCAN: ACTIVE ]</span>
                                <span className="text-white/20">|</span>
                                <span>DN-0181</span>
                            </div>

                            <h2 
                                className="text-white/95 text-xl md:text-3xl font-black tracking-wider uppercase leading-snug select-none"
                            >
                                CAR ACQUISITION RE-ENGINEERED
                            </h2>
                            <p 
                                className="text-white/70 font-sans text-xs md:text-sm mt-3 leading-relaxed select-none"
                            >
                                Welcome to DriveNest. Where exceptional machinery emerges from the digital void, offering unprecedented clarity.
                            </p>
                        </div>
                    </motion.div>

                    {/* Beat B: Absolute Transparency */}
                    <motion.div
                        style={{ opacity: beatBOpacity, y: beatBY, filter: beatBBlur }}
                        className="absolute top-28 md:top-36 w-full max-w-7xl px-8 md:px-24 flex flex-col items-start text-left pointer-events-auto"
                    >
                        <div className="border border-white/10 bg-black/40 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] relative overflow-hidden max-w-md w-full">
                            {/* Corner tech indicators */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-teal-500/60" />
                            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-teal-500/60" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-teal-500/60" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-teal-500/60" />

                            <div className="flex items-center gap-2 mb-4 font-mono text-[9px] md:text-[10px] text-teal-400 tracking-[0.2em] uppercase select-none opacity-80">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                                <span>[ CHASSIS BREAKDOWN: DEPLOYED ]</span>
                                <span className="text-white/20">|</span>
                                <span>SCAN: X-RAY</span>
                            </div>

                            <h2 
                                className="text-white/95 text-xl md:text-3xl font-black tracking-wider uppercase leading-tight select-none"
                            >
                                UNCOMPROMISING<br />DETAIL
                            </h2>
                            <p 
                                className="text-white/70 font-sans text-xs md:text-sm mt-3 leading-relaxed select-none"
                            >
                                We dismantle the mystery. Inspect every body panel, wheel structure, and cabin space suspended in zero-gravity.
                            </p>
                        </div>
                    </motion.div>

                    {/* Beat C: Piece by Perfect Piece */}
                    <motion.div
                        style={{ opacity: beatCOpacity, y: beatCY, filter: beatCBlur }}
                        className="absolute top-28 md:top-36 w-full max-w-7xl px-8 md:px-24 flex flex-col items-end text-right pointer-events-auto"
                    >
                        <div className="border border-white/10 bg-black/40 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] relative overflow-hidden max-w-md w-full text-right flex flex-col items-end">
                            {/* Corner tech indicators */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-teal-500/60" />
                            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-teal-500/60" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-teal-500/60" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-teal-500/60" />

                            <div className="flex items-center gap-2 mb-4 font-mono text-[9px] md:text-[10px] text-teal-400 tracking-[0.2em] uppercase select-none opacity-80">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                                <span>[ DIAGNOSTICS: STABLE ]</span>
                                <span className="text-white/20">|</span>
                                <span>ENGINE: V12</span>
                            </div>

                            <h2 
                                className="text-white/95 text-xl md:text-3xl font-black tracking-wider uppercase leading-tight select-none"
                            >
                                ANATOMY OF<br />PERFORMANCE
                            </h2>
                            <p 
                                className="text-white/70 font-sans text-xs md:text-sm mt-3 leading-relaxed select-none"
                            >
                                Witness the heart of luxury. A hand-built, twin-turbocharged V12 engine floating in pristine digital space.
                            </p>
                        </div>
                    </motion.div>

                    {/* Beat D: Find Your Nest Title (Top Aligned) */}
                    <motion.div
                        style={{ opacity: beatDOpacity, y: beatDY, filter: beatDBlur }}
                        className="absolute top-24 md:top-32 flex flex-col items-center text-center px-6 w-full max-w-4xl"
                    >
                        <h2 
                            className="text-white/95 text-3xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-none select-none"
                            style={titleGlow}
                        >
                            Find Your Dream Car
                        </h2>
                    </motion.div>

                    {/* Beat D: SearchBar CTA (Bottom Aligned) */}
                    <motion.div
                        style={{ 
                            opacity: beatDOpacity, 
                            y: beatDY,
                            visibility: searchBarVisibility,
                            pointerEvents: searchBarPointerEvents
                        }}
                        className="absolute bottom-8 md:bottom-12 w-full max-w-5xl px-6 flex justify-center"
                    >
                        <div className="w-full">
                            <SearchBar />
                        </div>
                    </motion.div>

                    {/* Scroll To Explore Indicator (0% to 10%) */}
                    <motion.div
                        style={{ opacity: exploreOpacity, y: exploreY }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
                    >
                        <span className="text-white/40 text-[9px] uppercase tracking-[0.3em] font-mono animate-pulse">
                            Scroll to Explore
                        </span>
                        <div className="w-[1px] h-12 bg-linear-to-b from-white/30 to-transparent mt-4 animate-bounce" />
                    </motion.div>

                </div>
            </div>
        </div>
    );
}

export default Hero;
