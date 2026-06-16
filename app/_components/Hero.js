"use client"
import Link from 'next/link'
import React from 'react'
import { useUser } from "@clerk/nextjs";
import SearchBar from './SearchBar';

function Hero() {
    const { isSignedIn } = useUser();
    return (
        <div className="bg-indigo-50 h-150 ">
            <div className="text-center pt-25 items-center">
                <p className="text-md mb-8 font-bold">Find Cars for sale and for rent near you</p>
                <h1 className="text-5xl font-bold mb-4  pt-3 font-sans">Find Your Dream Car </h1>
                {!isSignedIn && (
                    <div>
                        <Link href="/sign-in" className="inline-block rounded-md bg-teal-600 px-8 py-3 text-lg font-medium text-white transition hover:bg-teal-700 shadow-md">
                            Get Started
                        </Link>
                    </div>
                )}
                {isSignedIn && <SearchBar />}
                {/* Replace line 22 in Hero.js */}
                <div className="flex justify-center mt-10">
                    <img
                        src="/Tesla.png"
                        alt="Tesla Model"
                        className="w-full max-w-2xl lg:max-w-270 object-contain"
                    />
                </div>

            </div>

        </div>
    )
}

export default Hero
