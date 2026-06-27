"use client";

import { useState, useEffect } from "react";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import Category from "./_components/Category";
import BrandTicker from "./_components/BrandTicker";
import MostSearchedCar from "./_components/MostSearchedCar";
import ScrollTicker from "./_components/ScrollTicker";
import InfoSection from "./_components/InfoSection";
import Footer from "./_components/Footer";
import { useUser } from '@clerk/nextjs';

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const isDarkHome = isLoaded && isSignedIn;
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (selectedCategory) {
      const element = document.getElementById("featured-showroom");
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
      }
    }
  }, [selectedCategory]);

  return (
    <div className={isDarkHome ? "dark bg-[#050505] min-h-screen text-white transition-all duration-500" : "bg-slate-50 min-h-screen text-slate-900 transition-all duration-500"}>
      <Header />
      <Hero />
      <Category selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />
      <ScrollTicker />
      <BrandTicker />
      <MostSearchedCar selectedCategory={selectedCategory} />
      <InfoSection />
      <Footer />
    </div>
  );
}
