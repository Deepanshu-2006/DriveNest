import React from 'react'
import Data from '../Shared/Data'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/Select'

function SearchBar() {
    return (
        <div className='flex justify-center mt-10 '>
            <div className='flex justify-center bg-white rounded-md py-3 md:rounded-full flex-col md:flex md:flex-row gap-8 px-10 items-center text-black shadow-md'>

                {/* Dropdown 1: Cars */}
                <div className="relative flex items-center">
                    <Select>
                        <SelectTrigger className="w-40 border-none bg-transparent shadow-none text-md font-semibold">
                            <SelectValue placeholder="Cars" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Old">Old</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Vertical Separator Line 1 */}
                <div className="hidden md:block w-px h-8 bg-gray-300"></div>

                {/* Dropdown 2: Makes */}
                <div className="relative flex items-center">
                    <Select>
                        <SelectTrigger className="w-40 border-none bg-transparent shadow-none text-md font-semibold">
                            <SelectValue placeholder="Car Makes" />
                        </SelectTrigger>
                        <SelectContent>
                            {Data.CarMakes.map((item, index) => (
                                <SelectItem key={item.id || index} value={item.name}>
                                    {item.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Vertical Separator Line 2 */}
                <div className="hidden md:block w-px h-8 bg-gray-300"></div>

                {/* Dropdown 3: Price */}
                <div className="relative flex items-center">
                    <Select>
                        <SelectTrigger className="w-40 border-none bg-transparent shadow-none text-md font-semibold">
                            <SelectValue placeholder="Pricing" />
                        </SelectTrigger>
                        <SelectContent>
                            {Data.pricing.map((item, index) => (
                                <SelectItem key={item.id || index} value={item.amount}>
                                    {item.amount}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Search Button Icon */}
                <button className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 transition-all duration-200 cursor-pointer shadow-md focus:outline-none hover:scale-105 active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
                    </svg>
                </button>

            </div>
        </div>
    )
}

export default SearchBar
