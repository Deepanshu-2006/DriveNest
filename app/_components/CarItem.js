import React from 'react'
import Image from 'next/image'
import FakeData from '../Shared/FakeData'
import fuel from "@/public/fuel.png"
import gearshift from '@/public/gearshift.png'
import speedometer from '@/public/speedometer.png'
import { Separator } from '@/components/ui/separator'
import { ExternalLink } from 'lucide-react'
import { useUser } from '@clerk/nextjs'


function CarItem({ car }) {
    const { isSignedIn } = useUser();
    const isDark = isSignedIn;

    return (
        <div className={`relative border rounded-xl hover:scale-102 transition-all duration-200 cursor-pointer mt-5 ml-2 mr-2 mb-10 ${isDark ? 'border-white/10 bg-[#0f0f0f] text-white hover:shadow-[0_4px_30px_rgba(20,184,166,0.05)]' : 'border-gray-300 bg-white text-slate-900 hover:shadow-xl'}`}>
            <h2 className='absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 '>New</h2>
            <img src={car?.image} width={300} height={250} className='rounded-t-xl w-full object-cover' alt="" />
            <div className=''>
                <h2 className={`font-bold text-xl mb-2 text-start mt-4 ml-5 ${isDark ? 'text-white' : 'text-black'}`}>{car?.name}</h2>
                <Separator className={`my-3 w-[90%] mx-auto h-[1px] ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                <div className='grid grid-cols-3 mt-5'>
                    <div className='flex flex-col items-center'>
                        <Image src={fuel} width={25} height={25} className={`text-lg mb-1 ${isDark ? 'invert' : ''}`} alt="Fuel" />
                        <h2 className='text-lg font-semibold'>{car.fuelType}</h2>
                    </div>
                    <div className='flex flex-col items-center'>
                        <Image src={gearshift} width={25} height={25} className={`text-lg mb-1 ${isDark ? 'invert' : ''}`} alt="Gear" />
                        <h2 className='text-lg font-semibold'>{car.geartype}</h2>
                    </div>
                    <div className='flex flex-col items-center'>
                        <Image src={speedometer} width={25} height={25} className={`text-lg mb-1 ${isDark ? 'invert' : ''}`} alt="Speedometer" />
                        <h2 className='text-lg font-semibold'>{car.miles}</h2>
                    </div>
                </div>
                <Separator className={`my-3 w-[90%] mx-auto h-[1px] ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='font-bold text-xl text-start ml-5'>${car.price}</h2>
                    <h2 className={`mr-5 font-bold cursor-pointer flex gap-1 items-center transition-all duration-200 ${isDark ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-700'}`}>
                        View Details <ExternalLink className='h-4 w-4 hover:scale-102 hover:font-extrabold transition-all duration-200' />
                    </h2>
                </div>
            </div>
        </div>
    )
}

export default CarItem