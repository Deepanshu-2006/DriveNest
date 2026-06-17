import React from 'react'

function CarItem({ car }) {
    return (
        <div>
            <img src={car?.image} width={300} height={250} alt="" />
            <div className=''>
                <h2 className='font-bold text-lg text-black mb-2'>{car?.name}</h2>
            </div>
        </div>
    )
}

export default CarItem