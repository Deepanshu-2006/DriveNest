"use client";
import React, { useState } from 'react';
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Menu, X } from "lucide-react";

function Header() {
    const { isSignedIn } = useUser();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 cursor-pointer">
                        <img
                            src="/logo.png"
                            alt="Drive Nest Logo"
                            className="h-14 w-auto object-contain rounded-e-full"
                        />
                        <span className="bg-linear-to-r from-teal-500 to-emerald-800 bg-clip-text text-transparent text-2xl font-extrabold tracking-tight">
                            DriveNest
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav aria-label="Global" className="hidden md:flex items-center gap-8 font-semibold text-[16px]">
                        <ul className="flex items-center gap-8">
                            <li>
                                <Link className="text-gray-600 transition hover:text-teal-600" href="/"> Home </Link>
                            </li>
                            <li>
                                <Link className="text-gray-600 transition hover:text-teal-600" href="/search"> Search </Link>
                            </li>
                            <li>
                                <Link className="text-gray-600 transition hover:text-teal-600" href="/submit-listing"> New </Link>
                            </li>
                            <li>
                                <Link className="text-gray-600 transition hover:text-teal-600" href="/search?condition=preowned"> Preowned </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Right action buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {isSignedIn ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    className="block rounded-full bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 shadow-sm"
                                    href="/submit-listing"
                                >
                                    Submit Listing
                                </Link>
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        ) : (
                            <Link
                                className="block rounded-full bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 shadow-sm"
                                href="/sign-in"
                            >
                                Get Started
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden gap-4">
                        {isSignedIn && <UserButton afterSignOutUrl="/" />}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-gray-600 hover:text-teal-600 transition focus:outline-none"
                            aria-expanded={isOpen}
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {isOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3 shadow-inner animate-in fade-in slide-in-from-top-2 duration-200">
                    <nav className="flex flex-col gap-3 font-medium text-[16px]">
                        <Link onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md hover:bg-gray-50 transition" href="/"> Home </Link>
                        <Link onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md hover:bg-gray-50 transition" href="/search"> Search </Link>
                        <Link onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md hover:bg-gray-50 transition" href="/submit-listing"> New </Link>
                        <Link onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md hover:bg-gray-50 transition" href="/search?condition=preowned"> Preowned </Link>
                    </nav>
                    {!isSignedIn && (
                        <div className="pt-2 border-t border-gray-100">
                            <Link
                                onClick={() => setIsOpen(false)}
                                className="block text-center rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 shadow-sm"
                                href="/sign-in"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                    {isSignedIn && (
                        <div className="pt-2 border-t border-gray-100">
                            <Link
                                onClick={() => setIsOpen(false)}
                                className="block text-center rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 shadow-sm"
                                href="/submit-listing"
                            >
                                Submit Listing
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}

export default Header;
