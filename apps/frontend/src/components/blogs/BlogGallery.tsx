"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface BlogGalleryProps {
  images: string[];
}

export function BlogGallery({ images }: BlogGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="mt-20 pt-12 border-t border-white/10">
        <h3 className="text-2xl font-semibold text-white mb-8">
          Gallery
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imgUrl, idx) => (
            <div 
              key={idx} 
              onClick={() => setSelectedImage(imgUrl)}
              className="relative aspect-square rounded-2xl overflow-hidden bg-[#111111] border border-white/5 group cursor-pointer transition-transform hover:scale-105 hover:opacity-90"
            >
              <Image
                src={imgUrl}
                alt={`Gallery image ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-primary transition-colors z-50 p-2"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          
          {/* Image Container */}
          <div className="relative w-full h-full max-w-5xl max-h-[90vh] p-4 flex items-center justify-center">
            <Image
              src={selectedImage}
              alt="Expanded view"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
