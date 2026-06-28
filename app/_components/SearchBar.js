"use client";
import React, { useState } from 'react';
import Data from '../Shared/Data';
import carDetails from '../Shared/carDetails.json';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/Select';
function SearchBar() {
    const [condition, setCondition] = useState('');
    const [make, setMake] = useState('');
    const [price, setPrice] = useState('');
    const router = useRouter();
    const { isSignedIn } = useUser();
    const isDark = isSignedIn;

    const makeOptions = carDetails.carDetails.find(item => item.name === 'make')?.options || [];

    const handleSearch = () => {
        const params = [];
        if (condition) params.push(`condition=${condition}`);
        if (make) params.push(`make=${make}`);
        if (price) {
            // Strip '$' symbol
            const numericPrice = price.replace('$', '');
            params.push(`price=${numericPrice}`);
        }
        const queryString = params.length > 0 ? `?${params.join('&')}` : '';
        router.push(`/search${queryString}`);
    };

    const containerClasses = isDark
        ? 'bg-[#0f0f0f]/95 text-white border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md'
        : 'bg-white text-slate-900 border-gray-100/50 shadow-md';

    const separatorClasses = `hidden md:block w-px h-8 ${isDark ? 'bg-white/10' : 'bg-gray-300'
        }`;

    const selectTriggerClass = `w-48 border-none! dark:border-none! bg-transparent shadow-none text-sm font-semibold transition-all rounded-lg px-3 py-1.5 cursor-pointer outline-none focus:outline-none focus:ring-0 ${isDark
            ? 'text-white/80 hover:text-teal-400 data-[state=open]:text-teal-400'
            : 'text-gray-700 hover:text-teal-600 data-[state=open]:text-teal-600'
        }`;

    return (
        <div className='flex justify-center mt-10 '>
            <div className="w-full max-w-5xl">
            <div className={`flex justify-center rounded-md py-3 md:rounded-full flex-col md:flex md:flex-row gap-8 px-10 items-center border transition-all duration-300 ${containerClasses}`}>

                {/* Dropdown 1: Cars */}
                <div className="relative flex items-center">
                    <Select value={condition} onValueChange={(val) => setCondition(val)}>
                        <SelectTrigger className={selectTriggerClass}>
                            <SelectValue placeholder="Cars Condition" />
                        </SelectTrigger>
                        <SelectContent side="bottom">
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Used">Used</SelectItem>
                            <SelectItem value="Certified Pre-Owned">Certified Pre-Owned</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Vertical Separator Line 1 */}
                <div className={separatorClasses}></div>

                {/* Dropdown 2: Makes */}
                <div className="relative flex items-center">
                    <Select value={make} onValueChange={(val) => setMake(val)}>
                        <SelectTrigger className={selectTriggerClass}>
                            <SelectValue placeholder="Car Makes" />
                        </SelectTrigger>
                        <SelectContent side="bottom">
                            {makeOptions.map((makeName, index) => (
                                <SelectItem key={index} value={makeName}>
                                    {makeName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Vertical Separator Line 2 */}
                <div className={separatorClasses}></div>

                {/* Dropdown 3: Price */}
                <div className="relative flex items-center">
                    <Select value={price} onValueChange={(val) => setPrice(val)}>
                        <SelectTrigger className={selectTriggerClass}>
                            <SelectValue placeholder="Pricing Limit" />
                        </SelectTrigger>
                        <SelectContent side="bottom">
                            {Data.pricing.map((item, index) => (
                                <SelectItem key={item.id || index} value={item.amount}>
                                    {item.amount}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Search Button Icon */}
                <button
                    onClick={handleSearch}
                    className="flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white rounded-full p-3 transition-all duration-200 cursor-pointer shadow-md focus:outline-none hover:scale-105 active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
                    </svg>
                </button>

            </div>
            </div>
        </div>
    );
}

export default SearchBar;
