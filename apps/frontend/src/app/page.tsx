
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import HelixGallery from "@/components/home/HelixGallery";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { PopularSection } from "@/components/home/PopularSection";
import { LatestBlogsSection } from "@/components/home/LatestBlogsSection";
// Revalidate every 60 seconds (optional, but good for blogs)
export const revalidate = 60;

async function fetchHomeData() {
  const [contentRes, popularRes, latestRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/content`, { next: { revalidate: 60 } }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/blogs?sort=views_desc&limit=3`, { next: { revalidate: 60 } }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/blogs?limit=5`, { next: { revalidate: 60 } })
  ]);

  const [contentData, popularData, latestData] = await Promise.all([
    contentRes.ok ? contentRes.json() : null,
    popularRes.ok ? popularRes.json() : null,
    latestRes.ok ? latestRes.json() : null,
  ]);

  return {
    heroImages: contentData?.data?.hero || [],
    aboutImage: contentData?.data?.about || null,
    galleryImages: contentData?.data?.gallery || [],
    popularBlogs: popularData?.data || [],
    latestBlogs: latestData?.data || []
  };
}

export default async function HomePage() {
  const { heroImages, aboutImage, galleryImages, popularBlogs, latestBlogs } = await fetchHomeData();

  return (
    <>
      <Navbar />

      <main>
        {/* 1. HERO SECTION */}
        <HeroSection images={heroImages.map((img: any) => img.imageUrl)} />

        {/* 2. ABOUT SECTION */}
        <AboutSection imageUrl={aboutImage?.imageUrl} />

        {/* 3. POPULAR BLOGS SECTION */}
        <PopularSection blogs={popularBlogs as any[]} />

        {/* 4. PHOTOS GALLERY (3D Helix Style) */}
        <HelixGallery images={galleryImages.map((img: any) => ({ src: img.imageUrl, alt: img.altText || "Gallery Image" }))} />

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
