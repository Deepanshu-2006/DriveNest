"use client";
import React, { useState, useEffect } from 'react'
import Header from '../_components/Header'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserCarListings, deleteCarListing } from '@/app/actions/carListing'
import CarItem from '../_components/CarItem'
import { Inbox, User, List, Plus, Car, Mail, Calendar, Settings, AlertTriangle } from 'lucide-react'
import { toast } from 'react-toastify'

function Profile() {
    const { isSignedIn, isLoaded, user } = useUser();
    const isDark = isLoaded && isSignedIn;
    const [userListings, setUserListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const router = useRouter();

    const handleEdit = (car) => {
        router.push(`/add-listing?mode=edit&id=${car.id}`);
    }

    const confirmDelete = (car) => {
        setSelectedCar(car);
        setShowDeleteModal(true);
    }

    const handleDelete = async () => {
        if (!selectedCar) return;
        setDeletingId(selectedCar.id);

        try {
            const res = await deleteCarListing(selectedCar.id);
            if (res.success) {
                toast.success(`Listing for "${selectedCar.name}" deleted successfully.`);
                fetchUserListings();
            } else {
                toast.error("Failed to delete listing: " + res.error);
            }
        } catch (error) {
            console.error("Error deleting listing:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setDeletingId(null);
            setShowDeleteModal(false);
            setSelectedCar(null);
        }
    }

    useEffect(() => {
        if (isLoaded && isSignedIn && user?.primaryEmailAddress?.emailAddress) {
            fetchUserListings();
        }
    }, [isLoaded, isSignedIn, user]);

    const fetchUserListings = async () => {
        setLoading(true);
        try {
            const email = user.primaryEmailAddress.emailAddress;
            const listings = await getUserCarListings(email);
            // Map db schema to CarItem required shape
            const mapped = listings.map(listing => ({
                ...listing,
                name: listing.listingTitle,
                price: listing.sellingPrice,
                fuelType: listing.fuelType,
                geartype: listing.transmission,
                miles: listing.mileage,
                image: listing.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600'
            }));
            setUserListings(mapped);
        } catch (error) {
            console.error("Error loading user listings:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={isDark ? "dark bg-[#050505] min-h-screen text-white transition-all duration-500" : "bg-slate-50 min-h-screen text-slate-900 transition-all duration-500"}>
            <Header />
            <div className='p-6 md:p-12 max-w-7xl mx-auto'>
                <Tabs defaultValue="my-listing" className="w-full">
                    {/* Tabs Navigation */}
                    <div className="flex justify-center mb-10">
                        <TabsList className={`p-1.5 rounded-full border transition-all duration-300 ${isDark ? 'bg-[#0f0f0f]/80 border-white/5 shadow-2xl' : 'bg-white border-slate-200/80 shadow-md'}`}>
                            <TabsTrigger 
                                value="my-listing" 
                                className="px-6 py-2.5 rounded-full font-bold transition-all flex items-center gap-2 cursor-pointer text-sm"
                            >
                                <List className="w-4 h-4" />
                                My Listings
                            </TabsTrigger>
                            <TabsTrigger 
                                value="inbox" 
                                className="px-6 py-2.5 rounded-full font-bold transition-all flex items-center gap-2 cursor-pointer text-sm"
                            >
                                <Inbox className="w-4 h-4" />
                                Inbox
                            </TabsTrigger>
                            <TabsTrigger 
                                value="profile" 
                                className="px-6 py-2.5 rounded-full font-bold transition-all flex items-center gap-2 cursor-pointer text-sm"
                            >
                                <User className="w-4 h-4" />
                                Profile
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* My Listings Content */}
                    <TabsContent value="my-listing" className="outline-none focus:outline-none">
                        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6 mb-6 transition-all duration-300 border-dashed border-gray-200 dark:border-white/10 gap-4'>
                            <div>
                                <h2 className={`text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>My Listings</h2>
                                <p className={`text-sm mt-1.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Manage and track your active vehicle advertisements.</p>
                            </div>
                            <Link href="/add-listing" className='bg-teal-600 text-white px-6 py-3 font-bold rounded-full text-sm cursor-pointer hover:bg-teal-700 hover:scale-105 transition-all shadow-lg flex items-center gap-2 hover:shadow-teal-600/10'>
                                <Plus className="w-4 h-4" /> Add New Listing
                            </Link>
                        </div>

                        {loading ? (
                            // Loading Skeletons
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className={`border rounded-xl p-4 animate-pulse ${isDark ? 'border-white/10 bg-[#0f0f0f]' : 'border-gray-200 bg-white'}`}>
                                        <div className={`aspect-video rounded-lg mb-4 ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
                                        <div className={`h-6 rounded-md w-3/4 mb-3 ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
                                        <div className={`h-4 rounded-md w-1/2 mb-6 ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
                                        <div className="flex justify-between items-center">
                                            <div className={`h-6 rounded-md w-1/3 ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
                                            <div className={`h-6 rounded-md w-1/4 ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : userListings.length > 0 ? (
                            // Listings Grid
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                                {userListings.map((car, index) => (
                                    <CarItem 
                                        key={index} 
                                        car={car} 
                                        mode="owner"
                                        onEdit={handleEdit}
                                        onDelete={confirmDelete}
                                    />
                                ))}
                            </div>
                        ) : (
                            // Beautiful Empty State
                            <div className={`flex flex-col items-center justify-center p-12 md:p-20 rounded-3xl border border-dashed mt-8 text-center transition-all ${isDark ? 'bg-[#0f0f0f]/40 border-white/10' : 'bg-white border-slate-200'}`}>
                                <div className={`p-5 rounded-2xl mb-6 ${isDark ? 'bg-[#151515] text-teal-400' : 'bg-teal-50 text-teal-600'}`}>
                                    <Car className="w-12 h-12" />
                                </div>
                                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>No listings found</h3>
                                <p className={`mt-2 max-w-sm text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                                    You haven't listed any vehicles yet. Let's create your first listing to find the perfect buyer!
                                </p>
                                <Link href="/add-listing" className="mt-8 bg-teal-600 text-white px-8 py-3.5 font-bold rounded-full text-sm hover:bg-teal-700 hover:scale-105 transition-all shadow-md">
                                    Create a Listing
                                </Link>
                            </div>
                        )}
                    </TabsContent>

                    {/* Inbox Content */}
                    <TabsContent value="inbox" className="outline-none focus:outline-none">
                        <div className="border-b pb-6 mb-6 transition-all duration-300 border-dashed border-gray-200 dark:border-white/10">
                            <h2 className={`text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Inbox</h2>
                            <p className={`text-sm mt-1.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Chat and negotiate with interested buyers.</p>
                        </div>
                        <div className={`flex flex-col items-center justify-center p-12 md:p-20 rounded-3xl border border-dashed mt-8 text-center transition-all ${isDark ? 'bg-[#0f0f0f]/40 border-white/10' : 'bg-white border-slate-200'}`}>
                            <div className={`p-5 rounded-2xl mb-6 ${isDark ? 'bg-[#151515] text-teal-400' : 'bg-teal-50 text-teal-600'}`}>
                                <Mail className="w-12 h-12 animate-bounce" />
                            </div>
                            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Your inbox is clear</h3>
                            <p className={`mt-2 max-w-sm text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                                When buyers reach out to you about your listed vehicles, their messages and chats will appear here.
                            </p>
                        </div>
                    </TabsContent>

                    {/* Profile Content */}
                    <TabsContent value="profile" className="outline-none focus:outline-none">
                        <div className="border-b pb-6 mb-6 transition-all duration-300 border-dashed border-gray-200 dark:border-white/10">
                            <h2 className={`text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>My Profile</h2>
                            <p className={`text-sm mt-1.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Manage your account credentials and garage stats.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                            {/* Profile Card */}
                            <div className={`md:col-span-1 p-6 rounded-3xl border transition-all ${isDark ? 'bg-[#0f0f0f] border-white/10' : 'bg-white border-slate-200/80 shadow-md'}`}>
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative group">
                                        <img 
                                            src={user?.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} 
                                            alt={user?.fullName || 'User Profile'} 
                                            className="w-24 h-24 rounded-full border-4 border-teal-500/20 object-cover shadow-lg group-hover:scale-105 transition-all duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                                            <Settings className="w-6 h-6 text-white animate-spin" />
                                        </div>
                                    </div>
                                    <h3 className={`text-xl font-bold mt-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>{user?.fullName || 'Anonymous User'}</h3>
                                    <p className={`text-sm ${isDark ? 'text-teal-400 font-semibold' : 'text-teal-600 font-bold'}`}>{user?.primaryEmailAddress?.emailAddress}</p>
                                    
                                    <div className={`mt-6 w-full p-4 rounded-2xl flex justify-around ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                        <div className="text-center">
                                            <span className="block text-2xl font-extrabold text-teal-500">{userListings.length}</span>
                                            <span className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Listings</span>
                                        </div>
                                        <div className="w-px bg-slate-200 dark:bg-white/10" />
                                        <div className="text-center">
                                            <span className="block text-2xl font-extrabold text-teal-500">Active</span>
                                            <span className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Status</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Details Column */}
                            <div className={`md:col-span-2 p-6 md:p-8 rounded-3xl border transition-all ${isDark ? 'bg-[#0f0f0f] border-white/10' : 'bg-white border-slate-200/80 shadow-md'}`}>
                                <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>Account Details</h3>
                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-dashed dark:border-white/5 border-slate-100">
                                        <span className={`text-sm font-semibold flex items-center gap-2 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                                            <User className="w-4 h-4 text-teal-500" /> Full Name
                                        </span>
                                        <span className="text-sm font-bold mt-1 sm:mt-0">{user?.fullName || 'Not Provided'}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-dashed dark:border-white/5 border-slate-100">
                                        <span className={`text-sm font-semibold flex items-center gap-2 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                                            <Mail className="w-4 h-4 text-teal-500" /> Email Address
                                        </span>
                                        <span className="text-sm font-bold mt-1 sm:mt-0">{user?.primaryEmailAddress?.emailAddress || 'Not Provided'}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-dashed dark:border-white/5 border-slate-100">
                                        <span className={`text-sm font-semibold flex items-center gap-2 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                                            <Calendar className="w-4 h-4 text-teal-500" /> Member Since
                                        </span>
                                        <span className="text-sm font-bold mt-1 sm:mt-0">
                                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recent'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            {/* Custom Confirm Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-all duration-300 animate-fade-in">
                    <div 
                        className={`relative w-full max-w-md p-6 overflow-hidden rounded-3xl border transition-all shadow-2xl scale-100 duration-300 animate-in zoom-in-95 ease-out ${
                            isDark ? 'bg-[#0f0f0f] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl mb-4 ${isDark ? 'bg-rose-500/10 text-rose-500' : 'bg-rose-50 text-rose-600'}`}>
                            <AlertTriangle className="h-7 w-7" />
                        </div>
                        <h3 className={`text-xl font-bold text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>Delete Listing</h3>
                        <p className={`text-sm text-center mt-3 leading-relaxed ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                            Are you sure you want to delete <span className="font-extrabold text-teal-500">{selectedCar?.name}</span>? This action cannot be undone and will permanently remove this listing and all its photos.
                        </p>
                        
                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedCar(null);
                                }}
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold text-center transition-all cursor-pointer border ${
                                    isDark 
                                        ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white hover:border-white/20' 
                                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                                }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deletingId !== null}
                                className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white text-center transition-all cursor-pointer shadow-md hover:shadow-rose-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {deletingId !== null ? (
                                    <>
                                        <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete Listing'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile