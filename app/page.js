"use client";

import Header from "./_components/Header";
import Hero from "./_components/Hero";
import Category from "./_components/Category";
import MostSearchedCar from "./_components/MostSearchedCar";
import InfoSection from "./_components/InfoSection";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-900">
      <Header />
      <Hero />
      <Category />
      <MostSearchedCar />
      <InfoSection />
      <Footer />
    </div>
  );
}
