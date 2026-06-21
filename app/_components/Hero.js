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
                        style={{ opacity: beatAOpacity, y: beatAY }}
                        className="absolute top-28 md:top-36 flex flex-col items-center text-center px-6 max-w-4xl"
                    >
                        <h2 
                            className="text-white/95 text-3xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-none select-none"
                            style={titleGlow}
                        >
                            RE-ENGINEERING THE SEARCH.
                        </h2>
                        <p 
                            className="text-white/80 font-mono tracking-[0.15em] text-xs md:text-sm mt-4 max-w-xl select-none uppercase"
                            style={subtitleGlow}
                        >
                            Welcome to Drive Nest. Where pristine performance meets digital precision.
                        </p>
                    </motion.div>

                    {/* Beat B: Absolute Transparency */}
                    <motion.div
                        style={{ opacity: beatBOpacity, y: beatBY }}
                        className="absolute top-28 md:top-36 w-full max-w-7xl px-8 md:px-24 flex flex-col items-start text-left"
                    >
                        <h2 
                            className="text-white/95 text-3xl md:text-5xl font-black tracking-tight uppercase leading-tight select-none"
                            style={titleGlow}
                        >
                            ABSOLUTE<br />TRANSPARENCY.
                        </h2>
                        <p 
                            className="text-white/80 font-mono tracking-[0.15em] text-xs md:text-sm mt-4 max-w-md select-none uppercase"
                            style={subtitleGlow}
                        >
                            Doors open. Hood raised. We unveil every angle so you can inspect the extraordinary.
                        </p>
                    </motion.div>

                    {/* Beat C: Piece by Perfect Piece */}
                    <motion.div
                        style={{ opacity: beatCOpacity, y: beatCY }}
                        className="absolute top-28 md:top-36 w-full max-w-7xl px-8 md:px-24 flex flex-col items-end text-right"
                    >
                        <h2 
                            className="text-white/95 text-3xl md:text-5xl font-black tracking-tight uppercase leading-tight select-none"
                            style={titleGlow}
                        >
                            PIECE BY PERFECT PIECE.
                        </h2>
                        <p 
                            className="text-white/80 font-mono tracking-[0.15em] text-xs md:text-sm mt-4 max-w-md select-none uppercase"
                            style={subtitleGlow}
                        >
                            Dive beneath the chassis. Explore verified mechanics suspended in digital zero-gravity.
                        </p>
                    </motion.div>

                    {/* Beat D: Find Your Nest Title (Top Aligned) */}
                    <motion.div
                        style={{ opacity: beatDOpacity, y: beatDY }}
                        className="absolute top-24 md:top-32 flex flex-col items-center text-center px-6 w-full max-w-4xl"
                    >
                        <p 
                            className="text-white/95 text-3xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-none select-none"
                            style={titleGlow}
                        >
                            Find Your Dream Car
                        </p>
                    </motion.div>

                    {/* Beat D: SearchBar CTA (Bottom Aligned) */}
                    <motion.div
                        style={{ opacity: beatDOpacity, y: beatDY }}
                        className="absolute bottom-8 md:bottom-12 w-full max-w-5xl px-6 flex justify-center pointer-events-auto"
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
