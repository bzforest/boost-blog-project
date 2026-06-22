"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import HelixGallery from "@/components/home/HelixGallery";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { PopularSection } from "@/components/home/PopularSection";
import { LatestBlogsSection } from "@/components/home/LatestBlogsSection";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        {/* ═══════════════════════════════════════
            1. HERO SECTION
            ═══════════════════════════════════════ */}
        <HeroSection />

        {/* ═══════════════════════════════════════
            2. ABOUT SECTION
            ═══════════════════════════════════════ */}
        <AboutSection />

        {/* ═══════════════════════════════════════
            3. POPULAR BLOGS SECTION
            ═══════════════════════════════════════ */}
        <PopularSection />

        {/* ═══════════════════════════════════════
            4. PHOTOS GALLERY (3D Helix Style)
            ═══════════════════════════════════════ */}
        <HelixGallery />

        {/* ═══════════════════════════════════════
            5. LATEST BLOGS SECTION
            ═══════════════════════════════════════ */}
        <LatestBlogsSection />
      </main>

      {/* ═══════════════════════════════════════
          6. FOOTER / CONTACT
          ═══════════════════════════════════════ */}
      <Footer />
    </>
  );
}
