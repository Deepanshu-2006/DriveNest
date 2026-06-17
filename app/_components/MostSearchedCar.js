import React from 'react'
import FakeData from '../Shared/FakeData'
import CarItem from './CarItem';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"


function MostSearchedCar() {
    console.log(FakeData.carList);
    return (
        <div className='px-10 md:px-20 mt-10 text-center'>
            <h2 className='text-4xl font-bold'>Most Searched Cars</h2>
            <p className='text-gray-500 text-xl mt-2 mb-10'>Discover the most popular cars</p>
            <Carousel className="cursor-pointer" opts={{ align: 'start' }}>
                <CarouselContent>
                    {FakeData.carList.map((car, index) => (
                        <CarouselItem key={index} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                            <CarItem car={car} />
                        </CarouselItem>
                    ))}

                </CarouselContent>
                <CarouselPrevious className="cursor-pointer" />
                <CarouselNext className="cursor-pointer" />
            </Carousel>
        </div>
    )
}

export default MostSearchedCar