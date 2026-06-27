"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useSpring, useTransform } from 'framer-motion';

function AntigravityCanvas({ onScrollProgress }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const ctxRef = useRef(null);
  const canvasSizedRef = useRef(false);
  const rafRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);

  // useScroll to track progress relative to container height (400vh)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Tighter spring = more responsive, less perceived lag
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.0005
  });

  // Map progress (0.0 to 1.0) to frame index (0 to 180)
  const frameIndex = useTransform(smoothProgress, [0, 1], [0, 180]);

  // Preload all 181 images on mount
  useEffect(() => {
    const totalFrames = 181;
    const loadedImages = new Array(totalFrames);
    let completed = 0;
    let lastReportedCount = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(4, '0');
      img.src = `/sequence/${frameNum}.webp`;
      img.decoding = 'async'; // Let browser decode off main thread

      const handleDone = () => {
        completed++;
        // Only trigger a re-render every 10 frames to reduce setState thrashing
        if (completed - lastReportedCount >= 10 || completed === totalFrames) {
          lastReportedCount = completed;
          setLoadedCount(completed);
        }
        if (completed === totalFrames) {
          setLoading(false);
        }
      };

      img.onload = handleDone;
      img.onerror = () => {
        console.error(`Failed to load image ${frameNum}.webp`);
        handleDone();
      };

      loadedImages[i - 1] = img;
    }
    imagesRef.current = loadedImages;
  }, []);

  // Set up canvas ctx once after load, configure smoothing once
  useEffect(() => {
    if (loading) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Set smoothing quality once — no need to repeat on every draw
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctxRef.current = ctx;

    drawFrame(0);
  }, [loading]);

  // Helper to draw a specific frame using rAF to stay on GPU-friendly timing
  const drawFrame = (index) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      const img = imagesRef.current[index];
      if (!img || !img.complete) return;

      const imgWidth = img.naturalWidth || 1280;
      const imgHeight = img.naturalHeight || 720;

      // Size canvas only once (images are all the same dimensions)
      if (!canvasSizedRef.current) {
        canvas.width = imgWidth;
        canvas.height = imgHeight;
        canvasSizedRef.current = true;
      }

      ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
      currentFrameRef.current = index;
    });
  };

  // Trigger draw on frameIndex updates
  useEffect(() => {
    if (loading) return;

    const unsubscribe = frameIndex.on("change", (latest) => {
      const idx = Math.min(180, Math.max(0, Math.floor(latest)));
      if (idx !== currentFrameRef.current) {
        drawFrame(idx);
      }
    });

    return () => {
      unsubscribe();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
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

  const progressPercent = Math.round((loadedCount / 181) * 100);

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
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#050505]">
        <canvas 
          ref={canvasRef} 
          className="block w-full h-full object-contain" 
          style={{ imageRendering: '-webkit-optimize-contrast' }}
        />
      </div>
    </div>
  );
}

export default AntigravityCanvas;
