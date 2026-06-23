"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface BlogImageUploaderProps {
  label: string;
  maxImages: number;
  currentImages: string[];
  onChange: (images: string[]) => void;
  helperText?: string;
}

export function BlogImageUploader({ label, maxImages, currentImages, onChange, helperText }: BlogImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    
    // Check limit
    if (currentImages.length + files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images here.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);
    
    const token = (session as any)?.accessToken;
    const newUrls: string[] = [];
    let hasError = false;

    for (const file of files) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 20MB`);
        hasError = true;
        continue;
      }

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}`}/blogs/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Failed to upload image");
        }

        const data = await response.json();
        if (data.url) {
          newUrls.push(data.url);
        }
      } catch (error: any) {
        console.error("Upload error:", error);
        toast.error(error.message || `Failed to upload ${file.name}`);
        hasError = true;
      }
    }

    if (newUrls.length > 0) {
      onChange([...currentImages, ...newUrls]);
      if (!hasError) toast.success("Image(s) uploaded successfully");
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (indexToRemove: number) => {
    onChange(currentImages.filter((_, index) => index !== indexToRemove));
  };

  const isFull = currentImages.length >= maxImages;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-white">{label}</label>
        <span className="text-xs text-text-muted">
          {currentImages.length} / {maxImages} images
        </span>
      </div>
      
      {helperText && <p className="text-xs text-text-muted -mt-2">{helperText}</p>}

      {/* Upload Zone */}
      {!isFull && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary/50 group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            multiple={maxImages > 1}
          />
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-text-muted animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6 text-text-muted group-hover:text-primary transition-colors" />
            )}
          </div>
          <p className="text-sm font-medium text-white mb-1">
            {isUploading ? "Uploading..." : "Click to upload"}
          </p>
          <p className="text-xs text-text-muted">
            SVG, PNG, JPG or WEBP (Max 20MB)
          </p>
        </div>
      )}

      {/* Image Previews */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {currentImages.map((url, index) => (
            <div key={`${url}-${index}`} className="relative aspect-video rounded-lg overflow-hidden bg-black/50 border border-white/10 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500/40 rounded-full transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {maxImages === 1 && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-[10px] font-medium text-white rounded backdrop-blur-md">
                  Cover
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
