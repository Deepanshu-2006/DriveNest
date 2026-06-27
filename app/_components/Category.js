"use client";
import React from 'react'
import Data from '@/app/Shared/Data'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { 
    TbCarSuv, 
    TbCar, 
    TbLeaf, 
    TbTruck, 
    TbChargingPile
} from 'react-icons/tb';
import { 
    PiCarSimple, 
    PiCarProfile, 
    PiVan 
} from 'react-icons/pi';
import { RiRoadsterLine } from 'react-icons/ri';

const categoryIcons = {
    "SUV": TbCarSuv,
    "Sedan": TbCar,
    "Hatchback": PiCarSimple,
    "Coupe": PiCarProfile,
    "Hybrid": TbLeaf,
    "Convertible": RiRoadsterLine,
    "Van": PiVan,
    "Truck": TbTruck,
    "Electric": TbChargingPile
};

function Category({ selectedCategory, onCategorySelect }) {
    const { isSignedIn } = useUser();
    const isDark = isSignedIn;

    return (
        <div className='relative mt-14 md:mt-20 px-10 md:px-20 overflow-hidden py-4 w-full'>
            <div className="flex flex-col items-start text-left mb-10">
                <span className="text-xs font-bold tracking-widest text-teal-600 dark:text-teal-400 uppercase">
                    Categories
                </span>
                <h2 className="mt-1 text-3xl md:text-4xl font-extrabold tracking-tight bg-linear-to-b from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                    Browse By Type
                </h2>
                <p className="mt-2 text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-md">
                    Explore our wide range of cars
                </p>
            </div>

            {/* Apple-style Tab Bar Container */}
            <div className="w-full border-b border-slate-200/80 dark:border-white/40">
                <div className='flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar scroll-smooth gap-2 pb-px w-full'> 
                    {Data.Category.map((Category, index) => {
                        const IconComponent = categoryIcons[Category.name];
                        const isSelected = selectedCategory === Category.name;
                        
                        const textClasses = isSelected
                            ? 'text-teal-600 dark:text-teal-400 font-extrabold'
                            : 'text-slate-500 dark:text-white/40 hover:text-slate-800 dark:hover:text-white font-bold';

                        return (
                            <button 
                                key={index} 
                                onClick={() => onCategorySelect && onCategorySelect(isSelected ? null : Category.name)}
                                className={`relative pb-4 pt-2 px-5 md:px-6 flex items-center justify-center gap-2 group cursor-pointer transition-colors duration-200 select-none shrink-0 outline-hidden ${textClasses}`}
                            >
                                {IconComponent && (
                                    <IconComponent className={`w-4.5 h-4.5 transition-all duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`} />
                                )}
                                <span className="text-xs md:text-sm tracking-wide uppercase">
                                    {Category.name}
                                </span>
                                
                                {/* Sleek Underline Transition using Framer Motion */}
                                {isSelected && (
                                    <motion.div 
                                        layoutId="activeTabUnderline"
                                        className="absolute bottom-0 left-0 right-0 h-[3px] z-10 bg-teal-500 dark:bg-teal-400 shadow-[0_-1px_12px_rgba(20,184,166,0.6)] rounded-t-full"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default Category