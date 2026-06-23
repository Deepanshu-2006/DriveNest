"use client";
import React from 'react'
import Header from '../_components/Header'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'

function Profile() {
    const { isSignedIn, isLoaded } = useUser();
    const isDark = isLoaded && isSignedIn;

    return (
        <div className={isDark ? "dark bg-[#050505] min-h-screen text-white transition-all duration-500" : "bg-slate-50 min-h-screen text-slate-900 transition-all duration-500"}>
            <Header />
            <div className='p-6 md:p-12 max-w-7xl mx-auto'>
                <div className='flex justify-between items-center border-b pb-6 transition-all duration-300 border-dashed border-gray-200 dark:border-white/10'>
                    <h2 className={`text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>My Listings</h2>
                    <Link href="/add-listing" className='bg-teal-600 text-white px-6 py-2.5 font-bold rounded-full text-sm cursor-pointer hover:bg-teal-700 hover:font-extrabold hover:scale-105 transition-all shadow-md'>+ Add New Listing</Link>
                </div>
            </div>
        </div>
    )
}

export default Profile