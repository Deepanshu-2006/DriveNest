import React from 'react'
import FakeData from '../Shared/FakeData'
import CarItem from './CarItem';

function MostSearchedCar() {
    console.log(FakeData.carList);
    return (
        <div className='px-10 md:px-20 mt-10 text-center'>
            <h2 className='text-4xl font-bold'>Most Searched Cars</h2>
            <p className='text-gray-500 text-xl mt-2'>Discover the most popular cars</p>

            {FakeData.carList.map((car, index)=>(
                <CarItem car={car} key={index} />
            ))}
        </div>
    )
}

export default MostSearchedCar