"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";

const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&q=80", alt: "โตเกียวยามค่ำคืน" },
  { src: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600&q=80", alt: "หอไอเฟลยามเช้าตรู่" },
  { src: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80", alt: "เรือหางยาว" },
  { src: "https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?w=600&q=80", alt: "ประตูชัยฝรั่งเศส" },
  { src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80", alt: "แม่น้ำแซน" },
  { src: "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=600&q=80", alt: "ชายหาดทรายขาว" },
  { src: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80", alt: "เรือนแพ" },
  { src: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&q=80", alt: "ชายหาดเขตร้อน" },
  { src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80", alt: "ศาลเจ้าญี่ปุ่น" },
  { src: "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?w=600&q=80", alt: "ยอดเขาหิมะ" },
];

export default function HelixGallery() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001
  });

  const RADIUS = 800;    
  const GAP_Y = 300;     
  const ANGLE = 36;      
  
  const startY = 0;
  const endY = -((GALLERY_IMAGES.length - 1) * GAP_Y);

  const startAngle = 0;
  const endAngle = (endY / GAP_Y) * ANGLE;

  const y = useTransform(smooth, [0, 1], [startY, endY]);
  const rotateY = useTransform(smooth, [0, 1], [startAngle, endAngle]);

  return (
    <section id="gallery" className="bg-black text-white py-10 relative z-10 scroll-mt-20">
      <div className="text-center mb-4 relative z-20">
        <h2 className="text-sm tracking-widest text-orange-500 uppercase font-semibold">Our Gallery</h2>
        <h3 className="text-4xl md:text-5xl font-bold mt-2">Captured Moments</h3>
      </div>

      {/* Mobile View: Simple Image Stack */}
      <div className="md:hidden flex flex-col gap-6 px-6 mt-8 pb-10">
        {GALLERY_IMAGES.map((img, i) => (
          <div key={`mobile-${i}`} className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-xl border border-white/10">
            <Image 
              alt={img.alt} 
              className="object-cover" 
              fill 
              src={img.src}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Desktop View: 3D Helix Animation */}
      <div ref={containerRef} className="hidden md:block relative h-[200vh]">
        <div
          className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
          style={{ perspective: "1500px" }}
        >
          <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              transform: "rotateX(-4deg)", 
              transformStyle: "preserve-3d",
            }}
          >
            <div 
              className="relative flex items-center justify-center"
              style={{ 
                transform: `translateZ(${-RADIUS}px)`, 
                transformStyle: "preserve-3d" 
              }}
            >
              <motion.div
                className="relative flex items-center justify-center"
                style={{
                  y,
                  rotateY,
                  transformStyle: "preserve-3d",
                }}
              >
                {GALLERY_IMAGES.map((img, i) => {
                  const itemRotateY = i * ANGLE;
                  const itemY = i * GAP_Y;

                  return (
                    <div
                      key={i}
                      className="absolute w-[350px] sm:w-[450px] h-[220px] sm:h-[300px] rounded-xl overflow-hidden shadow-2xl border border-white/10"
                      style={{
                        transform: `rotateY(${itemRotateY}deg) translateZ(${RADIUS}px) translateY(${itemY}px)`,
                        backfaceVisibility: "hidden", 
                      }}
                    >
                      <Image 
                        alt={img.alt} 
                        className="object-cover" 
                        fill 
                        src={img.src}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}