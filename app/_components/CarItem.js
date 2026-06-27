import React from 'react'
import Image from 'next/image'
import FakeData from '../Shared/FakeData'
import fuel from "@/public/fuel.png"
import gearshift from '@/public/gearshift.png'
import speedometer from '@/public/speedometer.png'
import { Separator } from '@/components/ui/separator'
import { ExternalLink, GitCompare } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCompare } from '../_context/CompareContext'

function CarItem({ car, mode = 'view', onEdit, onDelete }) {
    const { isSignedIn } = useUser();
    const isDark = isSignedIn;
    const router = useRouter();
    const { addToCompare, removeFromCompare, isInCompare } = useCompare();
    const detailUrl = car?.id ? `/listing-details/${car.id}` : '#';

    const handleCardClick = (e) => {
        if (e.target.closest('button') || e.target.closest('a')) {
            return;
        }
        if (!isSignedIn) {
            router.push('/sign-in');
            return;
        }
        if (car?.id) {
            router.push(detailUrl);
        }
    };

    const isCompared = car?.id ? isInCompare(car.id) : false;

    return (
        <div 
            onClick={handleCardClick}
            className={`relative border rounded-2xl hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer my-2 group overflow-hidden ${isDark ? 'border-white/10 bg-[#0f0f0f] text-white hover:border-teal-500/50 hover:shadow-[0_12px_40px_rgba(20,184,166,0.15)]' : 'border-gray-200 bg-white text-slate-900 hover:border-teal-500/40 hover:shadow-2xl'}`}
        >
            {car?.id && (
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isSignedIn) {
                            router.push('/sign-in');
                            return;
                        }
                        if (isCompared) {
                            removeFromCompare(car.id);
                        } else {
                            addToCompare(car);
                        }
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full z-20 transition-all duration-200 hover:scale-110 shadow-md ${
                        isCompared
                            ? 'bg-teal-500 text-white hover:bg-teal-600'
                            : isDark
                                ? 'bg-black/60 text-white/80 border border-white/10 hover:bg-black/80 hover:text-white'
                                : 'bg-white/90 text-slate-700 border border-gray-200 hover:bg-white hover:text-teal-600'
                    }`}
                    title={isCompared ? "Remove from Compare" : "Add to Compare"}
                >
                    <GitCompare className="h-4 w-4" />
                </button>
            )}
            <h2 className={`absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-sm ${
                car?.condition === 'Used' ? 'bg-amber-600' :
                car?.condition === 'Certified Pre-Owned' ? 'bg-teal-600' : 'bg-emerald-500'
            }`}>
                {car?.condition || 'New'}
            </h2>
            <div className="overflow-hidden rounded-t-2xl">
                <img src={car?.image} className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500 ease-out' alt="" />
            </div>
            <div className=''>
                <h2 className={`font-bold text-xl mb-2 text-start mt-4 ml-5 ${isDark ? 'text-white' : 'text-black'}`}>{car?.name}</h2>
                <Separator className={`my-3 w-[90%] mx-auto h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
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
                <Separator className={`my-3 w-[90%] mx-auto h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='font-bold text-xl text-start ml-5'>${car.price}</h2>
                    <Link 
                        href={isSignedIn ? detailUrl : '/sign-in'}
                        onClick={(e) => {
                            if (isSignedIn && !car?.id) e.preventDefault();
                        }}
                        className={`mr-5 font-bold cursor-pointer flex gap-1 items-center transition-all duration-200 ${isDark ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-700'}`}
                    >
                        View Details <ExternalLink className='h-4 w-4 hover:scale-102 hover:font-extrabold transition-all duration-200' />
                    </Link>
                </div>
                {mode === 'owner' && (
                    <>
                        <Separator className={`my-3 w-[90%] mx-auto h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                        <div className="flex gap-3 px-5 pb-5">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit && onEdit(car);
                                }}
                                className="flex-1 py-2 px-4 rounded-lg text-sm font-bold bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-center transition-all border dark:border-white/5 border-slate-200 cursor-pointer"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete && onDelete(car);
                                }}
                                className="flex-1 py-2 px-4 rounded-lg text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white text-center transition-all cursor-pointer shadow-md hover:shadow-rose-600/10"
                            >
                                Delete
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default CarItem