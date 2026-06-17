"use client";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import Category from "./_components/Category";
import MostSearchedCar from "./_components/MostSearchedCar";

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <Category />
      <MostSearchedCar />
      </div>
  );
}
