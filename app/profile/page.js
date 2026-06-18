import React from 'react'
import Header from '../_components/Header'
import Link from 'next/link'

function Profile() {
    return (
        <div>
            <Header />
            <div className='mx-14 mt-6'>
                <div className='flex justify-between items-center'>
                    <h2 className='text-4xl font-bold'>My Listings</h2>
                    <Link href="/add-listing" className='bg-teal-600 text-white px-6 py-2 font-bold rounded-full text-sm cursor-pointer hover:bg-teal-700 hover:font-extrabold hover:scale-105 transition-all shadow-md'>+ Add New Listing</Link>
                </div>
            </div>
        </div>
    )
}

export default Profile