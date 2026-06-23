
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import HelixGallery from "@/components/home/HelixGallery";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { PopularSection } from "@/components/home/PopularSection";
import { LatestBlogsSection } from "@/components/home/LatestBlogsSection";
import { prisma } from "@/lib/db";

// Revalidate every 60 seconds (optional, but good for blogs)
export const revalidate = 60;

export default async function HomePage() {
  const [heroImages, aboutImage, galleryImages, popularBlogs, latestBlogs] = await Promise.all([
    prisma.heroImage.findMany({ where: { isActive: true }, select: { imageUrl: true } }),
    prisma.aboutImage.findFirst({ where: { isActive: true }, select: { imageUrl: true } }),
    prisma.galleryImage.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' }, select: { imageUrl: true, altText: true } }),
    prisma.blog.findMany({ where: { isPublished: true }, orderBy: { views: 'desc' }, take: 3 }),
    prisma.blog.findMany({ where: { isPublished: true }, orderBy: { createdAt: 'desc' }, take: 5 })
  ]);

  return (
    <>
      <Navbar />

      <main>
        {/* 1. HERO SECTION */}
        <HeroSection images={heroImages.map(img => img.imageUrl)} />

        {/* 2. ABOUT SECTION */}
        <AboutSection imageUrl={aboutImage?.imageUrl} />

        {/* 3. POPULAR BLOGS SECTION */}
        <PopularSection blogs={popularBlogs as any[]} />

        {/* 4. PHOTOS GALLERY (3D Helix Style) */}
        <HelixGallery images={galleryImages.map(img => ({ src: img.imageUrl, alt: img.altText || "Gallery Image" }))} />

        {/* 5. LATEST BLOGS SECTION */}
        <LatestBlogsSection blogs={latestBlogs as any[]} />
      </main>

      {/* ═══════════════════════════════════════
          6. FOOTER / CONTACT
          ═══════════════════════════════════════ */}
      <Footer />
    </>
  );
}
