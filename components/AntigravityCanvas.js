"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useSpring, useTransform } from 'framer-motion';

function AntigravityCanvas({ onScrollProgress }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(0);
  
  const [loading, setLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);

  // useScroll to track progress relative to container height (400vh)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth scroll progress to eliminate jitter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Map progress (0.0 to 1.0) to frame index (0 to 119)
  const frameIndex = useTransform(smoothProgress, [0, 1], [0, 119]);

  // Preload all 120 images on mount
  useEffect(() => {
    const totalFrames = 120;
    const loadedImages = [];
    let completed = 0;

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.src = `/sequence/frame_${i}.webp`;
      
      img.onload = () => {
        completed++;
        setLoadedCount(completed);
        if (completed === totalFrames) {
          setLoading(false);
        }
      };

      img.onerror = () => {
        console.error(`Failed to load image frame_${i}.webp`);
        completed++;
        setLoadedCount(completed);
        if (completed === totalFrames) {
          setLoading(false);
        }
      };

      loadedImages.push(img);
    }
    imagesRef.current = loadedImages;
  }, []);

  // Helper to draw a specific frame
  const drawFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete) return;

    const rect = canvas.parentNode.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    ctx.resetTransform();
    ctx.scale(dpr, dpr);

    // Enable high-quality image smoothing for crisp upscaled rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Fill with exactly #050505 background to blend with void
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Contain logic (preserve aspect ratio)
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    if (!imgWidth || !imgHeight) return;

    const canvasWidth = rect.width;
    const canvasHeight = rect.height;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    currentFrameRef.current = index;
  };

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      drawFrame(currentFrameRef.current);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Trigger draw on frameIndex updates
  useEffect(() => {
    if (loading) return;

    // Draw the initial frame
    drawFrame(0);

    const unsubscribe = frameIndex.on("change", (latest) => {
      const idx = Math.min(119, Math.max(0, Math.floor(latest)));
      drawFrame(idx);
    });

    return () => unsubscribe();
  }, [loading, frameIndex]);

  // Expose smoothProgress to parent component for scroll-linked animations
  useEffect(() => {
    const unsubscribeProgress = smoothProgress.on("change", (latest) => {
      if (onScrollProgress) {
        onScrollProgress(latest);
      }
    });
    return () => unsubscribeProgress();
  }, [smoothProgress, onScrollProgress]);

  const progressPercent = Math.round((loadedCount / 120) * 100);

  return (
    <div ref={containerRef} className="relative w-full h-[400vh] bg-[#050505]">
      {/* Immersive high-end loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-1000">
          <div className="relative flex flex-col items-center max-w-xs w-full px-4">
            {/* Spinning Gradient Ring */}
            <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-white/5"></div>
              <div className="absolute inset-0 rounded-full border-2 border-t-teal-500 border-r-emerald-500 animate-spin"></div>
              <span className="text-white/80 font-mono text-xs tracking-widest">{progressPercent}%</span>
            </div>

            <div className="text-center mb-4">
              <h3 className="text-white/90 text-[10px] uppercase font-bold tracking-[0.3em] font-sans">
                Antigravity Systems
              </h3>
              <p className="text-white/40 text-[9px] uppercase tracking-[0.2em] font-mono mt-1 animate-pulse">
                Calibrating zero-g space...
              </p>
            </div>

            {/* Minimalist Progress Bar */}
            <div className="w-full bg-white/5 h-0.5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="bg-linear-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sticky Canvas Container */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} className="block max-w-full max-h-full" />
      </div>
    </div>
  );
}

export default AntigravityCanvas;
