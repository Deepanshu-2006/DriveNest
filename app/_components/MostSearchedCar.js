"use client";

import React, { useState, useEffect } from 'react'
import CarItem from './CarItem';
import { getAllCarListings } from '@/app/actions/carListing'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'


function MostSearchedCar({ selectedCategory }) {
    const { isSignedIn } = useUser();
    const isDark = isSignedIn;
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchListings() {
            setLoading(true);
            try {
                const data = await getAllCarListings();
                const mapped = data.map(item => ({
                    ...item,
                    name: item.listingTitle,
                    price: item.sellingPrice,
                    fuelType: item.fuelType,
                    geartype: item.transmission,
                    miles: item.mileage,
                    image: item.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600'
                }));
                setListings(mapped);
            } catch (error) {
                console.error("Failed to fetch listings in MostSearchedCar:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchListings();
    }, []);

    const filteredCars = selectedCategory 
        ? listings.filter(car => car.category === selectedCategory)
        : listings;

    return (
        <motion.div 
            id="featured-showroom" 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className='px-10 md:px-20 mt-8 md:mt-12 text-center scroll-mt-28'
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 text-left gap-4">
                <div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Featured Showroom
                    </h2>
                    <p className="mt-2 text-sm md:text-base text-slate-500 dark:text-slate-400">
                        The latest high-performance vehicles in our collection
                    </p>
                </div>
                <div className="shrink-0 flex items-center md:pb-1">
                    <a 
                        href="/search" 
                        className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors border-b-2 border-teal-500/30 hover:border-teal-500 pb-0.5 inline-flex items-center group"
                    >
                        <span>View All Inventory</span>
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 20 20" 
                            fill="currentColor" 
                            className="w-0 h-4 opacity-0 overflow-hidden transition-all duration-250 ease-out group-hover:w-4 group-hover:opacity-100 group-hover:ml-1.5 group-hover:translate-x-0.5"
                        >
                            <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                        </svg>
                    </a>
                </div>
            </div>
            
            {loading ? (
                <div className="flex gap-4 overflow-hidden justify-center">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`border rounded-xl p-4 animate-pulse w-full max-w-75 ${isDark ? 'border-white/10 bg-[#0f0f0f]' : 'border-gray-200 bg-white'}`}>
                            <div className={`aspect-video rounded-lg mb-4 ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
                            <div className={`h-6 rounded-md w-3/4 mb-3 ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
                            <div className={`h-4 rounded-md w-1/2 mb-6 ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
                            <div className="flex justify-between items-center">
                                <div className={`h-6 rounded-md w-1/3 ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
                                <div className={`h-6 rounded-md w-1/4 ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredCars.length > 0 ? (
                <Carousel key={selectedCategory || 'all'} className="cursor-pointer w-full" opts={{ align: 'start', loop: true, duration: 30 }}>
                    <CarouselContent className="-ml-4 py-4">
                        <AnimatePresence mode="popLayout">
                            {filteredCars.map((car, index) => (
                                <CarouselItem key={car.id || car.listingTitle || index} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.85, y: 25 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.85, y: -20 }}
                                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.05, 0.2) }}
                                        className="h-full"
                                    >
                                        <CarItem car={car} />
                                    </motion.div>
                                </CarouselItem>
                            ))}
                        </AnimatePresence>
                    </CarouselContent>
                    <CarouselPrevious className="cursor-pointer -left-4 md:-left-6 bg-white/80 dark:bg-black/80 hover:scale-110 transition-transform shadow-lg border-slate-200 dark:border-white/10" />
                    <CarouselNext className="cursor-pointer -right-4 md:-right-6 bg-white/80 dark:bg-black/80 hover:scale-110 transition-transform shadow-lg border-slate-200 dark:border-white/10" />
                </Carousel>
            ) : (
                <div className={`flex flex-col items-center justify-center p-12 border rounded-2xl ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'} shadow-md max-w-lg mx-auto transition-all duration-300`}>
                    <div className={`p-4 rounded-full ${isDark ? 'bg-teal-500/10 text-teal-400' : 'bg-teal-50 text-teal-600'} mb-4`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>No Cars Found</h3>
                    <p className={`text-center mt-2 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                        We don't have any {selectedCategory} vehicles currently listed. Check back later or explore other types!
                    </p>
                </div>
            )}
        </motion.div>
    )
}

export default MostSearchedCar