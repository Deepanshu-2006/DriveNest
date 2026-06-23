import React from 'react'
import Image from 'next/image'
import info from '@/public/INFO.jpg'
import { useUser } from '@clerk/nextjs'

function InfoSection() {
    const { isSignedIn } = useUser();
    const isDark = isSignedIn;

    return (
        <section>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mb-10">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
                    <div>
                        <div className="max-w-prose md:max-w-none">
                            <h2 className={`text-2xl font-semibold sm:text-3xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Drive Your Dream, Discover the Best Deals
                            </h2>

                            <p className={`mt-4 text-pretty ${isDark ? 'text-white/70' : 'text-gray-700'}`}>
                                Browse an exclusive collection of new and pre-owned vehicles from trusted dealers and sellers. Compare features, explore detailed listings, and find the perfect car that fits your lifestyle and budget.
                            </p>
                        </div>
                    </div>

                    <div>
                        <Image src={info} width={700} height={800} className="rounded-3xl object-cover shadow-[0_10px_50px_rgba(0,0,0,0.5)]" alt="" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default InfoSection