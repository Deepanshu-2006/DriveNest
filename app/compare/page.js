"use client";
import React, { useEffect, useState, Suspense } from 'react';
import Header from '../_components/Header';
import Footer from '../_components/Footer';
import { useCompare } from '../_context/CompareContext';
import { getCarListingById } from '@/app/actions/carListing';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Trash2, X, Check, Scale, Info, ChevronDown, ChevronUp } from 'lucide-react';
import featuresData from '../Shared/features.json';

const tooltipDescriptions = {
  'Selling Price': "The price at which this vehicle is currently listed for sale.",
  'Original Price': "The manufacturer's original retail price (MSRP) before any discounts or dealer markdowns.",
  'Make': "The brand or manufacturer of the vehicle (e.g., BMW, Audi, Tesla).",
  'Model': "The specific nameplate or product model (e.g., 3-Series, e-tron).",
  'Year': "The manufacture year of the vehicle.",
  'Category': "The body classification of the car (e.g., SUV, Sedan, Convertible).",
  'Fuel Type': "The primary power source (e.g., Gasoline, Diesel, Hybrid, Electric).",
  'Transmission': "The gearbox type, indicating manual control or automated shifting.",
  'Mileage': "The total distance (in miles) this vehicle has been driven.",
  'Engine': "The engine capacity or type (e.g., 4.0L V8, 2.0L Turbo).",
  'Cylinders': "The number of engine cylinders (e.g., V6 has 6, V8 has 8).",
  'Drive Type': "Indicates which wheels receive engine power (AWD, FWD, RWD).",
  'Color': "The physical exterior paint color of the vehicle.",
  'Doors': "The total count of cabin access doors.",
  'VIN': "Vehicle Identification Number: a unique 17-digit serial identifier."
};

function CompareContent() {
  const { compareCars, removeFromCompare, clearCompare, setCompareList, isLoaded: isContextLoaded } = useCompare();
  const { isSignedIn, isLoaded: isUserLoaded } = useUser();
  const isDark = isUserLoaded && isSignedIn;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [detailedCars, setDetailedCars] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Custom features states
  const [highlightDiff, setHighlightDiff] = useState(false);
  const [collapsed, setCollapsed] = useState({
    general: false,
    performance: false,
    interior: false,
    features: false,
    financing: false
  });

  // Financing calculator states
  const [downPayment, setDownPayment] = useState(5000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [loanTerm, setLoanTerm] = useState(60);

  // Features search state
  const [featureSearch, setFeatureSearch] = useState('');

  // Best Value highlighting states
  const [bestPriceId, setBestPriceId] = useState(null);

  // 1. Initial Load: Sync state from URL query parameters (?ids=1,2,3)
  useEffect(() => {
    if (!isContextLoaded) return;

    const urlIds = searchParams.get('ids');
    if (urlIds) {
      const idList = urlIds.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
      const currentIds = compareCars.map(c => c.id);
      
      const isSame = idList.length === currentIds.length && idList.every((val, idx) => val === currentIds[idx]);
      
      if (!isSame) {
        async function loadFromUrl() {
          setLoading(true);
          try {
            const promises = idList.map(id => getCarListingById(id));
            const results = await Promise.all(promises);
            const validCars = results.filter(car => car !== null);
            
            // Map back to global context simple objects
            const mapped = validCars.map(car => ({
              id: car.id,
              name: car.listingTitle,
              price: car.sellingPrice,
              fuelType: car.fuelType,
              geartype: car.transmission,
              miles: car.mileage,
              image: car.images?.[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600',
              condition: car.condition,
              category: car.category
            }));

            setCompareList(mapped);
            setDetailedCars(validCars);
          } catch (err) {
            console.error("Failed to load compare list from URL query parameters:", err);
          } finally {
            setLoading(false);
          }
        }
        loadFromUrl();
      }
    }
  }, [isContextLoaded]);

  // 2. Fetch full details dynamically when compareCars changes
  useEffect(() => {
    async function fetchDetails() {
      // Check if we need to load (prevents duplicate calls when synced from URL)
      const currentIdsStr = compareCars.map(c => c.id).join(',');
      const detailedIdsStr = detailedCars.map(c => c.id).join(',');
      
      if (currentIdsStr === detailedIdsStr) {
        return;
      }

      if (compareCars.length === 0) {
        setDetailedCars([]);
        return;
      }

      setLoading(true);
      try {
        const promises = compareCars.map(car => getCarListingById(car.id));
        const results = await Promise.all(promises);
        setDetailedCars(results.filter(car => car !== null));
      } catch (err) {
        console.error("Failed to load details for comparison:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [compareCars]);

  // 3. Keep URL query params synchronized with comparison list state changes
  useEffect(() => {
    if (isContextLoaded) {
      if (compareCars.length > 0) {
        const ids = compareCars.map(c => c.id).join(',');
        router.replace(`/compare?ids=${ids}`, { scroll: false });
      } else {
        router.replace('/compare', { scroll: false });
      }
    }
  }, [compareCars, isContextLoaded]);

  // 4. Calculate best price badge value
  useEffect(() => {
    if (detailedCars.length > 1) {
      let minPrice = Infinity;
      let bestPId = null;

      detailedCars.forEach(car => {
        const price = parseFloat(car.sellingPrice);
        
        if (!isNaN(price) && price < minPrice) {
          minPrice = price;
          bestPId = car.id;
        }
      });

      setBestPriceId(bestPId);
    } else {
      setBestPriceId(null);
    }
  }, [detailedCars]);

  // Helper to identify differences across spec values
  const checkIsDifferent = (key, isFeature = false) => {
    if (detailedCars.length <= 1) return false;
    if (isFeature) {
      const firstVal = detailedCars[0].features?.[key] === true;
      return detailedCars.some(car => (car.features?.[key] === true) !== firstVal);
    } else {
      const firstVal = detailedCars[0][key];
      return detailedCars.some(car => car[key] !== firstVal);
    }
  };

  const handleRemove = (carId) => {
    removeFromCompare(carId);
  };

  const toggleSection = (section) => {
    setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Financing Monthly Payment Calculation (EMI formula)
  const calculateEMI = (sellingPrice) => {
    const priceNum = parseFloat(sellingPrice);
    if (isNaN(priceNum)) return 0;
    
    const principal = Math.max(0, priceNum - parseFloat(downPayment || 0));
    const annualRate = parseFloat(interestRate || 0);
    const months = parseInt(loanTerm || 60);

    if (principal <= 0) return 0;
    if (annualRate <= 0) return principal / months;

    const monthlyRate = (annualRate / 100) / 12;
    const emi = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  const extractComparableNumber = (value) => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    if (typeof value !== 'string') return null;

    const normalized = value.replace(/,/g, '').trim();
    if (!normalized) return null;

    const match = normalized.match(/-?\d+(\.\d+)?/);
    if (!match) return null;

    const parsed = parseFloat(match[0]);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const getComparisonMeta = ({ better = 'min', getValue }) => {
    if (detailedCars.length <= 1) return null;

    const comparableEntries = detailedCars
      .map(car => ({ id: car.id, value: getValue(car) }))
      .filter(entry => entry.value !== null && Number.isFinite(entry.value));

    if (comparableEntries.length <= 1) return null;

    const values = comparableEntries.map(entry => entry.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    if (minValue === maxValue) return null;

    const bestValue = better === 'max' ? maxValue : minValue;
    const worstValue = better === 'max' ? minValue : maxValue;

    return {
      bestIds: comparableEntries.filter(entry => entry.value === bestValue).map(entry => entry.id),
      worstIds: comparableEntries.filter(entry => entry.value === worstValue).map(entry => entry.id),
    };
  };

  const getCellTone = (comparisonMeta, carId) => {
    if (!comparisonMeta) return null;
    if (comparisonMeta.bestIds.includes(carId)) return 'best';
    if (comparisonMeta.worstIds.includes(carId)) return 'worst';
    return null;
  };

  const getToneClasses = (tone) => {
    if (tone === 'best') {
      return 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 ring-1 ring-inset ring-emerald-500/20';
    }
    if (tone === 'worst') {
      return 'bg-rose-500/8 text-rose-700 dark:text-rose-200 ring-1 ring-inset ring-rose-500/14';
    }
    return 'text-slate-900 dark:text-white';
  };

  const renderMetricBadge = (tone, bestLabel, worstLabel) => {
    if (tone === 'best') {
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-500/12 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
          {bestLabel}
        </span>
      );
    }

    if (tone === 'worst') {
      return (
        <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.18em] text-rose-700 dark:text-rose-200">
          {worstLabel}
        </span>
      );
    }

    return null;
  };

  // Spec descriptions tooltip renderer helper
  const renderSpecLabel = (label) => {
    return (
      <div className="relative group flex items-center gap-1.5 cursor-pointer">
        <span>{label}</span>
        {tooltipDescriptions[label] && (
          <div className="relative flex items-center">
            <Info className="w-3.5 h-3.5 text-slate-400 hover:text-teal-500 transition-colors" />
            <div className="pointer-events-none absolute left-0 bottom-full mb-2 w-48 rounded-lg p-2 bg-slate-900 border border-white/10 text-white text-[10px] leading-normal font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
              {tooltipDescriptions[label]}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Filter features based on search string
  const filteredFeatures = featuresData.features.filter(f => 
    f.label.toLowerCase().includes(featureSearch.toLowerCase())
  );

  const emiComparisonMeta = getComparisonMeta({
    better: 'min',
    getValue: (car) => calculateEMI(car.sellingPrice),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Navigation & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-dashed dark:border-white/10 border-slate-200 pb-6">
        <div>
          <button 
            onClick={() => router.back()}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border rounded-full transition-all cursor-pointer mb-3 ${
              isDark 
                ? 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white' 
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-2">
            <Scale className="w-8 h-8 text-teal-500" />
            <span>Compare Vehicles</span>
          </h1>
          <p className={`text-sm mt-1.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
            Compare features, search options, calculate financing payments, and view ranks.
          </p>
        </div>

        {compareCars.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 self-start md:self-end">
            
            {/* Highlight Differences Toggle Switch */}
            {detailedCars.length > 1 && (
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold select-none">
                <span className={isDark ? 'text-white/80' : 'text-slate-700'}>Highlight Differences</span>
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={highlightDiff} 
                    onChange={() => setHighlightDiff(!highlightDiff)} 
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-neutral-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:after:bg-slate-400 peer-checked:bg-teal-500"></div>
                </div>
              </label>
            )}

            <button 
              onClick={clearCompare}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-2 cursor-pointer ${
                isDark 
                  ? 'border-white/10 text-white/85 bg-white/5 hover:bg-white/10 hover:text-white hover:border-red-500/30' 
                  : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:text-red-600'
              }`}
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear Comparison</span>
            </button>
          </div>
        )}
      </div>

      {loading ? (
        /* Loading */
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Loading comparison matrix...</p>
        </div>
      ) : compareCars.length === 0 ? (
        /* Empty State */
        <div className={`flex flex-col items-center justify-center p-12 md:p-24 rounded-3xl border border-dashed text-center transition-all ${
          isDark ? 'bg-[#0f0f0f]/45 border-white/10' : 'bg-white border-slate-200'
        }`}>
          <div className={`p-5 rounded-2xl mb-6 ${isDark ? 'bg-[#151515] text-teal-400' : 'bg-teal-50 text-teal-600'}`}>
            <Scale className="w-12 h-12" />
          </div>
          <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>No cars to compare</h3>
          <p className={`mt-2 max-w-sm text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
            Your comparison is empty. Browse listings to select vehicles to compare.
          </p>
          <Link 
            href="/search" 
            className="mt-6 bg-teal-600 text-white px-6 py-3 font-bold rounded-full text-xs hover:bg-teal-700 transition inline-block"
          >
            Explore Inventory
          </Link>
        </div>
      ) : (
        /* Comparison Table matrix */
        <div className="overflow-x-auto border rounded-3xl shadow-xl transition-all duration-300 bg-white dark:bg-[#0f0f0f] border-slate-200 dark:border-white/10">
          <table className="w-full border-collapse text-left min-w-175">
            
            {/* Header Column Cards */}
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10">
                <th className="p-4 md:p-6 w-50 text-sm font-extrabold uppercase tracking-wider text-slate-400 dark:text-white/40 align-middle bg-slate-50/50 dark:bg-[#080808]/50">
                  Vehicle Detail
                </th>
                {detailedCars.map((car) => (
                  <th key={car.id} className="p-4 md:p-6 align-top relative border-l border-slate-200 dark:border-white/10 w-75">
                    <button 
                      onClick={() => handleRemove(car.id)}
                      className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors cursor-pointer ${
                        isDark ? 'hover:bg-white/10 text-white/60 hover:text-red-400' : 'hover:bg-slate-100 text-slate-400 hover:text-red-600'
                      }`}
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex flex-col gap-3 pt-2">
                      <img 
                        src={car.images?.[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600'} 
                        alt={car.listingTitle} 
                        className="w-full h-40 object-cover rounded-xl shadow-md border dark:border-white/5"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full border ${
                            car.condition === 'Used' 
                              ? (isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-100')
                              : car.condition === 'Certified Pre-Owned'
                              ? (isDark ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-teal-50 text-teal-700 border-teal-100')
                              : (isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-100')
                          }`}>
                            {car.condition || 'New'}
                          </span>
                          
                          {/* Smart Badge: Best Price Deal */}
                          {bestPriceId === car.id && (
                            <span className="inline-flex items-center gap-1 bg-linear-to-r from-emerald-500 to-teal-500 text-white text-[9px] uppercase font-black px-2.5 py-0.5 rounded-full border border-emerald-400/20 shadow-md shadow-emerald-500/25">
                              🔥 Best Deal
                            </span>
                          )}
                        </div>
                        <h3 className="font-extrabold text-base md:text-lg mt-2 tracking-tight line-clamp-1 text-start">{car.listingTitle}</h3>
                        <p className="text-xl font-black text-teal-500 mt-1 text-start">${parseFloat(car.sellingPrice).toLocaleString()}</p>
                      </div>
                      <Link 
                        href={`/listing-details/${car.id}`}
                        className="w-full py-2 px-4 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-center transition border dark:border-white/5 border-slate-200"
                      >
                        View Full Details
                      </Link>
                    </div>
                  </th>
                ))}
                
                {/* Empty Slots */}
                {Array.from({ length: 3 - detailedCars.length }).map((_, i) => (
                  <th key={`empty-${i}`} className="p-4 md:p-6 border-l border-slate-200 dark:border-white/10 align-middle text-center w-75">
                    <div className="flex flex-col items-center justify-center py-10 px-4 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl bg-slate-50/20 dark:bg-[#121212]/30 gap-2 text-slate-400 dark:text-white/20">
                      <Scale className="w-8 h-8 opacity-40" />
                      <span className="text-xs font-semibold">Slot Empty</span>
                      <Link 
                        href="/search" 
                        className="mt-2 text-[10px] font-bold text-teal-500 hover:text-teal-400 border border-dashed border-teal-500/30 px-3 py-1.5 rounded-lg"
                      >
                        Add a Car
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Matrix rows grouped by sections */}
            <tbody>
              
              {/* SECTION: GENERAL SPECS */}
              <tr 
                onClick={() => toggleSection('general')}
                className="bg-slate-100/70 dark:bg-[#0c0c0c]/80 border-b border-slate-200 dark:border-white/10 cursor-pointer select-none hover:bg-slate-200/50 dark:hover:bg-white/5"
              >
                <td colSpan="4" className="p-3.5 md:p-4 text-xs font-extrabold uppercase tracking-wider text-teal-500 pl-4 md:pl-6 flex items-center justify-between">
                  <span>General Specifications</span>
                  {collapsed.general ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </td>
              </tr>
              
              {!collapsed.general && [
                {
                  label: 'Selling Price',
                  key: 'sellingPrice',
                  format: (val) => val ? `$${parseFloat(val).toLocaleString()}` : 'N/A',
                  comparison: {
                    better: 'min',
                    getValue: (car) => extractComparableNumber(car.sellingPrice),
                    bestLabel: 'Best Price',
                    worstLabel: 'Highest Price',
                  }
                },
                { label: 'Original Price', key: 'originalPrice', format: (val) => val ? `$${parseFloat(val).toLocaleString()}` : 'N/A' },
                { label: 'Make', key: 'make' },
                { label: 'Model', key: 'model' },
                {
                  label: 'Year',
                  key: 'year',
                  comparison: {
                    better: 'max',
                    getValue: (car) => extractComparableNumber(car.year),
                    bestLabel: 'Newest',
                    worstLabel: 'Oldest',
                  }
                },
                { label: 'Category', key: 'category' }
              ].map((spec, index) => {
                const isDifferent = checkIsDifferent(spec.key);
                const shouldHighlight = highlightDiff && isDifferent;
                const comparisonMeta = spec.comparison ? getComparisonMeta(spec.comparison) : null;
                return (
                  <tr key={index} className={`border-b border-slate-100 dark:border-white/5 transition-colors ${
                    shouldHighlight ? 'bg-amber-500/10 dark:bg-amber-500/5' : 'hover:bg-slate-50/20 dark:hover:bg-white/5'
                  }`}>
                    <td className="p-4 pl-6 text-xs font-bold text-slate-500 dark:text-white/60">
                      {renderSpecLabel(spec.label)}
                    </td>
                    {detailedCars.map((car) => {
                      const tone = getCellTone(comparisonMeta, car.id);
                      return (
                      <td key={car.id} className="p-4 border-l border-slate-200 dark:border-white/10 text-xs font-extrabold">
                        <div className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 transition-colors ${getToneClasses(tone)}`}>
                          <span>{spec.format ? spec.format(car[spec.key]) : (car[spec.key] || 'N/A')}</span>
                          {spec.comparison ? renderMetricBadge(tone, spec.comparison.bestLabel, spec.comparison.worstLabel) : null}
                        </div>
                      </td>
                    )})}
                    {Array.from({ length: 3 - detailedCars.length }).map((_, i) => (
                      <td key={`empty-gen-${i}`} className="p-4 border-l border-slate-200 dark:border-white/10 text-xs text-slate-300 dark:text-white/10 text-center">-</td>
                    ))}
                  </tr>
                );
              })}

              {/* SECTION: PERFORMANCE SPECS */}
              <tr 
                onClick={() => toggleSection('performance')}
                className="bg-slate-100/70 dark:bg-[#0c0c0c]/80 border-b border-slate-200 dark:border-white/10 cursor-pointer select-none hover:bg-slate-200/50 dark:hover:bg-white/5"
              >
                <td colSpan="4" className="p-3.5 md:p-4 text-xs font-extrabold uppercase tracking-wider text-teal-500 pl-4 md:pl-6 flex items-center justify-between">
                  <span>Engine & Performance</span>
                  {collapsed.performance ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </td>
              </tr>

              {!collapsed.performance && [
                { 
                  label: 'Mileage', 
                  key: 'mileage', 
                  format: (val) => `${parseFloat(val).toLocaleString()} miles`,
                  comparison: {
                    better: 'min',
                    getValue: (car) => extractComparableNumber(car.mileage),
                    bestLabel: 'Lowest Miles',
                    worstLabel: 'Highest Miles',
                  }
                },
                { label: 'Transmission', key: 'transmission' },
                { label: 'Fuel Type', key: 'fuelType' },
                {
                  label: 'Engine',
                  key: 'engine',
                  format: (val) => val || 'N/A',
                  comparison: {
                    better: 'max',
                    getValue: (car) => extractComparableNumber(car.engine),
                    bestLabel: 'Largest',
                    worstLabel: 'Smallest',
                  }
                },
                {
                  label: 'Cylinders',
                  key: 'cylinder',
                  format: (val) => val || 'N/A',
                  comparison: {
                    better: 'max',
                    getValue: (car) => extractComparableNumber(car.cylinder),
                    bestLabel: 'Most Cyl',
                    worstLabel: 'Fewest Cyl',
                  }
                },
                { label: 'Drive Type', key: 'driveType', format: (val) => val || 'N/A' }
              ].map((spec, index) => {
                const isDifferent = checkIsDifferent(spec.key);
                const shouldHighlight = highlightDiff && isDifferent;
                const comparisonMeta = spec.comparison ? getComparisonMeta(spec.comparison) : null;
                return (
                  <tr key={index} className={`border-b border-slate-100 dark:border-white/5 transition-colors ${
                    shouldHighlight ? 'bg-amber-500/10 dark:bg-amber-500/5' : 'hover:bg-slate-50/20 dark:hover:bg-white/5'
                  }`}>
                    <td className="p-4 pl-6 text-xs font-bold text-slate-500 dark:text-white/60">
                      {renderSpecLabel(spec.label)}
                    </td>
                    {detailedCars.map((car) => {
                      const tone = getCellTone(comparisonMeta, car.id);
                      return (
                      <td key={car.id} className="p-4 border-l border-slate-200 dark:border-white/10 text-xs font-extrabold">
                        <div className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 transition-colors ${getToneClasses(tone)}`}>
                          <span>{spec.format ? spec.format(car[spec.key]) : (car[spec.key] || 'N/A')}</span>
                          {spec.comparison ? renderMetricBadge(tone, spec.comparison.bestLabel, spec.comparison.worstLabel) : null}
                        </div>
                      </td>
                    )})}
                    {Array.from({ length: 3 - detailedCars.length }).map((_, i) => (
                      <td key={`empty-perf-${i}`} className="p-4 border-l border-slate-200 dark:border-white/10 text-xs text-slate-300 dark:text-white/10 text-center">-</td>
                    ))}
                  </tr>
                );
              })}

              {/* SECTION: EXTERIOR & INTERIOR DETAILED */}
              <tr 
                onClick={() => toggleSection('interior')}
                className="bg-slate-100/70 dark:bg-[#0c0c0c]/80 border-b border-slate-200 dark:border-white/10 cursor-pointer select-none hover:bg-slate-200/50 dark:hover:bg-white/5"
              >
                <td colSpan="4" className="p-3.5 md:p-4 text-xs font-extrabold uppercase tracking-wider text-teal-500 pl-4 md:pl-6 flex items-center justify-between">
                  <span>Exterior & Interior Specs</span>
                  {collapsed.interior ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </td>
              </tr>

              {!collapsed.interior && [
                { label: 'Color', key: 'color' },
                { label: 'Doors', key: 'door', format: (val) => val || 'N/A' },
                { label: 'VIN', key: 'vin', format: (val) => val || 'N/A' }
              ].map((spec, index) => {
                const isDifferent = checkIsDifferent(spec.key);
                const shouldHighlight = highlightDiff && isDifferent;
                return (
                  <tr key={index} className={`border-b border-slate-100 dark:border-white/5 transition-colors ${
                    shouldHighlight ? 'bg-amber-500/10 dark:bg-amber-500/5' : 'hover:bg-slate-50/20 dark:hover:bg-white/5'
                  }`}>
                    <td className="p-4 pl-6 text-xs font-bold text-slate-500 dark:text-white/60">
                      {renderSpecLabel(spec.label)}
                    </td>
                    {detailedCars.map((car) => (
                      <td key={car.id} className="p-4 border-l border-slate-200 dark:border-white/10 text-xs font-extrabold">
                        {spec.format ? spec.format(car[spec.key]) : (car[spec.key] || 'N/A')}
                      </td>
                    ))}
                    {Array.from({ length: 3 - detailedCars.length }).map((_, i) => (
                      <td key={`empty-int-${i}`} className="p-4 border-l border-slate-200 dark:border-white/10 text-xs text-slate-300 dark:text-white/10 text-center">-</td>
                    ))}
                  </tr>
                );
              })}

              {/* SECTION: FINANCING ESTIMATOR */}
              <tr 
                onClick={() => toggleSection('financing')}
                className="bg-slate-100/70 dark:bg-[#0c0c0c]/80 border-b border-slate-200 dark:border-white/10 cursor-pointer select-none hover:bg-slate-200/50 dark:hover:bg-white/5"
              >
                <td colSpan="4" className="p-3.5 md:p-4 text-xs font-extrabold uppercase tracking-wider text-teal-500 pl-4 md:pl-6 flex items-center justify-between">
                  <span>Financing Estimator & Monthly EMI</span>
                  {collapsed.financing ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </td>
              </tr>

              {!collapsed.financing && (
                <>
                  {/* Financing Inputs Control Row */}
                  <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/10 dark:bg-[#0c0c0c]/25">
                    <td className="p-4 pl-6 text-xs font-bold text-slate-500 dark:text-white/60">
                      Loan Configurations
                    </td>
                    <td colSpan="3" className="p-4 border-l border-slate-200 dark:border-white/10">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-bold">
                        {/* Down Payment */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-slate-400">Down Payment ($)</label>
                          <input 
                            type="number" 
                            value={downPayment} 
                            onChange={(e) => setDownPayment(Math.max(0, parseInt(e.target.value) || 0))}
                            className={`p-2.5 border rounded-xl outline-hidden focus:border-teal-500 w-full max-w-40 ${
                              isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                            }`}
                          />
                        </div>

                        {/* Interest Rate */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-slate-400">Interest Rate (% APR)</label>
                          <input 
                            type="number" 
                            step="0.1"
                            value={interestRate} 
                            onChange={(e) => setInterestRate(Math.max(0, parseFloat(e.target.value) || 0))}
                            className={`p-2.5 border rounded-xl outline-hidden focus:border-teal-500 w-full max-w-40 ${
                              isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                            }`}
                          />
                        </div>

                        {/* Loan Term */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-slate-400">Loan Term</label>
                          <select 
                            value={loanTerm} 
                            onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                            className={`p-2.5 border rounded-xl outline-hidden focus:border-teal-500 w-full max-w-40 ${
                              isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                            }`}
                          >
                            <option value="24">24 Months (2 years)</option>
                            <option value="36">36 Months (3 years)</option>
                            <option value="48">48 Months (4 years)</option>
                            <option value="60">60 Months (5 years)</option>
                            <option value="72">72 Months (6 years)</option>
                          </select>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Calculated Est Monthly Payment */}
                  <tr className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/20 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 pl-6 text-xs font-bold text-slate-500 dark:text-white/60">
                      Est. Monthly Payment
                    </td>
                    {detailedCars.map((car) => {
                      const emi = calculateEMI(car.sellingPrice);
                      const tone = getCellTone(emiComparisonMeta, car.id);
                      return (
                        <td key={car.id} className="p-4 border-l border-slate-200 dark:border-white/10 text-sm font-black">
                          <div className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 ${getToneClasses(tone)}`}>
                            <span>${emi.toLocaleString()} / mo</span>
                            {renderMetricBadge(tone, 'Best EMI', 'Highest EMI')}
                          </div>
                        </td>
                      );
                    })}
                    {Array.from({ length: 3 - detailedCars.length }).map((_, i) => (
                      <td key={`empty-emi-${i}`} className="p-4 border-l border-slate-200 dark:border-white/10 text-center text-slate-300 dark:text-white/10">-</td>
                    ))}
                  </tr>
                </>
              )}

              {/* SECTION: FEATURES COMPARISON */}
              <tr 
                onClick={() => toggleSection('features')}
                className="bg-slate-100/70 dark:bg-[#0c0c0c]/80 border-b border-slate-200 dark:border-white/10 cursor-pointer select-none hover:bg-slate-200/50 dark:hover:bg-white/5"
              >
                <td colSpan="4" className="p-3.5 md:p-4 text-xs font-extrabold uppercase tracking-wider text-teal-500 pl-4 md:pl-6 flex items-center justify-between">
                  <span>Additional Features Checklist</span>
                  {collapsed.features ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </td>
              </tr>

              {!collapsed.features && (
                <>
                  {/* Search Input Row */}
                  <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/10 dark:bg-[#080808]/15">
                    <td className="p-4 pl-6 text-xs font-bold text-slate-500 dark:text-white/60">
                      Filter Features
                    </td>
                    <td colSpan="3" className="p-3 border-l border-slate-200 dark:border-white/10">
                      <input 
                        type="text" 
                        placeholder="Search features (e.g. leather, camera, air...)" 
                        value={featureSearch}
                        onChange={(e) => setFeatureSearch(e.target.value)}
                        className={`p-2.5 text-xs border rounded-xl outline-hidden focus:border-teal-500 w-full max-w-sm ${
                          isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                    </td>
                  </tr>

                  {/* Render filtered features */}
                  {filteredFeatures.length === 0 ? (
                    <tr className="border-b border-slate-100 dark:border-white/5">
                      <td className="p-4 pl-6 text-xs font-bold text-slate-350 dark:text-white/20">
                        No features match search
                      </td>
                      <td colSpan="3" className="p-4 border-l border-slate-200 dark:border-white/10 text-center text-xs font-bold text-slate-400 dark:text-white/25">
                        No matching features found
                      </td>
                    </tr>
                  ) : (
                    filteredFeatures.map((feature, index) => {
                      const isDifferent = checkIsDifferent(feature.name, true);
                      const shouldHighlight = highlightDiff && isDifferent;
                      return (
                        <tr key={index} className={`border-b border-slate-100 dark:border-white/5 transition-colors ${
                          shouldHighlight ? 'bg-amber-500/10 dark:bg-amber-500/5' : 'hover:bg-slate-50/20 dark:hover:bg-white/5'
                        }`}>
                          <td className="p-4 pl-6 text-xs font-bold text-slate-500 dark:text-white/60">
                            {feature.label}
                          </td>
                          {detailedCars.map((car) => {
                            const hasFeature = car.features?.[feature.name] === true;
                            return (
                              <td key={car.id} className="p-4 border-l border-slate-200 dark:border-white/10">
                                {hasFeature ? (
                                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-500">
                                    <Check className="w-4 h-4 stroke-3" />
                                    <span>Yes</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-350 dark:text-white/15">
                                    <X className="w-3.5 h-3.5" />
                                    <span>No</span>
                                  </span>
                                )}
                              </td>
                            );
                          })}
                          {Array.from({ length: 3 - detailedCars.length }).map((_, i) => (
                            <td key={`empty-feat-${i}`} className="p-4 border-l border-slate-200 dark:border-white/10 text-center text-slate-300 dark:text-white/10">-</td>
                          ))}
                        </tr>
                      );
                    })
                  )}
                </>
              )}

            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  const { isSignedIn, isLoaded } = useUser();
  const isDark = isLoaded && isSignedIn;

  return (
    <div className={isDark ? "dark bg-[#050505] min-h-screen text-white transition-all duration-500" : "bg-slate-50 min-h-screen text-slate-900 transition-all duration-500"}>
      <Header />
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[60vh] bg-slate-50 dark:bg-[#050505]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            <p className="text-sm text-slate-500 dark:text-white/60">Preparing comparison...</p>
          </div>
        </div>
      }>
        <CompareContent />
      </Suspense>
      <Footer />
    </div>
  );
}
