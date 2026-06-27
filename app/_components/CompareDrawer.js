"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCompare } from '../_context/CompareContext';
import { X, GitCompare, Trash2, Minimize2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';

function CompareDrawer() {
    const { compareCars, removeFromCompare, clearCompare } = useCompare();
    const { isSignedIn } = useUser();
    const isDark = isSignedIn;

    const [isExpanded, setIsExpanded] = useState(false);
    const prevLength = useRef(0);
    const isAutoOpenedRef = useRef(false);
    const autoMinimizeTimeoutRef = useRef(null);

    const startAutoMinimizeTimer = () => {
        if (!isAutoOpenedRef.current) return;
        if (autoMinimizeTimeoutRef.current) {
            clearTimeout(autoMinimizeTimeoutRef.current);
        }
        autoMinimizeTimeoutRef.current = setTimeout(() => {
            setIsExpanded(false);
            isAutoOpenedRef.current = false;
        }, 4000);
    };

    const clearAutoMinimizeTimer = () => {
        if (autoMinimizeTimeoutRef.current) {
            clearTimeout(autoMinimizeTimeoutRef.current);
            autoMinimizeTimeoutRef.current = null;
        }
    };

    // Initial sync on mount
    useEffect(() => {
        prevLength.current = compareCars.length;
        return () => clearAutoMinimizeTimer();
    }, []);

    // Auto expand only when a new car is added to the list
    useEffect(() => {
        if (compareCars.length > prevLength.current) {
            isAutoOpenedRef.current = true;
            setIsExpanded(true);
            startAutoMinimizeTimer();
        }
        if (compareCars.length === 0) {
            setIsExpanded(false);
            isAutoOpenedRef.current = false;
            clearAutoMinimizeTimer();
        }
        prevLength.current = compareCars.length;
    }, [compareCars.length]);

    return (
        <AnimatePresence>
            {compareCars.length > 0 && !isExpanded && (
                <motion.button 
                    key="fab"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    onClick={() => {
                        isAutoOpenedRef.current = false;
                        setIsExpanded(true);
                        clearAutoMinimizeTimer();
                    }}
                    className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer border group ${
                        isDark 
                            ? 'border-white/10 bg-teal-600 text-white shadow-[0_10px_30px_rgba(20,184,166,0.3)]' 
                            : 'border-slate-200 bg-teal-600 text-white hover:bg-teal-700 shadow-xl'
                    }`}
                    title="Open Comparison List"
                >
                    <GitCompare className="h-6 w-6 animate-pulse group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border border-white dark:border-slate-950 shadow-xs animate-bounce">
                        {compareCars.length}
                    </span>
                </motion.button>
            )}

            {compareCars.length > 0 && isExpanded && (
                <motion.div 
                    key="drawer"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    onMouseEnter={clearAutoMinimizeTimer}
                    onMouseLeave={startAutoMinimizeTimer}
                    className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
                >
            <div className={`max-w-4xl mx-auto border shadow-2xl rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 ${
                isDark 
                    ? 'border-white/10 bg-black/90 text-white backdrop-blur-md' 
                    : 'border-slate-200 bg-white/95 text-slate-900 backdrop-blur-md'
            }`}>
                <div className="flex items-center gap-3 shrink-0">
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-teal-500/10 text-teal-400' : 'bg-teal-50 text-teal-600'}`}>
                        <GitCompare className="h-5 w-5 animate-pulse" />
                    </div>
                    <div>
                        <h4 className="font-extrabold text-sm md:text-base">Compare Vehicles</h4>
                        <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                            {compareCars.length} of 3 selected
                        </p>
                    </div>
                </div>

                {/* Selected Car List */}
                <div className="flex flex-wrap items-center justify-center gap-3 my-2 md:my-0 flex-1 md:justify-start md:px-6">
                    {compareCars.map((car) => (
                        <div 
                            key={car.id} 
                            className={`flex items-center gap-2 pl-2 pr-3 py-1 rounded-full text-xs font-semibold relative group border ${
                                isDark 
                                    ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                                    : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                            }`}
                        >
                            <img 
                                src={car.image} 
                                alt={car.name} 
                                className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="max-w-25 truncate md:max-w-37.5">{car.name}</span>
                            <button 
                                onClick={() => removeFromCompare(car.id)}
                                className={`rounded-full p-0.5 transition-colors cursor-pointer ${
                                    isDark ? 'text-white/60 hover:text-red-400' : 'text-slate-500 hover:text-red-600'
                                }`}
                                title="Remove"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
                    <button 
                        onClick={() => {
                            setIsExpanded(false);
                            isAutoOpenedRef.current = false;
                            clearAutoMinimizeTimer();
                        }}
                        className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                            isDark 
                                ? 'border-white/10 text-white/85 bg-white/5 hover:bg-white/10 hover:text-white' 
                                : 'border-slate-200 text-slate-600 bg-slate-55 hover:bg-slate-100 hover:text-slate-800'
                        }`}
                        title="Minimize panel to floating button"
                    >
                        <Minimize2 className="h-3.5 w-3.5 text-teal-500" />
                        <span>Minimize</span>
                    </button>

                    <button 
                        onClick={() => {
                            clearCompare();
                            isAutoOpenedRef.current = false;
                            clearAutoMinimizeTimer();
                        }}
                        className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                            isDark 
                                ? 'border-white/10 text-white/85 bg-white/5 hover:bg-white/10 hover:text-white' 
                                : 'border-slate-200 text-slate-600 bg-slate-55 hover:bg-slate-100 hover:text-slate-800'
                        }`}
                    >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        <span>Clear All</span>
                    </button>
                    
                    <Link 
                        href="/compare"
                        className="px-5 py-2 text-xs font-black bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-md hover:shadow-teal-600/20 hover:scale-105 transition-all text-center flex-1 md:flex-initial"
                    >
                        Compare Now
                    </Link>
                </div>
            </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default CompareDrawer;
