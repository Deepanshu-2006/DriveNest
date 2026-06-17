"use client"
import Link from 'next/link'
import React from 'react'
import { useUser } from "@clerk/nextjs";
import SearchBar from './SearchBar';

function Hero() {
    const { isSignedIn } = useUser();
    return (
        <div className="w-full">
            {/* Top section with background */}
            <div className="relative w-full bg-emerald-50 pt-16 md:pt-20 px-4 pb-32 md:pb-72">
                <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
                    {/* Small Tagline */}
                    <p className="text-teal-600 text-sm md:text-base font-semibold uppercase tracking-wider mb-3">
                        Find Cars for sale and for rent near you
                    </p>
                    
                    {/* Hero Title */}
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 max-w-3xl leading-tight">
                        Find Your <span className="bg-linear-to-r from-teal-500 to-emerald-700 bg-clip-text text-transparent">Dream Car</span>
                    </h1>

                    {/* Call to action or SearchBar */}
                    <div className="w-full max-w-4xl transition-all duration-300">
                        {!isSignedIn ? (
                            <div className="flex justify-center mt-2">
                                <Link href="/sign-in" className="inline-block rounded-full bg-teal-600 px-8 py-3 text-lg font-semibold text-white transition-all hover:bg-teal-700 hover:scale-105 active:scale-95 shadow-lg shadow-teal-600/20">
                                    Get Started
                                </Link>
                            </div>
                        ) : (
                            <SearchBar />
                        )}
                    </div>
                </div>
            </div>

            {/* Car Image section overlapping the boundary with split background & radial gradient */}
            <div className="w-full bg-gradient-to-b from-transparent 50%, #f4f6f8 50% relative z-10 -mt-20 md:-mt-48">
                <div className="max-w-7xl mx-auto px-4 flex flex-col items-center pb-12 relative">
                    {/* Soft Mint Radial Gradient Pop */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-[radial-gradient(circle,_rgba(20,184,166,0.15)_0%,_transparent_75%)] -z-10 pointer-events-none blur-xl"></div>
                    
                    {/* Car Image */}
                    <img
                        src="/Tesla.png"
                        alt="Tesla Model"
                        className="w-full max-w-2xl md:max-w-5xl object-contain relative z-10"
                    />

                    {/* Ground Shadow */}
                    <div className="w-[85%] max-w-4xl h-6 bg-[radial-gradient(ellipse_at_center,_rgba(15,23,42,0.35)_0%,_transparent_70%)] blur-md mx-auto -mt-6 z-0 pointer-events-none"></div>
                </div>
            </div>
        </div>
    )
}

export default Hero
