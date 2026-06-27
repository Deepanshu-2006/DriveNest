"use client";

import React, { useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform, wrap } from 'framer-motion';

const PHRASES = ["DriveNest", "Find Your Dream Car", "Premium Cars", "Trusted Sellers"];
const ITEMS = [...PHRASES, ...PHRASES, ...PHRASES];

function MarqueeRow({ speed = 40, paused = false, children }) {
    const baseX = useMotionValue(0);
    const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

    useAnimationFrame((_, delta) => {
        if (paused) return;
        baseX.set(baseX.get() + speed * (delta / 1000));
    });

    return (
        <div className="overflow-hidden whitespace-nowrap flex flex-nowrap">
            <motion.div
                className="flex flex-nowrap items-center gap-0"
                style={{ x }}
            >
                {children}
                {children}
            </motion.div>
        </div>
    );
}

function ScrollTicker() {
    const [paused, setPaused] = useState(false);

    const separator = (
        <span className="mx-6 md:mx-10 text-teal-500 dark:text-teal-400 select-none font-black text-2xl md:text-4xl">
            ✦
        </span>
    );

    const tickerContent = (
        <>
            {ITEMS.map((item, i) => (
                <React.Fragment key={i}>
                    <span className={`text-2xl md:text-xl font-black tracking-tighter uppercase select-none pr-4 ${item === "DriveNest"
                            ? "bg-linear-to-r from-teal-300 to-emerald-600 bg-clip-text text-transparent"
                            : "text-slate-900/10 dark:text-gray-400"
                        }`}>
                        {item}
                    </span>
                    {separator}
                </React.Fragment>
            ))}
        </>
    );

    return (
        <section
            className="py-5 overflow-hidden w-full mt-5 md:mt-15 mb-5 md:mb-15 border-y shadow-sm cursor-default border-slate-200/60 dark:border-white/10"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <MarqueeRow speed={1.5} paused={paused}>
                {tickerContent}
            </MarqueeRow>
        </section>
    );
}

export default ScrollTicker;
