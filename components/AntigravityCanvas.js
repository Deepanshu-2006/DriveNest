"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useSpring } from 'framer-motion';

const TOTAL_FRAMES = 181;

function AntigravityCanvas({ onScrollProgress }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const frameIndexRef = useRef(0);
  const rafRef = useRef(null);

  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Track scroll progress across the 400vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Tighter spring for ultra-responsive yet smooth scrubbing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001
  });

  // 1. Preload 720p JPEG frames into memory
  useEffect(() => {
    let isMounted = true;
    const loadedImgs = new Array(TOTAL_FRAMES);
    let loadedCount = 0;

    const renderCurrentFrame = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const img = loadedImgs[frameIndexRef.current];
      if (!img || !img.complete) return;

      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);
      }

      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, w, h);

      // Standard object-contain letterbox
      const scale = Math.min(w / img.width, h / img.height);
      const destW = img.width * scale;
      const destH = img.height * scale;
      const destX = (w - destW) / 2;
      const destY = (h - destH) / 2;

      ctx.drawImage(img, destX, destY, destW, destH);
    };

    // Load Frame 1 first for instant display
    const firstImg = new Image();
    firstImg.src = `/sequence/0001.jpg`;
    firstImg.onload = () => {
      if (!isMounted) return;
      loadedImgs[0] = firstImg;
      loadedCount++;
      renderCurrentFrame();

      // Background load the remaining 180 frames
      for (let i = 2; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        const formattedIndex = String(i).padStart(4, '0');
        img.src = `/sequence/${formattedIndex}.jpg`;
        img.onload = () => {
          if (!isMounted) return;
          loadedImgs[i - 1] = img;
          loadedCount++;
          if (loadedCount === TOTAL_FRAMES) {
            setImagesLoaded(true);
          }
          // If this happens to be the currently requested frame, render it
          if (i - 1 === frameIndexRef.current) {
            renderCurrentFrame();
          }
        };
      }
    };

    imagesRef.current = loadedImgs;

    const handleResize = () => {
      renderCurrentFrame();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 2. Map scroll progress directly to frame drawing
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      if (onScrollProgress) onScrollProgress(latest);

      const targetFrame = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(latest * TOTAL_FRAMES))
      );

      if (targetFrame !== frameIndexRef.current) {
        frameIndexRef.current = targetFrame;
      }

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const canvas = canvasRef.current;
        const img = imagesRef.current[frameIndexRef.current];
        if (!canvas || !img || !img.complete) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const w = window.innerWidth;
        const h = window.innerHeight;

        if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
          canvas.width = w * dpr;
          canvas.height = h * dpr;
          ctx.scale(dpr, dpr);
        }

        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, w, h);

        const scale = Math.min(w / img.width, h / img.height);
        const destW = img.width * scale;
        const destH = img.height * scale;
        const destX = (w - destW) / 2;
        const destY = (h - destH) / 2;

        ctx.drawImage(img, destX, destY, destW, destH);
      });
    });

    return () => {
      unsubscribe();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [smoothProgress, onScrollProgress]);

  return (
    <div ref={containerRef} className="relative w-full h-[400vh] bg-[#050505]">
      {/* Sticky Canvas Container */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#050505]">
        <canvas
          ref={canvasRef}
          className="block w-full h-full"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}

export default AntigravityCanvas;
