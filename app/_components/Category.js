import React from 'react'
import Data from '@/app/Shared/Data'
import { useUser } from '@clerk/nextjs'
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
        <div className='mt-10 px-10 md:px-20'>
            <h2 className='font-bold text-4xl text-center font-stretch-120%'>Browse By Type</h2>
            <p className={`text-xl text-center mt-2 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Explore our wide range of cars</p>
            <div className='grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4 mt-8'> 
                {Data.Category.map((Category, index) => {
                    const IconComponent = categoryIcons[Category.name];
                    const isSelected = selectedCategory === Category.name;
                    
                    const cardClasses = isSelected
                        ? isDark
                            ? 'border-teal-400 bg-teal-500/10 text-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.4)] scale-105'
                            : 'border-teal-500 bg-teal-50 text-teal-600 shadow-[0_0_15px_rgba(20,184,166,0.3)] scale-105'
                        : isDark
                            ? 'border-white/10 bg-white/5 hover:border-teal-400 hover:bg-white/10 hover:scale-105 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
                            : 'border-gray-300 bg-white hover:border-teal-500 hover:shadow-md hover:scale-105';

                    const iconClasses = isSelected
                        ? isDark
                            ? 'text-teal-400 scale-110'
                            : 'text-teal-600 scale-110'
                        : isDark
                            ? 'text-white/80 group-hover:text-teal-400 group-hover:scale-110'
                            : 'text-gray-600 group-hover:text-teal-600 group-hover:scale-110';

                    const textClasses = isSelected
                        ? isDark
                            ? 'text-teal-400'
                            : 'text-teal-600'
                        : isDark
                            ? 'text-white/80 group-hover:text-teal-400'
                            : 'text-gray-700 group-hover:text-teal-600';

                    return (
                        <div 
                            key={index} 
                            onClick={() => onCategorySelect && onCategorySelect(isSelected ? null : Category.name)}
                            className={`border rounded-xl p-4 flex flex-col items-center group cursor-pointer transition-all duration-200 ${cardClasses}`}
                        >
                            {IconComponent ? (
                                <IconComponent className={`w-10 h-10 transition-all duration-200 ${iconClasses}`} />
                            ) : (
                                <div className="w-10 h-10 bg-gray-500 rounded-full animate-pulse" />
                            )}
                            <h2 className={`text-m font-bold mt-2 transition-colors duration-200 ${textClasses}`}>{Category.name}</h2>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Category