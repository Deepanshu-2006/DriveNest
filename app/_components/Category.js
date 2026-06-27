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

const getIconAnimationClass = (name) => {
    switch (name) {
        case 'Hybrid':
            return 'group-hover:rotate-12 group-hover:scale-110';
        case 'Electric':
            return 'group-hover:scale-110 group-hover:animate-pulse';
        default:
            return 'group-hover:translate-x-1.5 group-hover:-translate-y-0.5 group-hover:scale-110';
    }
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.04
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
        opacity: 1, 
        y: 0, 
        transition: { 
            type: "spring", 
            stiffness: 120, 
            damping: 14 
        } 
    }
};

function Category({ selectedCategory, onCategorySelect }) {
    const { isSignedIn } = useUser();
    const isDark = isSignedIn;

    return (
        <div className='relative mt-16 md:mt-24 px-6 md:px-12 lg:px-20 overflow-hidden py-4'>
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/4 dark:bg-teal-500/2 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="flex flex-col items-center text-center mb-10">
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

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                className='grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4 max-w-7xl mx-auto'
            > 
                {Data.Category.map((Category, index) => {
                    const IconComponent = categoryIcons[Category.name];
                    const isSelected = selectedCategory === Category.name;
                    
                    const cardClasses = isSelected
                        ? 'border-teal-500 bg-teal-50/40 text-teal-600 shadow-[0_0_20px_rgba(20,184,166,0.08)] dark:border-teal-400/80 dark:bg-teal-400/10 dark:text-teal-400 dark:shadow-[0_0_30px_rgba(45,212,191,0.2)]'
                        : 'border-slate-200/60 bg-white/70 text-slate-400 shadow-[0_8px_32px_rgba(0,0,0,0.01)] hover:border-teal-500/40 hover:bg-white hover:shadow-[0_12px_32px_rgba(20,184,166,0.06)] dark:border-white/[0.05] dark:bg-zinc-900/30 dark:text-white/40 dark:shadow-[0_8px_32px_rgba(0,0,0,0.15)] dark:hover:border-teal-400/40 dark:hover:bg-zinc-900/60 dark:hover:shadow-[0_12px_32px_rgba(45,212,191,0.12)]';

                    const iconWrapperClasses = isSelected
                        ? 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400 border border-teal-500/10 dark:border-teal-400/10 shadow-inner'
                        : 'bg-slate-50 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/[0.02] text-slate-500 dark:text-white/50 group-hover:bg-teal-500/10 group-hover:text-teal-600 dark:group-hover:bg-teal-500/20 dark:group-hover:text-teal-400 group-hover:border-teal-500/10 dark:group-hover:border-teal-400/10';

                    const textClasses = isSelected
                        ? 'text-teal-600 dark:text-teal-400 font-extrabold'
                        : 'text-slate-600 group-hover:text-teal-600 dark:text-white/70 dark:group-hover:text-teal-400 font-bold';

                    return (
                        <motion.div 
                            key={index} 
                            variants={itemVariants}
                            whileHover={{ 
                                scale: 1.04, 
                                y: -6,
                                transition: { duration: 0.2, ease: "easeOut" }
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onCategorySelect && onCategorySelect(isSelected ? null : Category.name)}
                            className={`relative border rounded-2xl p-4 md:p-5 flex flex-col items-center justify-center gap-3.5 group cursor-pointer transition-all duration-300 ${cardClasses}`}
                        >
                            <div className={`p-3.5 rounded-2xl transition-all duration-300 ${iconWrapperClasses}`}>
                                {IconComponent ? (
                                    <IconComponent className={`w-6 h-6 transition-all duration-300 ${getIconAnimationClass(Category.name)}`} />
                                ) : (
                                    <div className="w-6 h-6 bg-gray-500 rounded-full animate-pulse" />
                                )}
                            </div>
                            <span className={`text-xs tracking-wider uppercase transition-colors duration-300 text-center ${textClasses}`}>
                                {Category.name}
                            </span>
                            
                            {/* Shared Layout Active Indicator Dot */}
                            {isSelected && (
                                <motion.div 
                                    layoutId="activeCategoryDot"
                                    className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400 shadow-[0_0_8px_#14b8a6] dark:shadow-[0_0_8px_#2dd4bf]"
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                />
                            )}
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    )
}

export default Category