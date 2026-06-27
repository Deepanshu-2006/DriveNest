import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import ToastProvider from "./_components/ToastProvider";
import { CompareProvider } from "./_context/CompareContext";
import {
  ClerkProvider,
  UserButton,
} from "@clerk/nextjs";
import NextTopLoader from 'nextjs-toploader';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DriveNest | Find Your Dream Car",
  description: "Search, discover, and list new or preowned cars online with DriveNest.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} data-scroll-behavior="smooth">
      {/* Add overflow-x-hidden here */}
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <NextTopLoader color="#14b8a6" height={3} showSpinner={false} shadow="0 0 10px #14b8a6,0 0 5px #14b8a6" />
        <ClerkProvider>
          <CompareProvider>
            <main className="flex-1">
              {children}
            </main>
            <ToastProvider />
          </CompareProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

