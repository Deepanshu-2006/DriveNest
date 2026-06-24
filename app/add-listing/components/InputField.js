import React from 'react'
import IconFiles from './IconField'
import { useUser } from '@clerk/nextjs'

function InputField({ item, handleInputChange, value }) {
    const { isSignedIn } = useUser();
    const isDark = isSignedIn;

    return (
        <div>
            <label className={`text-sm font-bold flex gap-2 items-center ${isDark ? 'text-white/70' : 'text-gray-500'}`}>
                {IconFiles[item?.icon] && <span className='text-teal-500 text-lg'>{IconFiles[item.icon]}</span>}
                <span>
                    {item?.label?.replace('*', '')}
                    {item?.required && <span className='text-red-600 text-md'>*</span>}
                </span>
            </label>
            <input
                type={item?.type}
                name={item?.name}
                required={item?.required}
                value={value || ''}
                onChange={(e) => handleInputChange(item.name, e.target.value)}
                className={`w-full border rounded-lg p-2.5 outline-none focus:border-teal-500 text-sm font-extrabold mt-1 transition-colors duration-200 ${isDark ? 'bg-[#151515] border-white/10 text-white focus:bg-[#1c1c1c]' : 'bg-white border-gray-300 text-slate-900 focus:border-teal-600'}`}
            />
        </div>
    )
}

export default InputField