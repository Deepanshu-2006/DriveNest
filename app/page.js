"use client";

import Header from "./_components/Header";
import Hero from "./_components/Hero";
import Category from "./_components/Category";
import MostSearchedCar from "./_components/MostSearchedCar";
import InfoSection from "./_components/InfoSection";
import Footer from "./_components/Footer";
import { useUser } from '@clerk/nextjs';

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const isDarkHome = isLoaded && isSignedIn;

  return (
    <div className={`dark bg-[#050505] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] text-white transition-all duration-500 ${isDarkHome ? 'min-h-screen' : 'h-screen overflow-hidden flex flex-col'}`}>
      <Header />
      {isDarkHome ? (
        <>
          <Hero />
          <Category />
          <MostSearchedCar />
          <InfoSection />
          <Footer />
        </>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center overflow-hidden w-full relative">
          <Hero />
        </div>
      )}
    </div>
  );
}
