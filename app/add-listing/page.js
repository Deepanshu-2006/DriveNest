"use client";
import React, { useState } from 'react'
import Header from '../_components/Header'
import carDetails from '../Shared/carDetails.json'
import InputField from './components/InputField'
import DropdownField from './components/DropdownField'
import TextAreaField from './components/TextAreaField'
import ImagesUpload from './components/ImagesUpload'
import { Separator } from '@/components/ui/separator'
import features from '../Shared/features.json'
import { Checkbox } from '@/components/ui/checkbox'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { createCarListing } from '@/app/actions/carListing'
import LivePreviewCard from './components/LivePreviewCard'
import { Eye } from 'lucide-react'

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
            // Separate feature checkboxes, images, and main car details from formData
            const carDetailKeys = carDetails.carDetails.map(item => item.name);
            const details = {};
            const featuresObj = {};
            let images = [];

            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'images') {
                    images = value;
                } else if (carDetailKeys.includes(key)) {
                    details[key] = value;
                } else {
                    featuresObj[key] = value;
                }
            });

            const submissionData = {
                ...details,
                features: featuresObj,
                images: images,
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
        <div className="bg-slate-50 min-h-screen">
            <Header />
            <div className='p-6 md:p-12 max-w-7xl mx-auto'>
                <h2 className='text-4xl font-extrabold text-slate-900 tracking-tight'>Add New Listing</h2>
                <p className='text-slate-500 mt-2 text-md'>Fill out the details to list your vehicle on DriveNest.</p>
                
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 items-start'>
                    {/* Form Container (2/3 width on desktop) */}
                    <div className='lg:col-span-2'>
                        <form onSubmit={onSubmit} className='p-6 md:p-10 bg-white shadow-xl rounded-2xl border border-slate-200/80'>
                            {/* Car Details */}
                            <div>
                                <h2 className='font-bold text-2xl text-slate-800 mb-6'>Car Details</h2>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
                            
                            <Separator className="my-8 bg-slate-200 h-px" />

                            {/* Features List */}
                            <div>
                                <h2 className='font-bold text-2xl text-slate-800 mb-4'>Features</h2>
                                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2'>
                                    {features.features.map((item, index) => (
                                        <div key={index} className='flex gap-3 items-center hover:bg-slate-50 p-2 rounded-lg transition-colors duration-150' >
                                            <Checkbox onCheckedChange={(value) => handleInputChange(item.name, value)} />
                                            <h2 className='text-sm font-medium text-slate-700'>{item.label}</h2>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Images Upload */}
                            <div>
                                <ImagesUpload setImages={(urls) => handleInputChange('images', urls)} />
                            </div>
                            
                            {/* Submit Button */}
                            <div className='border-t border-slate-100 pt-6 mt-8 flex justify-end'>
                                <button 
                                    type='submit' 
                                    disabled={loading}
                                    className='bg-teal-600 text-white px-8 py-3 font-bold rounded-full text-md cursor-pointer hover:bg-teal-700 hover:shadow-lg transition-all duration-200 disabled:bg-slate-300 disabled:cursor-not-allowed'
                                >
                                    {loading ? 'Submitting...' : 'Submit Listing'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Live Preview Container (1/3 width on desktop, sticky on scroll) */}
                    <div className='lg:col-span-1 lg:sticky lg:top-24 mt-4 lg:mt-0'>
                        <div className="flex items-center gap-2 mb-4 px-1">
                            <div className="flex items-center gap-1.5 bg-teal-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-teal-500/20">
                                <Eye className="w-3.5 h-3.5 animate-pulse" />
                                <span>Live Ad Preview</span>
                            </div>
                        </div>
                        <LivePreviewCard formData={formData} user={user} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddListing