"use client";

import { useState } from "react";
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
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className={isDarkHome ? "dark bg-[#050505] min-h-screen text-white transition-all duration-500" : "bg-slate-50 min-h-screen text-slate-900 transition-all duration-500"}>
      <Header />
      <Hero />
      <Category selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />
      <MostSearchedCar selectedCategory={selectedCategory} />
      <InfoSection />
      <Footer />
    </div>
  );
}
