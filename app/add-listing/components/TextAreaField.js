import React from 'react'
import IconFiles from './IconField'

function TextAreaField({ item, handleInputChange }) {
    return (
        <div className='col-span-1 md:col-span-2'>
            <label className='text-sm text-gray-500 font-bold flex gap-2 items-center'>
                {IconFiles[item?.icon] && <span className='text-teal-500 text-lg'>{IconFiles[item.icon]}</span>}
                <span>
                    {item?.label?.replace('*', '')}
                    {item?.required && <span className='text-red-500'>*</span>}
                </span>
            </label>
            <textarea
                name={item?.name}
                required={item?.required}
                onChange={(e) => handleInputChange(item.name, e.target.value)}
                rows={4}
                className='w-full border rounded-lg p-2.5 outline-none focus:border-teal-600 text-sm mt-1 bg-white border-gray-300 resize-none'
            />
        </div>
    )
}

export default TextAreaField
