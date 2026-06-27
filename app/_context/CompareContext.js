"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

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
            toast.info(`${car.name || 'This car'} is already in your comparison list.`);
            return;
        }

        // Limit to 3 cars
        if (compareCars.length >= 3) {
            toast.warning("You can compare a maximum of 3 cars. Remove a car to add another.");
            return;
        }

        setCompareCars(prev => [...prev, car]);
        toast.success(`${car.name || 'Car'} added to comparison!`);
    };

    const removeFromCompare = (carId) => {
        const targetCar = compareCars.find(item => item.id === carId);
        setCompareCars(prev => prev.filter(item => item.id !== carId));
        if (targetCar) {
            toast.success(`${targetCar.name || 'Car'} removed from comparison.`);
        }
    };

    const isInCompare = (carId) => {
        return compareCars.some(item => item.id === carId);
    };

    const clearCompare = () => {
        setCompareCars([]);
        toast.info("Comparison list cleared.");
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
