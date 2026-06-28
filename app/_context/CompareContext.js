"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { showInfoToast, showSuccessToast, showWarningToast } from '../_components/drive-toast';

const CompareContext = createContext();

export function CompareProvider({ children }) {
    const [compareCars, setCompareCars] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load initial state from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('drivenest_compare');
        if (stored) {
            try {
                setCompareCars(JSON.parse(stored));
            } catch (e) {
                console.error("Error loading comparison data:", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save changes to localStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('drivenest_compare', JSON.stringify(compareCars));
        }
    }, [compareCars, isLoaded]);

    const addToCompare = (car) => {
        if (!car || !car.id) return;
        
        // Check if already in comparison
        if (compareCars.some(item => item.id === car.id)) {
            showInfoToast('Already in compare', `${car.name || 'This car'} is already in your comparison list.`);
            return;
        }

        // Limit to 3 cars
        if (compareCars.length >= 3) {
            showWarningToast('Compare limit reached', 'You can compare up to 3 cars at a time. Remove one to add another.');
            return;
        }

        setCompareCars(prev => [...prev, car]);
    };

    const removeFromCompare = (carId) => {
        setCompareCars(prev => prev.filter(item => item.id !== carId));
    };

    const isInCompare = (carId) => {
        return compareCars.some(item => item.id === carId);
    };

    const clearCompare = () => {
        setCompareCars([]);
    };

    const setCompareList = (cars) => {
        if (Array.isArray(cars)) {
            setCompareCars(cars.slice(0, 3));
        }
    };

    return (
        <CompareContext.Provider value={{
            compareCars,
            addToCompare,
            removeFromCompare,
            isInCompare,
            clearCompare,
            setCompareList,
            isLoaded
        }}>
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const context = useContext(CompareContext);
    if (context === undefined) {
        throw new Error('useCompare must be used within a CompareProvider');
    }
    return context;
}
