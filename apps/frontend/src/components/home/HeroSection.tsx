"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface HeroSectionProps {
  images: string[];
}

export const HeroSection = ({ images }: HeroSectionProps) => {
  const [heroIndex, setHeroIndex] = useState(0);

  const nextSlide = useCallback(() => {
    if (images.length === 0) return;
    setHeroIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section
      id="hero"
      className="relative w-full h-[65vh] min-h-[450px] max-h-[600px] overflow-hidden"
    >
      {/* Background image carousel */}
      <AnimatePresence mode="sync">
        <motion.div
          key={heroIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {images.length > 0 ? (
            <Image
              src={images[heroIndex]}
              alt="Boost Blog hero landscape"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#111111]" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.p
          className="text-primary font-medium tracking-[0.25em] text-sm md:text-base mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          LET&rsquo;S DISCOVER MORE
        </motion.p>

        <motion.h1
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-semibold text-white leading-[1.1] tracking-tight max-w-4xl"
          style={{ textWrap: "balance" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          EXPLORE THE
          <br />
          <span className="text-primary">WORLD</span> WITH US
        </motion.h1>

        <motion.p
          className="mt-6 text-text-muted text-base md:text-lg max-w-lg leading-relaxed font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          เราเชื่อว่าการเดินทางคือครูที่ดีที่สุด ร่วมออกเดินทางไปกับเรา
          เพื่อค้นพบโลกกว้างและค้นพบตัวคุณเอง
        </motion.p>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setHeroIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
              i === heroIndex
                ? "w-10 bg-primary"
                : "w-4 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};
