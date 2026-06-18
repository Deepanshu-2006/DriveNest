import React from 'react'
import Header from '../_components/Header'
import { carDetails } from '@/app/Shared/carDetails' 


function AddListing() {
    return (
        <div>
            <Header />
            <div className='p-6 md:p-12'>
                <h2 className='text-4xl font-bold'>Add New Listing</h2>
                <div className='w-full lg:w-2/3 mt-4'>
                    <form className=' mt-10 p-10 bg-white shadow-lg rounded-xl border border-gray-200'>
                        {/* Car Details */}
                        <div >
                            <h2 className='font-bold text-2xl mt-6 mb-3'>Car Details</h2>
                            <div >
                                {carDetails.carDetails.map((item,index)=>{
                                    <div key={index}>
                                        
                                    </div>
                                })}
                            </div>
                        </div>
                        {/* Features List */}
                        {/* Car Images */}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddListing