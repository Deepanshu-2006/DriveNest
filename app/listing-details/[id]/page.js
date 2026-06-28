"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../_components/Header';
import Footer from '../../_components/Footer';
import { getCarListingById } from '@/app/actions/carListing';
import { getOrCreateSendbirdUser } from '@/app/actions/sendbird';
import { getSendbirdClient } from '@/lib/sendbird-client';
import { getSendbirdUserId } from '@/lib/utils';
import featuresData from '@/app/Shared/features.json';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Calendar, 
  Car, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Expand,
  ExternalLink, 
  Fuel, 
  Gauge, 
  HelpCircle, 
  Info, 
  Mail, 
  MessageSquare, 
  Palette, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  User, 
  Wrench,
  Hash,
  Calculator,
  GitCompare,
  X,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import fuelImg from "@/public/fuel.png";
import gearshiftImg from '@/public/gearshift.png';
import speedometerImg from '@/public/speedometer.png';
import CompareDrawer from '../../_components/CompareDrawer';
import { useCompare } from '../../_context/CompareContext';
import { showErrorToast, showInfoToast, showSuccessToast } from '../../_components/drive-toast';

function ListingDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();
  const isDark = isLoaded && isSignedIn;
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [message, setMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  // Calculator States
  const [calcPrice, setCalcPrice] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [tradeIn, setTradeIn] = useState(0);
  const [loanTerm, setLoanTerm] = useState(60);
  const [creditScore, setCreditScore] = useState('excellent');
  const [apr, setApr] = useState(4.5);
  const [taxRate, setTaxRate] = useState(7.0);
  const [flatFees, setFlatFees] = useState(500);

  useEffect(() => {
    if (listing) {
      const price = parseFloat(listing.sellingPrice) || 0;
      setCalcPrice(price);
      setDownPayment(Math.round(price * 0.1));
    }
  }, [listing]);

  const handleCreditScoreChange = (score) => {
    setCreditScore(score);
    if (score === 'excellent') setApr(4.5);
    else if (score === 'good') setApr(6.2);
    else if (score === 'fair') setApr(9.8);
    else if (score === 'poor') setApr(14.5);
  };

  useEffect(() => {
    if (id) {
      fetchListingDetails();
    }
  }, [id]);

  const fetchListingDetails = async () => {
    setLoading(true);
    try {
      const result = await getCarListingById(id);
      if (result) {
        setListing(result);
      }
    } catch (error) {
      console.error("Error loading listing details:", error);
      showErrorToast('Unable to load listing', 'Please refresh and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevImage = () => {
    if (!listing?.images || listing.images.length <= 1) return;
    setIsZoomed(false);
    setActiveImageIndex(prev => (prev === 0 ? listing.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!listing?.images || listing.images.length <= 1) return;
    setIsZoomed(false);
    setActiveImageIndex(prev => (prev === listing.images.length - 1 ? 0 : prev + 1));
  };

  const openLightbox = (index = activeImageIndex) => {
    setActiveImageIndex(index);
    setIsZoomed(false);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setIsZoomed(false);
  };

  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeLightbox();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrevImage();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNextImage();
      }
      if (event.key.toLowerCase() === 'z') {
        event.preventDefault();
        setIsZoomed((prev) => !prev);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, listing?.images?.length]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      showInfoToast('Sign in required', 'Please sign in to contact the seller.');
      router.push('/sign-in');
      return;
    }
    if (!message.trim()) {
      showErrorToast('Message is empty', 'Enter a quick note before sending it to the seller.');
      return;
    }

    const buyerEmail = user?.primaryEmailAddress?.emailAddress;
    const sellerEmail = listing?.user?.email;

    if (!buyerEmail || !sellerEmail) {
      showErrorToast('Missing account details', 'We could not identify the buyer or seller. Please try again.');
      return;
    }

    if (buyerEmail === sellerEmail) {
      showErrorToast('Seller match detected', 'You cannot start a chat on your own listing.');
      return;
    }

    const buyerId = getSendbirdUserId(buyerEmail);
    const sellerId = getSendbirdUserId(sellerEmail);

    setSendingMsg(true);
    try {
      // 1. Sync users in Sendbird (Server Actions)
      const buyerSync = await getOrCreateSendbirdUser(
        buyerId,
        user.fullName || user.username || "Anonymous",
        user.imageUrl || ""
      );
      const sellerSync = await getOrCreateSendbirdUser(
        sellerId,
        listing.user.name || "Seller",
        ""
      );

      if (!buyerSync.success || !sellerSync.success) {
        throw new Error(buyerSync.error || sellerSync.error || "Failed to register chat accounts.");
      }

      // 2. Connect to Sendbird client
      const sb = getSendbirdClient();
      if (!sb) throw new Error("Could not initialize Sendbird client.");
      
      // Connect user if not connected
      if (sb.currentUser?.userId !== buyerId) {
        await sb.connect(buyerId);
      }

      // 3. Create Group Channel
      const channelParams = {
        invitedUserIds: [buyerId, sellerId],
        name: `${listing.year} ${listing.make} ${listing.model} - Chat`,
        isDistinct: true,
      };
      
      const channel = await sb.groupChannel.createChannel(channelParams);

      // 4. Send Message
      const textMessageParams = {
        message: message.trim(),
      };
      
      await new Promise((resolve, reject) => {
        channel.sendUserMessage(textMessageParams)
          .onSucceeded((msg) => resolve(msg))
          .onFailed((err) => reject(err));
      });

      showSuccessToast(
        'Message sent to seller',
        'Your conversation is ready. Opening Inbox now.',
        {
          actions: [
            {
              label: 'Open Inbox',
              onClick: () => router.push(`/profile?tab=inbox&channelUrl=${encodeURIComponent(channel.url)}`),
            },
          ],
        }
      );
      setMessage('');
      
      // 5. Redirect to inbox with selected channel
      router.push(`/profile?tab=inbox&channelUrl=${encodeURIComponent(channel.url)}`);
    } catch (error) {
      console.error("Error sending message via Sendbird:", error);
      showErrorToast('Message failed', error.message || 'Please try sending your message again.');
    } finally {
      setSendingMsg(false);
    }
  };

  if (loading) {
    return (
      <div className={isDark ? "dark bg-[#050505] min-h-screen text-white transition-all duration-500" : "bg-slate-50 min-h-screen text-slate-900 transition-all duration-500"}>
        <Header />
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Gathering vehicle details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className={isDark ? "dark bg-[#050505] min-h-screen text-white transition-all duration-500" : "bg-slate-50 min-h-screen text-slate-900 transition-all duration-500"}>
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
          <div className={`p-5 rounded-2xl mb-6 ${isDark ? 'bg-rose-500/10 text-rose-500' : 'bg-rose-50 text-rose-600'}`}>
            <ShieldAlert className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Listing Not Found</h2>
          <p className={`mt-3 max-w-md text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
            The listing you are trying to view does not exist or has been deleted by the owner.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="mt-8 bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-3 rounded-full text-sm transition shadow-lg cursor-pointer"
          >
            Return to Homepage
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate discount percentage if originalPrice is provided
  const rawOriginal = listing.originalPrice ? parseFloat(listing.originalPrice) : 0;
  const rawSelling = listing.sellingPrice ? parseFloat(listing.sellingPrice) : 0;
  const discountPercent = (rawOriginal > rawSelling && rawOriginal > 0)
    ? Math.round(((rawOriginal - rawSelling) / rawOriginal) * 100)
    : 0;

  // Set default message content
  const defaultPlaceholder = `Hi! I am interested in your ${listing.year} ${listing.make} ${listing.model}. Is this vehicle still available?`;

  // Financing Calculator Calculations
  const taxAmount = calcPrice * (taxRate / 100);
  const totalLoanAmount = Math.max(0, calcPrice + taxAmount + flatFees - downPayment - tradeIn);
  
  const calculateMonthlyPayment = () => {
    if (totalLoanAmount <= 0) return 0;
    const monthlyRate = (apr / 100) / 12;
    if (monthlyRate === 0) {
      return totalLoanAmount / loanTerm;
    }
    const payment = totalLoanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
    return isNaN(payment) ? 0 : payment;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayments = monthlyPayment * loanTerm;
  const totalInterestPaid = Math.max(0, totalPayments - totalLoanAmount);
  const totalCost = totalLoanAmount + totalInterestPaid + downPayment + tradeIn;

  const totalLoanInterestSum = totalLoanAmount + totalInterestPaid;
  const principalPercent = totalLoanInterestSum > 0 ? (totalLoanAmount / totalLoanInterestSum) * 100 : 100;
  const interestPercent = totalLoanInterestSum > 0 ? 100 - principalPercent : 0;

  return (
    <div className={isDark ? "dark bg-[#050505] min-h-screen text-white transition-all duration-500" : "bg-slate-50 min-h-screen text-slate-900 transition-all duration-500"}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Bar */}
        <div className="mb-6 flex justify-between items-center">
          <button 
            onClick={() => router.back()}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold border rounded-full transition-all cursor-pointer ${
              isDark 
                ? 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white' 
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          {listing && (
            <button 
              onClick={() => {
                const mappedCar = {
                  id: listing.id,
                  name: listing.listingTitle,
                  price: listing.sellingPrice,
                  fuelType: listing.fuelType,
                  geartype: listing.transmission,
                  miles: listing.mileage,
                  image: listing.images?.[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600',
                  condition: listing.condition,
                  category: listing.category
                };
                if (isInCompare(listing.id)) {
                  removeFromCompare(listing.id);
                } else {
                  addToCompare(mappedCar);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold border rounded-full transition-all cursor-pointer ${
                isInCompare(listing.id)
                  ? 'bg-teal-600 border-teal-600 text-white hover:bg-teal-700'
                  : isDark
                    ? 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>{isInCompare(listing.id) ? 'Added to Compare' : 'Add to Compare'}</span>
            </button>
          )}
        </div>

        {/* Top Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2 items-center mb-2">
              <span className={`text-[10px] tracking-wider uppercase font-extrabold px-3 py-1 rounded-full border ${
                listing.condition === 'Used' 
                  ? (isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-100')
                  : listing.condition === 'Certified Pre-Owned'
                  ? (isDark ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-teal-50 text-teal-700 border-teal-100')
                  : (isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-100')
              }`}>
                {listing.condition || 'New'}
              </span>
              <span className={`text-[10px] tracking-wider uppercase font-extrabold px-3 py-1 rounded-full border ${
                isDark ? 'bg-white/5 border-white/10 text-white/60' : 'bg-slate-100 border-slate-200 text-slate-500'
              }`}>
                {listing.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{listing.listingTitle}</h1>
            {listing.tagline && (
              <p className={`text-md italic mt-1.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>{listing.tagline}</p>
            )}
          </div>
          <div className="text-start md:text-end">
            {discountPercent > 0 && (
              <div className="flex items-center md:justify-end gap-2 mb-1">
                <span className={`text-xs line-through font-semibold ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                  ${parseFloat(listing.originalPrice).toLocaleString()}
                </span>
                <span className="bg-linear-to-r from-amber-500 to-orange-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-white/10">
                  SAVE {discountPercent}%
                </span>
              </div>
            )}
            <h2 className="text-3xl md:text-4xl font-black text-teal-500 leading-none">
              ${parseFloat(listing.sellingPrice).toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Dynamic 2-Column Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Visuals & Text Details (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Image Gallery / Carousel Section */}
            <div className={`border rounded-3xl overflow-hidden shadow-xl p-4 transition-all duration-300 ${
              isDark ? 'border-white/10 bg-[#0f0f0f]/80 backdrop-blur-md' : 'border-slate-200 bg-white'
            }`}>
              <div className="relative w-full aspect-video rounded-2xl bg-black overflow-hidden flex items-center justify-center group">
                {listing.images && listing.images.length > 0 ? (
                  <>
                    <button
                      onClick={() => openLightbox(activeImageIndex)}
                      className="absolute inset-0 cursor-zoom-in"
                      aria-label="Open full-screen gallery"
                    >
                      <img 
                        src={listing.images[activeImageIndex]} 
                        alt={`Car Visual ${activeImageIndex + 1}`} 
                        className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </button>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/15 to-transparent px-5 py-5">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-300">Luxury Gallery</p>
                          <p className="mt-1 text-sm font-semibold text-white/78">Tap to inspect details in full-screen spotlight mode.</p>
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/35 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-white">
                          <Expand className="h-3.5 w-3.5 text-teal-300" />
                          {activeImageIndex + 1} / {listing.images.length}
                        </span>
                      </div>
                    </div>
                    {listing.images.length > 1 && (
                      <>
                        <button 
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-teal-600 text-white p-2.5 rounded-full transition cursor-pointer shadow border border-white/10 hover:scale-110 z-10"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-teal-600 text-white p-2.5 rounded-full transition cursor-pointer shadow border border-white/10 hover:scale-110 z-10"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8">
                    <Car className="w-16 h-16 text-teal-500 mb-2 animate-pulse" />
                    <p className="text-sm font-bold uppercase tracking-wider text-teal-400">No Image Uploaded</p>
                  </div>
                )}
              </div>

              {/* Thumbnails list */}
              {listing.images && listing.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pt-4 pb-2 scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-transparent">
                  {listing.images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-24 aspect-video rounded-xl overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${
                        activeImageIndex === idx ? 'border-teal-500 scale-102 shadow-md' : 'border-transparent hover:border-white/20'
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      {activeImageIndex === idx && (
                        <span className="absolute inset-x-2 bottom-2 rounded-full bg-black/60 px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-white">
                          Active
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description Section */}
            <div className={`p-6 md:p-8 border rounded-3xl shadow-xl transition-all duration-300 ${
              isDark ? 'border-white/10 bg-[#0f0f0f]/80 backdrop-blur-md text-white' : 'border-slate-200 bg-white text-slate-900'
            }`}>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-teal-500" />
                <span>Description</span>
              </h3>
              <p className={`text-sm leading-relaxed whitespace-pre-line ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                {listing.description}
              </p>
            </div>

            {/* Premium Features Visual Checklist */}
            <div className={`p-6 md:p-8 border rounded-3xl shadow-xl transition-all duration-300 ${
              isDark ? 'border-white/10 bg-[#0f0f0f]/80 backdrop-blur-md text-white' : 'border-slate-200 bg-white text-slate-900'
            }`}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-500" />
                <span>Vehicle Features & Equipment</span>
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {featuresData.features.map((feat, idx) => {
                  const hasFeature = !!listing.features?.[feat.name];
                  return (
                    <div 
                      key={idx} 
                      className={`flex gap-2.5 items-center p-3 rounded-2xl border transition-all duration-200 ${
                        hasFeature 
                          ? (isDark ? 'bg-teal-950/20 border-teal-500/20 text-teal-400' : 'bg-teal-50 border-teal-100 text-teal-800 font-semibold')
                          : (isDark ? 'bg-white/2 border-white/5 text-white/30 line-through' : 'bg-slate-50/50 border-slate-100 text-slate-400 line-through')
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${hasFeature ? 'text-teal-500 animate-pulse' : 'text-slate-400/40'}`} />
                      <span className="text-xs truncate">{feat.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financing Calculator Section */}
            <div className={`p-6 md:p-8 border rounded-3xl shadow-xl transition-all duration-300 ${
              isDark ? 'border-white/10 bg-[#0f0f0f]/80 backdrop-blur-md text-white' : 'border-slate-200 bg-white text-slate-900'
            }`}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-teal-500 animate-pulse" />
                <span>Financing Calculator</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs Column */}
                <div className="space-y-4">
                  <div>
                    <label className={`text-xs font-bold ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Vehicle Price ($)</label>
                    <input 
                      type="number" 
                      value={calcPrice || ""}
                      onChange={(e) => setCalcPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`w-full text-sm p-3 border rounded-xl outline-none mt-1 transition-all ${
                        isDark ? 'bg-black/40 border-white/10 text-white focus:border-teal-500' : 'bg-white border-slate-200 text-slate-900 focus:border-teal-600'
                      }`}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`text-xs font-bold ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Down Payment ($)</label>
                      <input 
                        type="number" 
                        value={downPayment || ""}
                        onChange={(e) => setDownPayment(Math.max(0, parseFloat(e.target.value) || 0))}
                        className={`w-full text-sm p-3 border rounded-xl outline-none mt-1 transition-all ${
                          isDark ? 'bg-black/40 border-white/10 text-white focus:border-teal-500' : 'bg-white border-slate-200 text-slate-900 focus:border-teal-600'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`text-xs font-bold ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Trade-In Value ($)</label>
                      <input 
                        type="number" 
                        value={tradeIn || ""}
                        onChange={(e) => setTradeIn(Math.max(0, parseFloat(e.target.value) || 0))}
                        className={`w-full text-sm p-3 border rounded-xl outline-none mt-1 transition-all ${
                          isDark ? 'bg-black/40 border-white/10 text-white focus:border-teal-500' : 'bg-white border-slate-200 text-slate-900 focus:border-teal-600'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`text-xs font-bold ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Loan Term (Months)</label>
                    <div className="grid grid-cols-5 gap-2 mt-1.5">
                      {[36, 48, 60, 72, 84].map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setLoanTerm(term)}
                          className={`py-2 text-xs font-extrabold rounded-lg border cursor-pointer transition-all ${
                            loanTerm === term 
                              ? 'bg-teal-600 text-white border-teal-600 shadow-md scale-102 font-extrabold' 
                              : (isDark ? 'bg-white/5 border-white/5 text-white/80 hover:bg-white/10' : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100')
                          }`}
                        >
                          {term}m
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className={`text-xs font-bold ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Credit Score (Estimate APR)</label>
                      <div className="grid grid-cols-4 gap-2 mt-1.5">
                        {['excellent', 'good', 'fair', 'poor'].map((score) => (
                          <button
                            key={score}
                            type="button"
                            onClick={() => handleCreditScoreChange(score)}
                            className={`py-2 text-[10px] uppercase font-bold rounded-lg border cursor-pointer transition-all ${
                              creditScore === score 
                                ? 'bg-teal-600 text-white border-teal-600 shadow-md scale-102 font-extrabold' 
                                : (isDark ? 'bg-white/5 border-white/5 text-white/80 hover:bg-white/10' : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100')
                            }`}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-xs">
                        <label className={`font-bold ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Interest Rate (APR %)</label>
                        <span className="font-extrabold text-teal-500">{apr}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="25" 
                        step="0.1"
                        value={apr}
                        onChange={(e) => setApr(parseFloat(e.target.value) || 0.1)}
                        className="w-full accent-teal-500 mt-2 h-1.5 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`text-xs font-bold ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Sales Tax (%)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={taxRate || ""}
                        onChange={(e) => setTaxRate(Math.max(0, parseFloat(e.target.value) || 0))}
                        className={`w-full text-sm p-3 border rounded-xl outline-none mt-1 transition-all ${
                          isDark ? 'bg-black/40 border-white/10 text-white focus:border-teal-500' : 'bg-white border-slate-200 text-slate-900 focus:border-teal-600'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`text-xs font-bold ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Fees ($)</label>
                      <input 
                        type="number" 
                        value={flatFees || ""}
                        onChange={(e) => setFlatFees(Math.max(0, parseFloat(e.target.value) || 0))}
                        className={`w-full text-sm p-3 border rounded-xl outline-none mt-1 transition-all ${
                          isDark ? 'bg-black/40 border-white/10 text-white focus:border-teal-500' : 'bg-white border-slate-200 text-slate-900 focus:border-teal-600'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Outputs Column */}
                <div className={`p-6 rounded-2xl flex flex-col justify-between border ${
                  isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-100'
                }`}>
                  <div className="text-center pb-4 mb-4 border-b border-dashed dark:border-white/5 border-slate-200">
                    <span className={`text-[10px] tracking-wider uppercase font-extrabold ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Estimated Monthly Payment</span>
                    <h2 className="text-4xl font-black text-emerald-500 mt-1">${Math.round(monthlyPayment).toLocaleString()}<span className="text-sm font-semibold text-slate-500">/mo</span></h2>
                    <span className={`text-[10px] ${isDark ? 'text-white/50' : 'text-slate-500'}`}>For {loanTerm} Months</span>
                  </div>

                  <div className="space-y-3 text-xs mb-6">
                    <div className="flex justify-between items-center">
                      <span className={isDark ? 'text-white/60' : 'text-slate-500'}>Total Loan Amount</span>
                      <span className="font-extrabold">${Math.round(totalLoanAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={isDark ? 'text-white/60' : 'text-slate-500'}>Sales Tax Amount</span>
                      <span className="font-extrabold">${Math.round(taxAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={isDark ? 'text-white/60' : 'text-slate-500'}>Total Interest Paid</span>
                      <span className="font-extrabold text-orange-400">${Math.round(totalInterestPaid).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-dashed dark:border-white/5 border-slate-200 font-bold">
                      <span className={isDark ? 'text-white/80' : 'text-slate-700'}>Total Cost of Loan</span>
                      <span className="font-extrabold text-teal-500 text-sm">${Math.round(totalCost).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Principal vs Interest Visual Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] uppercase font-extrabold tracking-wider">
                      <span className="text-teal-400">Principal: {Math.round(principalPercent)}%</span>
                      <span className="text-orange-400">Interest: {Math.round(interestPercent)}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden flex">
                      <div 
                        style={{ width: `${principalPercent}%` }} 
                        className="h-full bg-teal-500 transition-all duration-300"
                        title="Principal"
                      />
                      <div 
                        style={{ width: `${interestPercent}%` }} 
                        className="h-full bg-orange-400 transition-all duration-300"
                        title="Interest"
                      />
                    </div>
                    <p className={`text-[10px] text-center leading-relaxed ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                      Estimated principal & interest proportions over the loan life.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Sidebar (1/3 width) */}
          <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-24">
            
            {/* Key Specs Panel */}
            <div className={`p-6 border rounded-3xl shadow-xl transition-all duration-300 ${
              isDark ? 'border-white/10 bg-[#0f0f0f]/80 backdrop-blur-md' : 'border-slate-200 bg-white'
            }`}>
              <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-teal-500" />
                <span>Key Specifications</span>
              </h3>

              <div className="space-y-4">
                
                {/* Specific 3 Highlight Specs with PNG Icons matching CarItem */}
                <div className="grid grid-cols-3 gap-2 border-b border-dashed dark:border-white/5 border-slate-100 pb-4 mb-4">
                  <div className="flex flex-col items-center text-center">
                    <Image src={fuelImg} width={20} height={20} className={`mb-1 ${isDark ? 'invert' : ''}`} alt="Fuel" />
                    <span className={`text-[9px] uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Fuel</span>
                    <span className="text-xs font-extrabold">{listing.fuelType}</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Image src={gearshiftImg} width={20} height={20} className={`mb-1 ${isDark ? 'invert' : ''}`} alt="Gearbox" />
                    <span className={`text-[9px] uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Gearbox</span>
                    <span className="text-xs font-extrabold">{listing.transmission}</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Image src={speedometerImg} width={20} height={20} className={`mb-1 ${isDark ? 'invert' : ''}`} alt="Mileage" />
                    <span className={`text-[9px] uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Mileage</span>
                    <span className="text-xs font-extrabold">{parseFloat(listing.mileage).toLocaleString()} mi</span>
                  </div>
                </div>

                {/* Additional detailed key-value rows */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center py-2 border-b border-dashed dark:border-white/5 border-slate-100 text-xs">
                    <span className={`font-semibold flex items-center gap-1.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                      <Calendar className="w-3.5 h-3.5 text-teal-500" /> Year
                    </span>
                    <span className="font-extrabold">{listing.year}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-dashed dark:border-white/5 border-slate-100 text-xs">
                    <span className={`font-semibold flex items-center gap-1.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                      <Car className="w-3.5 h-3.5 text-teal-500" /> Make
                    </span>
                    <span className="font-extrabold">{listing.make}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-dashed dark:border-white/5 border-slate-100 text-xs">
                    <span className={`font-semibold flex items-center gap-1.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                      <Car className="w-3.5 h-3.5 text-teal-500" /> Model
                    </span>
                    <span className="font-extrabold">{listing.model}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-dashed dark:border-white/5 border-slate-100 text-xs">
                    <span className={`font-semibold flex items-center gap-1.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                      <Palette className="w-3.5 h-3.5 text-teal-500" /> Color
                    </span>
                    <span className="font-extrabold">{listing.color}</span>
                  </div>

                  {listing.engine && (
                    <div className="flex justify-between items-center py-2 border-b border-dashed dark:border-white/5 border-slate-100 text-xs">
                      <span className={`font-semibold flex items-center gap-1.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                        <Wrench className="w-3.5 h-3.5 text-teal-500" /> Engine Size
                      </span>
                      <span className="font-extrabold">{listing.engine}</span>
                    </div>
                  )}

                  {listing.cylinder && (
                    <div className="flex justify-between items-center py-2 border-b border-dashed dark:border-white/5 border-slate-100 text-xs">
                      <span className={`font-semibold flex items-center gap-1.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                        <Wrench className="w-3.5 h-3.5 text-teal-500" /> Cylinders
                      </span>
                      <span className="font-extrabold">{listing.cylinder}</span>
                    </div>
                  )}

                  {listing.door && (
                    <div className="flex justify-between items-center py-2 border-b border-dashed dark:border-white/5 border-slate-100 text-xs">
                      <span className={`font-semibold flex items-center gap-1.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                        <Car className="w-3.5 h-3.5 text-teal-500" /> Doors
                      </span>
                      <span className="font-extrabold">{listing.door}</span>
                    </div>
                  )}

                  {listing.driveType && (
                    <div className="flex justify-between items-center py-2 border-b border-dashed dark:border-white/5 border-slate-100 text-xs">
                      <span className={`font-semibold flex items-center gap-1.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                        <Wrench className="w-3.5 h-3.5 text-teal-500" /> Drive Type
                      </span>
                      <span className="font-extrabold">{listing.driveType}</span>
                    </div>
                  )}

                  {listing.vin && (
                    <div className="flex justify-between items-center py-2 border-b border-dashed dark:border-white/5 border-slate-100 text-xs">
                      <span className={`font-semibold flex items-center gap-1.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                        <Hash className="w-3.5 h-3.5 text-teal-500" /> VIN Number
                      </span>
                      <span className="font-extrabold uppercase tracking-wide">{listing.vin}</span>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Contact Owner Form Card */}
            <div className={`p-6 border rounded-3xl shadow-xl transition-all duration-300 ${
              isDark ? 'border-white/10 bg-[#0f0f0f]/80 backdrop-blur-md text-white' : 'border-slate-200 bg-white text-slate-900'
            }`}>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-500" />
                <span>Message Seller</span>
              </h3>
              
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  {/* Suggested Quick-Reply Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {[
                      "Is price negotiable?",
                      "Test drive available?",
                      "Has a clean title?",
                      "Any past accidents?"
                    ].map((chip) => {
                      const mapText = {
                        "Is price negotiable?": "Hi! Is the price for this vehicle negotiable?",
                        "Test drive available?": "Hi! Is a test drive available for this vehicle?",
                        "Has a clean title?": "Hi! Can you confirm if this vehicle has a clean title?",
                        "Any past accidents?": "Hi! Has this vehicle had any past accidents or damage history?"
                      };
                      return (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setMessage(mapText[chip])}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer select-none ${
                            isDark 
                              ? 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white hover:border-teal-500/30' 
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:border-teal-500/30'
                          }`}
                        >
                          {chip}
                        </button>
                      );
                    })}
                  </div>

                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={defaultPlaceholder}
                    rows={4}
                    className={`w-full text-xs p-3 border rounded-xl outline-none focus:border-teal-500 transition-all ${
                      isDark ? 'bg-black/50 border-white/10 text-white focus:bg-black/80' : 'bg-white border-slate-200 text-slate-900 focus:bg-slate-50'
                    }`}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={sendingMsg}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed hover:scale-101"
                >
                  {sendingMsg ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>

      {isLightboxOpen && listing?.images?.length > 0 && (
        <div
          className="fixed inset-0 z-130 bg-black/92 backdrop-blur-xl"
          onClick={closeLightbox}
        >
          <div className="flex h-full flex-col px-4 py-4 sm:px-6 sm:py-6" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-teal-300">Brochure View</p>
                <h3 className="mt-1 text-lg font-black text-white">{listing.listingTitle}</h3>
                <p className="mt-1 text-xs text-white/45">Arrow keys navigate. Press Z to zoom. Esc closes.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsZoomed((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-white/10"
                >
                  {isZoomed ? <ZoomOut className="h-4 w-4 text-teal-300" /> : <ZoomIn className="h-4 w-4 text-teal-300" />}
                  {isZoomed ? 'Zoom Out' : 'Zoom In'}
                </button>
                <button
                  onClick={closeLightbox}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white hover:bg-white/10"
                  aria-label="Close gallery"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[30px] border border-white/8 bg-white/3">
              <img
                src={listing.images[activeImageIndex]}
                alt={`Gallery preview ${activeImageIndex + 1}`}
                onClick={() => setIsZoomed((prev) => !prev)}
                className={`max-h-full max-w-full select-none object-contain transition-transform duration-300 ${isZoomed ? 'scale-[1.85] cursor-zoom-out' : 'scale-100 cursor-zoom-in'}`}
              />

              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-black/45 p-3 text-white transition hover:bg-teal-600"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-black/45 p-3 text-white transition hover:bg-teal-600"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-white">
                Frame {activeImageIndex + 1} of {listing.images.length}
              </div>
            </div>

            {listing.images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveImageIndex(idx);
                      setIsZoomed(false);
                    }}
                    className={`relative h-20 w-32 shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                      activeImageIndex === idx
                        ? 'border-teal-400 shadow-[0_16px_40px_rgba(20,184,166,0.2)]'
                        : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <CompareDrawer />
      <Footer />
    </div>
  );
}

export default ListingDetails;
