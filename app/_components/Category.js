import React from 'react'
import Image from 'next/image'
import Data from '@/app/Shared/Data'
import { useUser } from '@clerk/nextjs'

function Category() {
    const { isSignedIn } = useUser();
    const isDark = isSignedIn;

    return (
        <div className='mt-10 px-10 md:px-20'>
            <h2 className='font-bold text-4xl text-center font-stretch-120%'>Browse By Type</h2>
            <p className={`text-xl text-center mt-2 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Explore our wide range of cars</p>
            <div className='grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4 mt-8'> 
                {Data.Category.map((Category, index) =>(
                    <div key={index} className={`border rounded-xl p-4 flex flex-col items-center group cursor-pointer hover:scale-105 transition-all duration-200 ${isDark ? 'border-white/10 bg-white/5 hover:border-teal-400 hover:bg-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)]' : 'border-gray-300 bg-white hover:border-teal-500 hover:shadow-md'}`}>
                        <Image src={Category.icon} width={40} height={40} alt={Category.name} className={`object-contain ${isDark ? 'invert opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200' : ''}`} />
                        <h2 className={`text-m font-bold mt-2 transition-colors duration-200 ${isDark ? 'text-white/80 group-hover:text-teal-400' : 'text-gray-700 group-hover:text-teal-600'}`}>{Category.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Category