import React from 'react'
import Image from 'next/image'
import FakeData from '../Shared/FakeData'
import fuel from "@/public/fuel.png"
import gearshift from '@/public/gearshift.png'
import speedometer from '@/public/speedometer.png'
import { Separator } from '@/components/ui/separator'
import { ExternalLink } from 'lucide-react'



function CarItem({ car }) {
    return (
        <div className='relative border-gray-400 border-2 bg-white rounded-xl hover:scale-102 transition-all duration-200 cursor-pointer mt-5 hover:shadow-xl ml-2 mr-2 mb-10'>
            <h2 className='absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 '>New</h2>
            <img src={car?.image} width={300} height={250} className='rounded-t-xl w-full object-cover' alt="" />
            <div className=''>
                <h2 className='font-bold text-xl text-black mb-2 text-start mt-4 ml-5'>{car?.name}</h2>
                <Separator className="my-3 bg-gray-200 w-[90%] mx-auto h-0.5" />
                <div className='grid grid-cols-3 mt-5'>
                    <div className='flex flex-col items-center'>
                        <Image src={fuel} width={25} height={25} className='text-lg mb-1' alt="Fuel" />
                        <h2 className='text-lg font-semibold'>{car.fuelType}</h2>
                    </div>
                    <div className='flex flex-col items-center'>
                        <Image src={gearshift} width={25} height={25} className='text-lg mb-1' alt="Fuel" />
                        <h2 className='text-lg font-semibold'>{car.geartype}</h2>
                    </div>
                    <div className='flex flex-col items-center'>
                        <Image src={speedometer} width={25} height={25} className='text-lg mb-1' alt="Fuel" />
                        <h2 className='text-lg font-semibold'>{car.miles}</h2>
                    </div>
                </div>
                <Separator className="my-3 bg-gray-200 w-[90%] mx-auto h-0.5" />
                <div className='flex items-center justify-between mb-2'>
                    <h2 className='font-bold text-xl text-start ml-5'>${car.price}</h2>
                    <h2 className='mr-5 text-teal-600 font-bold cursor-pointer flex gap-1 items-center hover:scale-102 hover:font-bold transition-all duration-200'>
                        View Details <ExternalLink className='h-4 w-4 hover:scale-102 hover:font-extrabold transition-all duration-200' />
                    </h2>
                </div>
            </div>
        </div>
    )
}

export default CarItem