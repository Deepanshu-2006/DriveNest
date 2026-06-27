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

    // Title slides down from top towards the center
    const titleY = useTransform(scrollProgress, [0.75, 0.9], [-150, 0]);

    // SearchBar slides up from bottom towards the center
    const searchBarY = useTransform(scrollProgress, [0.75, 0.9], [150, 0]);

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
            <div className="w-full">
                {/* Top section with background */}
                <div className="relative w-full bg-teal-50 pt-16 md:pt-20 px-4 pb-32 md:pb-72">
                    <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
                        {/* Small Tagline */}
                        <p className="text-teal-600 text-sm md:text-base font-semibold uppercase tracking-wider mb-3">
                            Find Cars for sale and for rent near you
                        </p>

                        {/* Hero Title */}
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 max-w-3xl leading-tight">
                            Find Your <span className="bg-linear-to-r from-teal-500 to-emerald-700 bg-clip-text text-transparent">Dream Car</span>
                        </h1>

                        {/* Call to Action Button */}
                        <div className="w-full max-w-4xl transition-all duration-300">
                            <div className="flex justify-center mt-2">
                                <Link href="/sign-in" className="inline-block rounded-full bg-teal-600 px-8 py-3 text-lg font-semibold text-white transition-all hover:bg-teal-700 hover:scale-105 active:scale-95 shadow-lg shadow-teal-600/20">
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Car Image section overlapping the boundary with split background & radial gradient */}
                <div className="w-full bg-linear-to-b from-transparent 50%, #f4f6f8 50% relative z-10 -mt-20 md:-mt-48">
                    <div className="max-w-7xl mx-auto px-4 flex flex-col items-center pb-12 relative">
                        {/* Soft Mint Radial Gradient Pop */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-[radial-gradient(circle,rgba(20,184,166,0.15)_0%,transparent_75%)] -z-10 pointer-events-none blur-xl"></div>

                        {/* Car Image */}
                        <img
                            src="/Tesla.png"
                            alt="Tesla Model"
                            className="w-full max-w-2xl md:max-w-5xl object-contain relative z-10"
                        />

                        {/* Ground Shadow */}
                        <div className="w-[85%] max-w-4xl h-6 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.35)_0%,transparent_70%)] blur-md mx-auto -mt-6 z-0 pointer-events-none"></div>
                    </div>
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
                        <div className="border border-white/10 bg-black/80 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] relative overflow-hidden w-full">
                            {/* Corner tech indicators */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-teal-500/60" />
                            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-teal-500/60" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-teal-500/60" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-teal-500/60" />

                            <h2
                                className="text-white text-xl md:text-3xl font-black tracking-wider uppercase leading-snug select-none"
                            >
                                CAR ACQUISITION RE-ENGINEERED
                            </h2>
                            <p
                                className="text-white font-sans text-xs md:text-sm mt-3 leading-relaxed select-none"
                            >
                                Welcome to DriveNest. Where exceptional machinery emerges from the digital void, offering unprecedented clarity.
                            </p>
                        </div>
                    </motion.div>

                    {/* Beat B: Absolute Transparency */}
                    <motion.div
                        style={{ opacity: beatBOpacity, y: beatBY, filter: beatBBlur }}
                        className="absolute top-28 md:top-36 w-full px-6 md:px-12 lg:px-16 flex flex-col items-start text-left pointer-events-auto"
                    >
                        {/* HUD CAD-style Leader Callout Line pointing to the Chassis/Door */}
                        <div className="absolute left-[56%] top-60 w-3 h-3 rounded-full bg-teal-400 border border-white shadow-[0_0_12px_rgba(20,184,166,1)] -translate-x-1/2 -translate-y-1/2 hidden md:block pointer-events-none z-20" />
                        <div className="absolute left-[56%] top-60 w-5 h-5 rounded-full bg-teal-400/30 animate-ping -translate-x-1/2 -translate-y-1/2 hidden md:block pointer-events-none z-20" />

                        {/* Diagonal segment from chassis/door to label level */}
                        <div className="absolute left-[45%] top-30 w-[11%] h-30 hidden md:block pointer-events-none">
                            <svg className="w-full h-full overflow-visible">
                                <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(20, 250, 220, 0.95)" strokeWidth="2.5" strokeDasharray="4 2" />
                            </svg>
                        </div>

                        {/* Horizontal segment connecting to card */}
                        <div className="absolute md:left-124 lg:left-128 right-[55%] top-30 h-0.75 hidden md:block pointer-events-none">
                            <svg className="w-full h-full overflow-visible">
                                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(20, 250, 220, 0.95)" strokeWidth="2.5" strokeDasharray="4 2" />
                            </svg>
                        </div>
                        <div className="border border-white/10 bg-black/80 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] relative overflow-hidden max-w-md w-full">
                            {/* Corner tech indicators */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-teal-500/60" />
                            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-teal-500/60" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-teal-500/60" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-teal-500/60" />

                            <h2
                                className="text-white text-xl md:text-3xl font-black tracking-wider uppercase leading-tight select-none"
                            >
                                UNCOMPROMISING<br />DETAIL
                            </h2>
                            <p
                                className="text-white font-sans text-xs md:text-sm mt-3 leading-relaxed select-none"
                            >
                                We dismantle the mystery. Inspect every body panel, wheel structure, and cabin space suspended in zero-gravity.
                            </p>
                        </div>
                    </motion.div>

                    {/* Beat C: Piece by Perfect Piece */}
                    <motion.div
                        style={{ opacity: beatCOpacity, y: beatCY, filter: beatCBlur }}
                        className="absolute top-28 md:top-36 w-full px-6 md:px-12 lg:px-16 flex flex-col items-end text-right pointer-events-auto"
                    >
                        {/* HUD CAD-style Leader Callout Line pointing to the Engine */}
                        <div className="absolute left-[50%] top-55 w-3 h-3 rounded-full bg-teal-400 border border-white shadow-[0_0_12px_rgba(20,184,166,1)] -translate-x-1/2 -translate-y-1/2 hidden md:block pointer-events-none z-20" />
                        <div className="absolute left-[50%] top-55 w-5 h-5 rounded-full bg-teal-400/30 animate-ping -translate-x-1/2 -translate-y-1/2 hidden md:block pointer-events-none z-20" />

                        {/* Diagonal segment from engine to label level */}
                        <div className="absolute left-[50%] top-30 w-[5%] h-25 hidden md:block pointer-events-none">
                            <svg className="w-full h-full overflow-visible">
                                <line x1="0" y1="100%" x2="100%" y2="0" stroke="rgba(20, 250, 220, 0.95)" strokeWidth="2.5" strokeDasharray="4 2" />
                            </svg>
                        </div>

                        {/* Horizontal segment connecting to card */}
                        <div className="absolute left-[55%] md:right-124 lg:right-128 top-30 h-0.75 hidden md:block pointer-events-none">
                            <svg className="w-full h-full overflow-visible">
                                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(20, 250, 220, 0.95)" strokeWidth="2.5" strokeDasharray="4 2" />
                            </svg>
                        </div>
                        <div className="border border-white/10 bg-black/80 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] relative overflow-hidden max-w-md w-full text-right flex flex-col items-end">
                            {/* Corner tech indicators */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-teal-500/60" />
                            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-teal-500/60" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-teal-500/60" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-teal-500/60" />

                            <h2
                                className="text-white text-xl md:text-3xl font-black tracking-wider uppercase leading-tight select-none"
                            >
                                ANATOMY OF<br />PERFORMANCE
                            </h2>
                            <p
                                className="text-white font-sans text-sm md:text-md mt-3 leading-relaxed select-none"
                            >
                                Witness the heart of luxury. A hand-built, twin-turbocharged V12 engine floating in pristine digital space.
                            </p>
                        </div>
                    </motion.div>

                    {/* Beat D: Centered Title & Search Bar */}
                    <motion.div
                        style={{
                            opacity: beatDOpacity,
                            filter: beatDBlur,
                            visibility: searchBarVisibility
                        }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
                    >
                        <motion.h2
                            style={{ ...titleGlow, y: titleY }}
                            className="text-white/95 text-3xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-none select-none mb-14 pointer-events-none"
                        >
                            Find Your Dream Car
                        </motion.h2>
                        <motion.div
                            style={{ y: searchBarY, pointerEvents: searchBarPointerEvents }}
                            className="w-full max-w-4xl flex justify-center"
                        >
                            <div className="w-full pointer-events-auto">
                                <SearchBar />
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Scroll To Explore Indicator (0% to 10%) */}
                    <motion.div
                        style={{ opacity: exploreOpacity, y: exploreY }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
                    >
                        <span className="text-white/40 text-[9px] uppercase tracking-[0.3em] font-mono animate-pulse">
                            Scroll to Explore
                        </span>
                        <div className="w-px h-12 bg-linear-to-b from-white/30 to-transparent mt-4 animate-bounce" />
                    </motion.div>

                </div>
            </div>
        </div>
    );
}

export default Hero;
