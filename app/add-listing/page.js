"use client";
import React, { useState } from 'react'
import Header from '../_components/Header'
import carDetails from '../Shared/carDetails.json'
import InputField from './components/InputField'
import DropdownField from './components/DropdownField'
import TextAreaField from './components/TextAreaField'
import { Separator } from '@/components/ui/separator'
import features from '../Shared/features.json'
import { Checkbox } from '@/components/ui/checkbox'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { createCarListing } from '@/app/actions/carListing'

function AddListing() {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const router = useRouter();

    const handleInputChange = (name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Separate feature checkboxes from main car details
            const carDetailKeys = carDetails.carDetails.map(item => item.name);
            const details = {};
            const featuresObj = {};

            Object.entries(formData).forEach(([key, value]) => {
                if (carDetailKeys.includes(key)) {
                    details[key] = value;
                } else {
                    featuresObj[key] = value;
                }
            });

            const submissionData = {
                ...details,
                features: featuresObj,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                userName: user?.fullName || 'Anonymous'
            };

            const response = await createCarListing(submissionData);
            if (response.success) {
                console.log("Listing created successfully with ID:", response.id);
                router.push('/profile');
            } else {
                alert("Failed to submit listing: " + response.error);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Header />
            <div className='p-6 md:p-12'>
                <h2 className='text-4xl font-bold'>Add New Listing</h2>
                <div className='w-full lg:w-2/3 mt-4'>
                    <form onSubmit={onSubmit} className=' mt-10 p-10 bg-white shadow-lg rounded-xl border border-gray-200'>
                        {/* Car Details */}
                        <div>
                            <h2 className='font-bold text-2xl mt-6 mb-3'>Car Details</h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                                {carDetails.carDetails.map((item, index) => (
                                    <div key={index} className={item.type === 'textarea' ? 'col-span-1 md:col-span-2' : ''}>
                                        {item.type == "text" || item.type == "number" ?
                                            <InputField item={item} handleInputChange={handleInputChange} /> :
                                            item.type == "select" ?
                                                <DropdownField item={item} handleInputChange={handleInputChange} /> :
                                                item.type == "textarea" ?
                                                    <TextAreaField item={item} handleInputChange={handleInputChange} /> : null
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Separator className="my-3 bg-gray-200 w-full mx-auto h-0.5" />

                        {/* Features List */}
                        <div>
                            <h2 className='font-bold text-2xl mb-3'>Features</h2>
                            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5'>
                                {features.features.map((item, index) => (
                                    <div key={index} className='flex gap-2 items-center' >
                                        <Checkbox onCheckedChange={(value) => handleInputChange(item.name, value)} /> <h2 className='text-md font-medium'>{item.label}</h2>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Submit Button */}
                        <div>
                            <button 
                                type='submit' 
                                disabled={loading}
                                className='bg-teal-600 text-white px-6 py-2 font-bold rounded-full text-md cursor-pointer hover:bg-teal-700 hover:font-extrabold hover:scale-105 transition-all shadow-md mt-8 ml-auto block disabled:bg-gray-400'
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddListing