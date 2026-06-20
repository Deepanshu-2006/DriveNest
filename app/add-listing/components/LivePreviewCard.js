import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import fuel from "@/public/fuel.png"
import gearshift from '@/public/gearshift.png'
import speedometer from '@/public/speedometer.png'
import { Separator } from '@/components/ui/separator'
import featuresData from '../../Shared/features.json'
import carDetails from '../../Shared/carDetails.json'
import { Eye, MapPin, Calendar, Car, Sparkles, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react'

function LivePreviewCard({ formData = {}, user = null }) {
  const cardRef = useRef(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Extract variables
  const images = formData.images || []
  const hasImages = images.length > 0

  // Reset carousel index when image count updates
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [images.length])

  // 3D Parallax Tilt Effect calculations
  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left - width / 2
    const mouseY = e.clientY - rect.top - height / 2
    
    // Rotate max 10 degrees
    const rX = -(mouseY / height) * 12
    const rY = (mouseX / width) * 12
    setRotate({ x: rX, y: rY })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotate({ x: 0, y: 0 })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  // Carousel controls
  const handlePrevImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
  }

  // Value states & indicators (whether the field was filled vs using placeholder)
  const hasTitle = !!formData.listingTitle
  const title = formData.listingTitle || 'Untamed Performance Sportscar'
  const tagline = formData.tagline || 'Experience luxury and power combined'
  
  const hasDescription = !!formData.description
  const description = formData.description || 'This vehicle is in pristine condition, fully inspected, and ready for its next owner. Detailed service history is available upon request...'

  const rawOriginalPrice = formData.originalPrice ? parseFloat(formData.originalPrice) : 0
  const rawSellingPrice = formData.sellingPrice ? parseFloat(formData.sellingPrice) : 0
  const originalPrice = rawOriginalPrice ? rawOriginalPrice.toLocaleString() : null
  const hasSellingPrice = !!formData.sellingPrice
  const sellingPrice = rawSellingPrice ? rawSellingPrice.toLocaleString() : '135,000'

  // Dynamic Discount Deal Calculator
  const discountPercentage = (rawOriginalPrice > rawSellingPrice && rawOriginalPrice > 0)
    ? Math.round(((rawOriginalPrice - rawSellingPrice) / rawOriginalPrice) * 100)
    : 0

  const hasFuelType = !!formData.fuelType
  const fuelType = formData.fuelType || 'Petrol'
  
  const hasTransmission = !!formData.transmission
  const transmission = formData.transmission || 'Automatic'
  
  const hasMileage = !!formData.mileage
  const mileage = formData.mileage ? `${parseFloat(formData.mileage).toLocaleString()} mi` : 'Delivery mi'
  
  const hasMake = !!formData.make
  const hasModel = !!formData.model
  const make = formData.make || 'Aston Martin'
  const model = formData.model || 'DB12'
  
  const hasYear = !!formData.year
  const year = formData.year || '2026'
  
  const hasCategory = !!formData.category
  const category = formData.category || 'Coupe'
  
  const condition = formData.condition || 'New'
  const vin = formData.vin || ''

  // Validate if all required fields in carDetails are filled in formData
  const requiredFields = carDetails.carDetails.filter(item => item.required)
  const isReadyToPost = requiredFields.every(field => {
    const val = formData[field.name]
    if (val === undefined || val === null) return false
    if (typeof val === 'string' && val.trim() === '') return false
    return true
  }) && !!(formData.images && formData.images.length > 0)

  // Condition Badge Light Translucent Styling
  const getConditionBadgeStyle = (cond) => {
    const c = cond.toLowerCase().trim()
    if (c === 'new') {
      return 'bg-emerald-50/95 text-emerald-700 border-emerald-200/60 shadow-sm'
    }
    if (c === 'certified pre-owned') {
      return 'bg-amber-50/95 text-amber-700 border-amber-200/60 shadow-sm'
    }
    return 'bg-slate-50/95 text-slate-700 border-slate-200/60 shadow-sm'
  }

  // Dynamic Color Swatch Mapping
  const colorMap = {
    red: 'bg-red-600 border-red-700 shadow-red-500/20',
    blue: 'bg-blue-600 border-blue-700 shadow-blue-500/20',
    green: 'bg-green-600 border-green-700 shadow-green-500/20',
    yellow: 'bg-yellow-400 border-yellow-500 shadow-yellow-400/20',
    black: 'bg-slate-900 border-slate-950 shadow-black/35',
    white: 'bg-white border-slate-300 shadow-slate-100',
    silver: 'bg-slate-300 border-slate-400 shadow-slate-300/20',
    grey: 'bg-slate-500 border-slate-600 shadow-slate-50/20',
    gray: 'bg-slate-500 border-slate-600 shadow-slate-50/20',
    orange: 'bg-orange-500 border-orange-600 shadow-orange-500/20',
    brown: 'bg-amber-800 border-amber-900 shadow-amber-800/20',
    gold: 'bg-yellow-500 border-yellow-600 shadow-yellow-500/20',
    purple: 'bg-purple-600 border-purple-700 shadow-purple-500/20'
  }
  const inputColor = (formData.color || '').trim().toLowerCase()
  const swatchClass = colorMap[inputColor] || 'bg-gradient-to-tr from-slate-200 to-slate-400 border-slate-300 shadow-slate-200/20'
  const displayColorName = formData.color || 'Color'

  // Filter selected features from checkboxes
  const selectedFeatures = featuresData.features.filter(f => formData[f.name] === true)

  return (
    <div className="relative group w-full" style={{ perspective: '1000px' }}>
      {/* Background ambient glow effect */}
      <div className="absolute -inset-1.5 bg-linear-to-r from-teal-500/30 to-emerald-500/30 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-700"></div>
      
      {/* Card container */}
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered 
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)` 
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
        className="relative flex flex-col w-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden cursor-default transform-gpu"
      >
        {/* Dynamic Discount Deal Badge (placed at top-left) */}
        {discountPercentage > 0 && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-linear-to-r from-amber-500 to-orange-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-lg border border-white/20 animate-pulse">
            <Sparkles className="w-3 h-3 text-yellow-200 fill-yellow-200" />
            <span>SAVE {discountPercentage}%</span>
          </div>
        )}

        {/* Dynamic Light Condition Badge (placed at top-right) */}
        <div className={`absolute top-4 right-4 z-20 text-[10px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-full backdrop-blur-sm transition-all duration-300 ${getConditionBadgeStyle(condition)}`}>
          {condition}
        </div>

        {/* Media / Image Display Area */}
        <div className="relative w-full h-56 bg-slate-950 overflow-hidden flex items-center justify-center group/carousel">
          {hasImages ? (
            <>
              <img 
                src={images[currentImageIndex]} 
                className="w-full h-full object-cover transition-all duration-300" 
                alt={`Car Preview ${currentImageIndex + 1}`} 
              />
              
              {/* Carousel Left/Right navigation chevrons */}
              {images.length > 1 && (
                <>
                  <button 
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-teal-600 text-white p-1.5 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 cursor-pointer shadow border border-white/10 hover:scale-110 z-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-teal-600 text-white p-1.5 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 cursor-pointer shadow border border-white/10 hover:scale-110 z-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="absolute inset-0 bg-linear-to-tr from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-teal-500/10 flex items-center justify-center mb-3 border border-teal-500/20 shadow-inner animate-pulse">
                <Car className="w-7 h-7 text-teal-400" />
              </div>
              <p className="text-teal-400 font-extrabold text-xs uppercase tracking-widest">Awaiting Photo Upload</p>
              <p className="text-slate-400 text-[10px] mt-1 max-w-50 leading-relaxed">High-resolution vehicle photos will render here once selected</p>
            </div>
          )}
          
          {/* Dynamic VIN Verification Badge (placed at bottom-left of image) */}
          {vin && (
            <div className="absolute bottom-3 left-3 z-30 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded border border-white/10 select-none">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>VIN: {vin.substring(0, 7).toUpperCase()}...</span>
            </div>
          )}

          {/* Thumbnails indicator overlay */}
          {images.length > 0 && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded border border-white/10 select-none">
              IMAGE {currentImageIndex + 1} OF {images.length}
            </div>
          )}
        </div>

        {/* Card Content Details */}
        <div className="p-6">
          {/* Make / Model / Year / Category Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className={`flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider px-2 py-1 rounded-md border transition-all duration-300 ${hasYear ? 'bg-slate-100 text-slate-700 border-slate-200/50' : 'bg-slate-50/50 text-slate-400/70 border-dashed border-slate-200'}`}>
              <Calendar className="w-2.5 h-2.5 text-slate-500" />
              {year}
            </span>
            
            <span className={`flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider px-2 py-1 rounded-md border transition-all duration-300 ${hasCategory ? 'bg-slate-100 text-slate-700 border-slate-200/50' : 'bg-slate-50/50 text-slate-400/70 border-dashed border-slate-200'}`}>
              <Car className="w-2.5 h-2.5 text-slate-500" />
              {category}
            </span>

            {/* Dynamic Swatch tag */}
            <span className="flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-wider bg-slate-100/80 text-slate-700 px-2 py-1 rounded-md border border-slate-200/50 transition-all duration-300">
              <span className={`w-2.5 h-2.5 rounded-full border shadow-sm transition-all duration-300 ${swatchClass}`} />
              <span className={formData.color ? 'text-slate-700' : 'text-slate-400/70 font-normal italic'}>
                {displayColorName}
              </span>
            </span>
            
            <span className={`flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider px-2 py-1 rounded-md border transition-all duration-300 ${(hasMake || hasModel) ? 'bg-teal-50 text-teal-800 border-teal-100' : 'bg-slate-50/50 text-slate-400/70 border-dashed border-slate-200'}`}>
              {make} {model}
            </span>
          </div>

          {/* Listing Title */}
          <h2 className={`font-extrabold text-xl line-clamp-1 mb-1 transition-all duration-300 ${hasTitle ? 'text-slate-900' : 'text-slate-400/80 font-semibold italic'}`}>
            {title}
          </h2>

          {/* Tagline */}
          <p className="text-slate-500 text-xs font-semibold line-clamp-1 italic">
            {tagline}
          </p>

          {/* Description Snippet Preview */}
          <p className={`text-xs mt-2 line-clamp-2 leading-relaxed transition-all duration-300 ${hasDescription ? 'text-slate-600' : 'text-slate-400/70 italic'}`}>
            {description}
          </p>

          <Separator className="bg-slate-200/80 h-px my-4" />

          {/* Specs grid matching CarItem styling */}
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            {/* Fuel Box */}
            <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/50 transition-colors duration-200">
              <Image src={fuel} width={20} height={20} className="object-contain mb-1" alt="Fuel Type" />
              <h4 className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Fuel</h4>
              <h3 className={`text-xs font-extrabold mt-0.5 line-clamp-1 transition-all duration-300 ${hasFuelType ? 'text-slate-800' : 'text-slate-400/70 font-normal italic'}`}>
                {fuelType}
              </h3>
            </div>
            
            {/* Gearbox Box */}
            <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/50 transition-colors duration-200">
              <Image src={gearshift} width={20} height={20} className="object-contain mb-1" alt="Transmission" />
              <h4 className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Gearbox</h4>
              <h3 className={`text-xs font-extrabold mt-0.5 line-clamp-1 transition-all duration-300 ${hasTransmission ? 'text-slate-800' : 'text-slate-400/70 font-normal italic'}`}>
                {transmission}
              </h3>
            </div>
            
            {/* Mileage Box */}
            <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/50 transition-colors duration-200">
              <Image src={speedometer} width={20} height={20} className="object-contain mb-1" alt="Mileage" />
              <h4 className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Mileage</h4>
              <h3 className={`text-xs font-extrabold mt-0.5 line-clamp-1 transition-all duration-300 ${hasMileage ? 'text-slate-800' : 'text-slate-400/70 font-normal italic'}`}>
                {mileage}
              </h3>
            </div>
          </div>

          {/* Features List Container */}
          {selectedFeatures.length > 0 && (
            <>
              <Separator className="bg-slate-200/80 h-px my-4" />
              <div>
                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-500" /> Features Selected ({selectedFeatures.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedFeatures.slice(0, 3).map((f, i) => (
                    <span key={i} className="text-[10px] font-semibold bg-teal-50/80 text-teal-700 px-2.5 py-0.5 rounded-full border border-teal-100">
                      {f.label}
                    </span>
                  ))}
                  {selectedFeatures.length > 3 && (
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      +{selectedFeatures.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator className="bg-slate-200/80 h-px my-4" />

          {/* Footer containing Price info */}
          <div className="flex items-center justify-between mt-4 mb-5">
            <div className="flex flex-col">
              {originalPrice && (
                <span className="text-sm text-slate-400 line-through font-semibold leading-none">
                  ${originalPrice}
                </span>
              )}
              <h2 className={`font-extrabold text-2xl leading-none mt-1 transition-all duration-300 ${hasSellingPrice ? 'text-teal-600' : 'text-slate-400/80 font-bold italic text-md'}`}>
                ${sellingPrice}
              </h2>
            </div>
            {isReadyToPost ? (
              <div className="flex items-center gap-1 text-emerald-600 text-xs bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 font-bold shadow-sm shadow-emerald-500/5 transition-all duration-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Ready to post</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-rose-500 text-xs bg-rose-50 px-2 py-1 rounded-md border border-rose-100 font-bold transition-all duration-300 mt-3">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>Can't Post</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LivePreviewCard
