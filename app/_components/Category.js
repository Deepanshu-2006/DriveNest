import React from 'react'
import Image from 'next/image'
import Data from '@/app/Shared/Data'

function Category() {
    return (
        <div className='mt-10 px-10 md:px-20'>
            <h2 className='font-bold text-4xl text-center font-stretch-120%'>Browse By Type</h2>
            <p className='text-gray-500 text-xl text-center mt-2'>Explore our wide range of cars</p>
            <div className='grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4 mt-8'> 
                {Data.Category.map((Category, index) =>(
                    <div key={index} className='border-gray-400 border-2 rounded-xl p-4 flex flex-col items-center group hover:border-teal-500 hover:shadow-md cursor-pointer hover:scale-105 transition-all duration-200'>
                        <Image src={Category.icon} width={40} height={40} alt={Category.name} className='object-contain' />
                        <h2 className='text-m font-bold text-gray-700 group-hover:text-teal-600'>{Category.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Category