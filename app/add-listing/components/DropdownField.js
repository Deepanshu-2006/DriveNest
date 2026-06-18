import React from 'react'
import IconFiles from './IconField'

function DropdownField({ item, handleInputChange }) {
    return (
        <div>
            <label className='text-sm text-gray-500 font-bold flex gap-2 items-center'>
                {IconFiles[item?.icon] && <span className='text-teal-500 text-lg'>{IconFiles[item.icon]}</span>}
                <span>
                    {item?.label?.replace('*', '')}
                    {item?.required && <span className='text-red-600 text-md'>*</span>}
                </span>
            </label>
            <select
                name={item?.name}
                required={item?.required}
                onChange={(e) => handleInputChange(item.name, e.target.value)}
                defaultValue=""
                className='w-full border rounded-lg p-2.5 outline-none focus:border-teal-600 text-sm font-extrabold mt-1 bg-white border-gray-300'
            >
                <option value="" disabled>Select Option</option>
                {item?.options?.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
        </div>
    )
}

export default DropdownField
