"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '../_components/Header';
import Footer from '../_components/Footer';
import CarItem from '../_components/CarItem';
import CompareDrawer from '../_components/CompareDrawer';
import { getAllCarListings } from '@/app/actions/carListing';
import { useUser } from '@clerk/nextjs';
import Data from '../Shared/Data';
import carDetails from '../Shared/carDetails.json';
import { Search, RotateCcw, SlidersHorizontal, Car, Info, Sparkles } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../_components/ui/Select';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const isDark = isLoaded && isSignedIn;

  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [textSearch, setTextSearch] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [make, setMake] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Extract lists from JSON structure
  const makeOptions = carDetails.carDetails.find(item => item.name === 'make')?.options || [];
  const categoryOptions = carDetails.carDetails.find(item => item.name === 'category')?.options || [];
  const conditionOptions = carDetails.carDetails.find(item => item.name === 'condition')?.options || [];

  // Load URL query parameters on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const urlCategory = searchParams.get('category');
    const urlCondition = searchParams.get('condition');
    const urlMake = searchParams.get('make');
    const urlPrice = searchParams.get('price');
    const urlQuery = searchParams.get('q');

    setTextSearch(urlQuery || '');
    setCategory(urlCategory || '');
    if (urlCondition) {
      // Map 'preowned' query value to 'Certified Pre-Owned'
      if (urlCondition.toLowerCase() === 'preowned') {
        setCondition('Certified Pre-Owned');
      } else {
        setCondition(urlCondition);
      }
    } else {
      setCondition('');
    }
    setMake(urlMake || '');
    setMaxPrice(urlPrice || '');

    fetchAllListings();
  }, [searchParams]);

  const fetchAllListings = async () => {
    setLoading(true);
    try {
      const data = await getAllCarListings();
      // Map Drizzle schema fields to CarItem props
      const mapped = data.map(item => ({
        ...item,
        name: item.listingTitle,
        price: item.sellingPrice,
        fuelType: item.fuelType,
        geartype: item.transmission,
        miles: item.mileage,
        image: item.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600'
      }));
      setListings(mapped);
    } catch (error) {
      console.error("Failed to load listings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Perform client-side filtering on states change
  useEffect(() => {
    let result = [...listings];

    // Text Search Filter (on title, make, or model)
    if (textSearch.trim()) {
      const query = textSearch.toLowerCase();
      result = result.filter(car => 
        (car.name || '').toLowerCase().includes(query) ||
        (car.make || '').toLowerCase().includes(query) ||
        (car.model || '').toLowerCase().includes(query)
      );
    }

    // Category Filter
    if (category) {
      result = result.filter(car => car.category === category);
    }

    // Condition Filter
    if (condition) {
      result = result.filter(car => car.condition === condition);
    }

    // Make Filter
    if (make) {
      result = result.filter(car => car.make === make);
    }

    // Max Pricing Filter
    if (maxPrice) {
      const priceLimit = parseFloat(maxPrice);
      if (!isNaN(priceLimit)) {
        result = result.filter(car => parseFloat(car.price) <= priceLimit);
      }
    }

    setFilteredListings(result);
  }, [listings, textSearch, category, condition, make, maxPrice]);

  const handleResetFilters = () => {
    setTextSearch('');
    setCategory('');
    setCondition('');
    setMake('');
    setMaxPrice('');
    router.replace('/search');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Search Header Banner */}
      <div className="mb-8 border-b pb-6 border-dashed dark:border-white/10 border-slate-200">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Search className="w-8 h-8 text-teal-500" />
          <span>Search Inventory</span>
        </h1>
        <p className={`text-sm mt-1.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
          Browse, filter, and explore all vehicles currently available on DriveNest.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Filter Sidebar Column (1/4 width) */}
        <div className={`lg:col-span-1 p-6 border rounded-3xl shadow-xl transition-all duration-300 ${
          isDark ? 'border-white/10 bg-[#0f0f0f]/80 backdrop-blur-md text-white' : 'border-slate-200 bg-white text-slate-900'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-teal-500" />
              <span>Filters</span>
            </h3>
            <button 
              onClick={handleResetFilters}
              className="text-xs font-bold text-teal-500 hover:text-teal-400 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-5 text-sm">
            
            {/* Keyword Search */}
            <div>
              <label className={`text-xs font-bold ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Keyword</label>
              <div className="relative mt-1">
                <input 
                  type="text" 
                  placeholder="e.g. Aston Martin, DB11..."
                  value={textSearch}
                  onChange={(e) => setTextSearch(e.target.value)}
                  className={`w-full text-xs p-3 pr-10 border rounded-xl outline-none focus:border-teal-500 transition-all ${
                    isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className={`text-xs font-bold ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Category</label>
              <Select value={category || 'all'} onValueChange={(val) => setCategory(val === 'all' ? '' : val)}>
                <SelectTrigger className={`w-full h-11 text-xs mt-1 border rounded-xl outline-none transition-all focus:ring-2 focus:ring-teal-500/25 ${
                  isDark ? 'bg-black/40 border-white/10 text-white focus:border-teal-500' : 'bg-white border-slate-200 text-slate-900 focus:border-teal-500'
                }`}>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent side="bottom">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoryOptions.map((opt, i) => (
                    <SelectItem key={i} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Condition Filter */}
            <div>
              <label className={`text-xs font-bold ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Condition</label>
              <Select value={condition || 'all'} onValueChange={(val) => setCondition(val === 'all' ? '' : val)}>
                <SelectTrigger className={`w-full h-11 text-xs mt-1 border rounded-xl outline-none transition-all focus:ring-2 focus:ring-teal-500/25 ${
                  isDark ? 'bg-black/40 border-white/10 text-white focus:border-teal-500' : 'bg-white border-slate-200 text-slate-900 focus:border-teal-500'
                }`}>
                  <SelectValue placeholder="All Conditions" />
                </SelectTrigger>
                <SelectContent side="bottom">
                  <SelectItem value="all">All Conditions</SelectItem>
                  {conditionOptions.map((opt, i) => (
                    <SelectItem key={i} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Make Filter */}
            <div>
              <label className={`text-xs font-bold ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Car Make</label>
              <Select value={make || 'all'} onValueChange={(val) => setMake(val === 'all' ? '' : val)}>
                <SelectTrigger className={`w-full h-11 text-xs mt-1 border rounded-xl outline-none transition-all focus:ring-2 focus:ring-teal-500/25 ${
                  isDark ? 'bg-black/40 border-white/10 text-white focus:border-teal-500' : 'bg-white border-slate-200 text-slate-900 focus:border-teal-500'
                }`}>
                  <SelectValue placeholder="All Makes" />
                </SelectTrigger>
                <SelectContent side="bottom">
                  <SelectItem value="all">All Makes</SelectItem>
                  {makeOptions.map((opt, i) => (
                    <SelectItem key={i} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Max Budget Limit */}
            <div>
              <label className={`text-xs font-bold ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Max Budget ($)</label>
              <input 
                type="number" 
                placeholder="e.g. 200000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className={`w-full text-xs p-3 border rounded-xl outline-none focus:border-teal-500 mt-1 transition-all ${
                  isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              />
            </div>

          </div>
        </div>

        {/* Listings Display Column (3/4 width) */}
        <div className="lg:col-span-3">
          
          <div className="flex justify-between items-center mb-6 px-2">
            <span className={`text-sm font-semibold ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              Found <span className="text-teal-500 font-extrabold">{filteredListings.length}</span> matching listings
            </span>
          </div>

          {loading ? (
            // Listings Loading State
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
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
          ) : filteredListings.length > 0 ? (
            // Listings Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((car, index) => (
                <CarItem key={index} car={car} />
              ))}
            </div>
          ) : (
            // Clean Empty State
            <div className={`flex flex-col items-center justify-center p-12 md:p-20 rounded-3xl border border-dashed text-center transition-all ${
              isDark ? 'bg-[#0f0f0f]/45 border-white/10' : 'bg-white border-slate-200'
            }`}>
              <div className={`p-5 rounded-2xl mb-6 ${isDark ? 'bg-[#151515] text-teal-400' : 'bg-teal-50 text-teal-600'}`}>
                <Car className="w-12 h-12" />
              </div>
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>No listings match</h3>
              <p className={`mt-2 max-w-sm text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                Try adjusting your keyword query, filters, or maximum budget to find matching options.
              </p>
              <button 
                onClick={handleResetFilters} 
                className="mt-6 bg-teal-600 text-white px-6 py-3 font-bold rounded-full text-xs hover:bg-teal-700 transition"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

function SearchPage() {
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
        <SearchContent />
      </Suspense>
      <CompareDrawer />
      <Footer />
    </div>
  );
}

export default SearchPage;
