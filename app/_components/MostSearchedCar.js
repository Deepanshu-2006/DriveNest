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
        <div className='px-10 md:px-20 mt-16 md:mt-24 text-center'>
            <div className="flex flex-col items-center text-center mb-8">
                <span className="text-xs font-bold tracking-widest text-teal-600 dark:text-teal-400 uppercase">
                    Trending
                </span>
                <h2 className="mt-1 text-3xl md:text-4xl font-extrabold tracking-tight bg-linear-to-b from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                    Most Searched Cars
                </h2>
                <p className="mt-2 text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-md">
                    Discover the most popular cars
                </p>
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
                <Carousel className="cursor-pointer" opts={{ align: 'start' }}>
                    <CarouselContent>
                        {filteredCars.map((car, index) => (
                            <CarouselItem key={index} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                                <CarItem car={car} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="cursor-pointer" />
                    <CarouselNext className="cursor-pointer" />
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
        </div>
    )
}

export default MostSearchedCar