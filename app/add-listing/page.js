"use client";
import React, { useState, useEffect, Suspense } from 'react'
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
import { useRouter, useSearchParams } from 'next/navigation'
import { createCarListing, getCarListingById, updateCarListing } from '@/app/actions/carListing'
import LivePreviewCard from './components/LivePreviewCard'
import { Eye } from 'lucide-react'
import { toast } from 'react-toastify'

function AddListingContent() {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const { user, isSignedIn } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isDark = isSignedIn;

    const mode = searchParams.get('mode');
    const listingId = searchParams.get('id');

    useEffect(() => {
        if (mode === 'edit' && listingId) {
            getListingDetails();
        }
    }, [mode, listingId]);

    const getListingDetails = async () => {
        setLoading(true);
        try {
            const result = await getCarListingById(listingId);
            if (result) {
                setFormData({
                    ...result,
                    ...result.features,
                    images: result.images || []
                });
            }
        } catch (error) {
            console.error("Error loading listing details:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleInputChange = (name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!formData.images || formData.images.length === 0) {
            alert("Please upload at least one image before submitting.");
            return;
        }

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

            let response;
            if (mode === 'edit' && listingId) {
                response = await updateCarListing(listingId, submissionData);
            } else {
                response = await createCarListing(submissionData);
            }
            if (response.success) {
                toast.success(mode === 'edit' ? "Listing updated successfully!" : "Listing created successfully!");
                router.push('/profile');
            } else {
                toast.error("Failed to submit listing: " + response.error);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const requiredFields = carDetails.carDetails.filter(item => item.required);
    const isFormValid = requiredFields.every(field => {
        const val = formData[field.name];
        if (val === undefined || val === null) return false;
        if (typeof val === 'string' && val.trim() === '') return false;
        return true;
    }) && !!(formData.images && formData.images.length > 0);

    return (
        <div className='p-6 md:p-12 max-w-7xl mx-auto'>
            <h2 className={`text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {mode === 'edit' ? 'Edit Listing' : 'Add New Listing'}
            </h2>
            <p className={`mt-2 text-md ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Fill out the details to list your vehicle on DriveNest.</p>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 items-start'>
                {/* Form Container (2/3 width on desktop) */}
                <div className='lg:col-span-2'>
                    <form onSubmit={onSubmit} className={`p-6 md:p-10 shadow-2xl rounded-2xl border transition-all duration-300 ${isDark ? 'bg-[#0f0f0f] border-white/10 text-white' : 'bg-white border-slate-200/80'}`}>
                        {/* Car Details */}
                        <div>
                            <h2 className={`font-bold text-2xl mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>Car Details</h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {carDetails.carDetails.map((item, index) => (
                                    <div key={index} className={item.type === 'textarea' ? 'col-span-1 md:col-span-2' : ''}>
                                        {item.type == "text" || item.type == "number" ?
                                            <InputField item={item} handleInputChange={handleInputChange} value={formData[item.name]} /> :
                                            item.type == "select" ?
                                                <DropdownField item={item} handleInputChange={handleInputChange} value={formData[item.name]} /> :
                                                item.type == "textarea" ?
                                                    <TextAreaField item={item} handleInputChange={handleInputChange} value={formData[item.name]} /> : null
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator className={`my-8 h-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

                        {/* Features List */}
                        <div>
                            <h2 className={`font-bold text-2xl mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>Features</h2>
                            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2'>
                                {features.features.map((item, index) => (
                                    <div key={index} className={`flex gap-3 items-center p-2 rounded-lg transition-colors duration-150 ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`} >
                                        <Checkbox
                                            checked={!!formData[item.name]}
                                            onCheckedChange={(value) => handleInputChange(item.name, value)}
                                        />
                                        <h2 className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-slate-700'}`}>{item.label}</h2>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Images Upload */}
                        <div>
                            <ImagesUpload setImages={(urls) => handleInputChange('images', urls)} defaultImages={formData.images} />
                        </div>

                        {/* Submit Button */}
                        <div className={`border-t pt-6 mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                            <div className="text-sm font-medium">
                                {isFormValid ? (
                                    <p className="text-emerald-600 flex items-center gap-1.5 font-bold animate-fade-in">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span>Ready to publish! All required fields are completed.</span>
                                    </p>
                                ) : (
                                    <p className="text-rose-500 flex items-center gap-1.5 font-semibold">
                                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                        <span>Complete all required fields (*) and upload photos to publish.</span>
                                    </p>
                                )}
                            </div>
                            <button
                                type='submit'
                                disabled={loading}
                                className='bg-teal-600 text-white px-8 py-3 font-bold rounded-full text-md cursor-pointer hover:bg-teal-700 hover:shadow-lg transition-all duration-200 disabled:bg-slate-300 disabled:cursor-not-allowed w-full sm:w-auto text-center'
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
    )
}

function AddListing() {
    const { isSignedIn } = useUser();
    const isDark = isSignedIn;

    return (
        <div className={isDark ? "dark bg-[#050505] min-h-screen text-white transition-all duration-500" : "bg-slate-50 min-h-screen text-slate-900 transition-all duration-500"}>
            <Header />
            <Suspense fallback={
                <div className="flex justify-center items-center min-h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                </div>
            }>
                <AddListingContent />
            </Suspense>
        </div>
    )
}

export default AddListing