"use client";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import Category from "./_components/Category";
import MostSearchedCar from "./_components/MostSearchedCar";
import InfoSection from "./_components/InfoSection";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <Category />
      <MostSearchedCar />
      <InfoSection />
      <Footer />
      </div>
  );
}
