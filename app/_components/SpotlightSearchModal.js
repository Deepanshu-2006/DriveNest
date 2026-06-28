"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Command, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { getAllCarListings } from '@/app/actions/carListing';
import { useUser } from '@clerk/nextjs';
import carDetails from '../Shared/carDetails.json';

const categoryOptions = carDetails.carDetails.find((item) => item.name === 'category')?.options || [];

function normalizeListing(item) {
  return {
    ...item,
    image: item.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600',
    displayTitle: item.listingTitle,
    displaySubtitle: [item.year, item.make, item.model].filter(Boolean).join(' '),
  };
}

export default function SpotlightSearchModal() {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();
  const isDark = isLoaded && isSignedIn;

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [allListings, setAllListings] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const loadListings = async () => {
    if (allListings.length > 0 || isFetching) return;

    setIsFetching(true);
    try {
      const data = await getAllCarListings();
      setAllListings(data.map(normalizeListing));
    } catch (error) {
      console.error('Failed to load spotlight listings:', error);
    } finally {
      setIsFetching(false);
    }
  };

  const openSpotlight = () => {
    setIsOpen(true);
    loadListings();
  };

  const closeSpotlight = () => {
    setIsOpen(false);
    setActiveIndex(0);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';

      if (isShortcut) {
        event.preventDefault();
        if (isOpen) {
          closeSpotlight();
        } else {
          openSpotlight();
        }
        return;
      }

      if (!isOpen) return;

      if (event.key === 'Escape') {
        closeSpotlight();
      }
    };

    const handleOpenEvent = () => openSpotlight();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('drivenest:open-spotlight-search', handleOpenEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('drivenest:open-spotlight-search', handleOpenEvent);
    };
  }, [isOpen, allListings.length, isFetching]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    closeSpotlight();
  }, [pathname]);

  const filteredListings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return allListings.filter((car) => {
      const categoryMatch = activeCategory === 'All' || car.category === activeCategory;
      if (!categoryMatch) return false;

      if (!normalizedQuery) return true;

      const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);

      const haystack = [
        car.listingTitle,
        car.make,
        car.model,
        car.category,
        car.condition,
        car.year,
        car.color,
        car.transmission,
        car.fuelType,
        car.description
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return queryWords.every(word => haystack.includes(word));
    });
  }, [allListings, activeCategory, query]);

  const previewListings = filteredListings.slice(0, 6);
  const previewItem = previewListings[activeIndex] || previewListings[0] || null;

  useEffect(() => {
    if (!isOpen) return;
    setActiveIndex(0);
  }, [query, activeCategory, isOpen]);

  const handleNavigateToSearch = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (activeCategory !== 'All') params.set('category', activeCategory);
    router.push(`/search${params.toString() ? `?${params.toString()}` : ''}`);
    closeSpotlight();
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'ArrowDown' && previewListings.length > 0) {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % previewListings.length);
    }

    if (event.key === 'ArrowUp' && previewListings.length > 0) {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + previewListings.length) % previewListings.length);
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (previewListings[activeIndex]) {
        router.push(`/listing-details/${previewListings[activeIndex].id}`);
        closeSpotlight();
        return;
      }
      handleNavigateToSearch();
    }
  };

  return (
    <>
      <button
        onClick={openSpotlight}
        className={`hidden lg:flex items-center gap-3 rounded-full border px-3.5 py-2 text-left transition-all ${
          isDark
            ? 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/8'
            : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'
        }`}
        aria-label="Open spotlight search"
      >
        <Search className="h-4 w-4 text-teal-500 shrink-0" />
        <span className="text-xs font-semibold tracking-wide">Search...</span>
        <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-black ${
          isDark ? 'bg-white/10 text-white/55' : 'bg-slate-100 text-slate-400'
        }`}>
          <Command className="h-2.5 w-2.5" />
          <span>K</span>
        </span>
      </button>

      <button
        onClick={openSpotlight}
        className={`lg:hidden inline-flex items-center justify-center rounded-full border p-2.5 ${
          isDark
            ? 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
        }`}
        aria-label="Open spotlight search"
      >
        <Search className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-120 bg-black/70 backdrop-blur-md"
            onClick={closeSpotlight}
          >
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 22, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              className="mx-auto mt-8 w-[calc(100%-1.5rem)] max-w-5xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,18,24,0.94),rgba(8,10,14,0.98))] text-white shadow-[0_40px_140px_rgba(0,0,0,0.55)]">
                <div className="border-b border-white/8 px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3 rounded-[26px] border border-white/8 bg-white/4 px-4 py-3 shadow-inner shadow-black/10">
                    <Search className="h-5 w-5 text-teal-400" />
                    <input
                      autoFocus
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      onKeyDown={handleInputKeyDown}
                      placeholder="Search by make, model, year, or vibe..."
                      className="h-8 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/35"
                    />
                    <button
                      onClick={handleNavigateToSearch}
                      className="hidden sm:inline-flex items-center gap-2 rounded-full bg-teal-500/16 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-teal-200 hover:bg-teal-500/24"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Search
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-white/35">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      Quick Filters
                    </span>
                    {['All', ...categoryOptions].map((category) => {
                      const isActive = activeCategory === category;
                      return (
                        <button
                          key={category}
                          onClick={() => setActiveCategory(category)}
                          className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
                            isActive
                              ? 'bg-teal-500 text-white shadow-[0_10px_30px_rgba(20,184,166,0.25)]'
                              : 'bg-white/6 text-white/65 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {category}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="border-b border-white/8 lg:border-r lg:border-b-0">
                    <div className="flex items-center justify-between px-5 pt-4 text-[11px] font-black uppercase tracking-[0.2em] text-white/35 sm:px-6">
                      <span>{isFetching ? 'Loading Inventory' : `${filteredListings.length} Matches`}</span>
                      <button onClick={handleNavigateToSearch} className="text-teal-300 hover:text-teal-200">
                        View all results
                      </button>
                    </div>

                    <div className="max-h-[55vh] overflow-y-auto px-3 pb-4 pt-3 sm:px-4">
                      {isFetching ? (
                        <div className="space-y-3 p-2">
                          {[1, 2, 3].map((item) => (
                            <div key={item} className="h-24 animate-pulse rounded-3xl bg-white/6" />
                          ))}
                        </div>
                      ) : previewListings.length > 0 ? (
                        previewListings.map((car, index) => (
                          <Link
                            key={car.id}
                            href={`/listing-details/${car.id}`}
                            onMouseEnter={() => setActiveIndex(index)}
                            onClick={closeSpotlight}
                            className={`flex items-center gap-4 rounded-[26px] border px-3 py-3 transition-all ${
                              activeIndex === index
                                ? 'border-teal-400/30 bg-teal-500/12 shadow-[0_16px_40px_rgba(20,184,166,0.14)]'
                                : 'border-transparent bg-white/3 hover:border-white/8 hover:bg-white/6'
                            }`}
                          >
                            <img
                              src={car.image}
                              alt={car.displayTitle}
                              className="h-20 w-28 rounded-2xl object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-1 text-sm font-black text-white">{car.displayTitle}</p>
                              <p className="mt-1 line-clamp-1 text-xs text-white/50">{car.displaySubtitle}</p>
                              <div className="mt-3 flex items-center gap-2 text-[11px] font-bold">
                                <span className="rounded-full bg-white/7 px-2.5 py-1 text-white/75">{car.category}</span>
                                <span className="rounded-full bg-white/7 px-2.5 py-1 text-white/75">{car.condition}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black text-teal-300">${Number(car.sellingPrice).toLocaleString()}</p>
                              <ArrowUpRight className="ml-auto mt-3 h-4 w-4 text-white/35" />
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="flex min-h-60 flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/3 px-6 text-center">
                          <Search className="h-10 w-10 text-white/20" />
                          <p className="mt-4 text-lg font-black text-white">No matching inventory</p>
                          <p className="mt-2 max-w-sm text-sm text-white/45">
                            Try another make, remove a category filter, or jump to the full search page.
                          </p>
                          <button
                            onClick={handleNavigateToSearch}
                            className="mt-5 rounded-full bg-teal-500 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white"
                          >
                            Open Search Page
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="hidden lg:flex lg:flex-col">
                    {previewItem ? (
                      <div className="flex h-full flex-col p-6">
                        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/3">
                          <img
                            src={previewItem.image}
                            alt={previewItem.displayTitle}
                            className="h-72 w-full object-cover"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 via-black/15 to-transparent p-5">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-teal-300">{previewItem.category}</p>
                            <h3 className="mt-2 text-2xl font-black text-white">{previewItem.displayTitle}</h3>
                            <p className="mt-1 text-sm text-white/60">{previewItem.displaySubtitle}</p>
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <div className="rounded-3xl border border-white/8 bg-white/3 p-4">
                            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/30">Price</p>
                            <p className="mt-2 text-2xl font-black text-teal-300">${Number(previewItem.sellingPrice).toLocaleString()}</p>
                          </div>
                          <div className="rounded-3xl border border-white/8 bg-white/3 p-4">
                            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/30">Mileage</p>
                            <p className="mt-2 text-2xl font-black text-white">{Number(previewItem.mileage).toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="mt-4 rounded-3xl border border-white/8 bg-white/3 p-4 text-sm text-white/62">
                          <p className="font-bold text-white">Instant browse mode</p>
                          <p className="mt-2 leading-6">
                            Use arrow keys to move through suggestions and press Enter to open the highlighted car.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-white/40">
                        Start typing to preview matching vehicles here.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
