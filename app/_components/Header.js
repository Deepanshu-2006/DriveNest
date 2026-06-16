"use client";
import React from 'react'
import { UserButton, useUser } from "@clerk/nextjs"; // Import useUser hook instead
import Link from "next/link";

function Header() {
    const { isSignedIn } = useUser(); // Get login status

    return (
        <div>
            <header className="bg-white items-center">
                <div className="mx-5 flex h-22 w-full items-center justify-between">
                    <div className="flex items-center justify-start">
                        <img
                            src="/logo.png"
                            alt="Drive Nest Logo"
                            className="h-20 w-auto object-contain rounded-e-full"
                        />
                        <h1 className="bg-linear-to-r from-teal-500 to-emerald-800 bg-clip-text text-transparent text-[32px] font-extrabold">
                            DriveNest
                        </h1>
                    </div>
                    <div className="flex flex-1 items-center justify-end md:justify-end">
                        <nav aria-label="Global" className="hidden md:block">
                            <ul className="flex items-center justify-center gap-10 font-bold text-[18px] ml-75" >
                                <li>
                                    <a className="text-gray-500 transition hover:text-gray-500/75" href="#"> Home </a>
                                </li>
                                <li>
                                    <a className="text-gray-500 transition hover:text-gray-500/75" href="#"> Search </a>
                                </li>
                                <li>
                                    <a className="text-gray-500 transition hover:text-gray-500/75" href="#"> New </a>
                                </li>
                                <li>
                                    <a className="text-gray-500 transition hover:text-gray-500/75" href="#"> Preowned </a>
                                </li>
                            </ul>
                        </nav>

                        <div className="flex items-center gap-4 justify-end ml-auto pr-5 mr-5">

                            {/* If the user is signed in, show Submit Listing button & Profile icon */}
                            {isSignedIn ? (
                                <div className="flex items-center gap-4">
                                    <Link
                                        className="block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
                                        href="/submit-listing"
                                    >
                                        Submit Listing
                                    </Link>
                                    <UserButton afterSignOutUrl="/" />
                                </div>
                            ) : (
                                /* If the user is signed out, show the Login button */
                                <Link
                                    className="block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
                                    href="/sign-in"
                                >
                                    Get Started
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Header
