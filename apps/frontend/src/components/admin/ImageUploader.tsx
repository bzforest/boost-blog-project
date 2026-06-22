"use client";

import { useState, useRef } from "react";
import { UploadCloud, Loader2, Check } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  type: "hero" | "about" | "gallery";
  onUploadSuccess: () => void;
}

export function ImageUploader({ type, onUploadSuccess }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  const handleFileSelection = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("File size exceeds 20MB limit");
      return;
    }

    setPreviewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    setPreviewFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!previewFile) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", previewFile);

      const token = (session as any)?.accessToken;

      const response = await fetch(`http://localhost:4000/api/content/${type}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      toast.success("Image uploaded successfully!");
      handleCancel();
      onUploadSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      {!previewUrl ? (
        <div
          className={`relative w-full h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-white/10 bg-[#111111] hover:border-white/20 hover:bg-[#151515]"
          }`}
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelection(e.target.files[0]);
              }
            }}
          />
          
          <div className="flex flex-col items-center gap-3 text-text-muted pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-1">
              <UploadCloud className="w-6 h-6 text-white/50" />
            </div>
            <p className="font-medium tracking-wide">
              <span className="text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-white/30">SVG, PNG, JPG or WEBP (Max 20MB)</p>
          </div>
        </div>
      ) : (
        <div className="relative w-full border border-white/10 rounded-2xl bg-[#111111] overflow-hidden p-4">
          <div className="relative w-full h-48 bg-black/50 rounded-xl overflow-hidden mb-4 border border-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-80" />
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm font-medium text-white tracking-wide">Uploading...</p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="overflow-hidden w-full sm:w-auto">
              <p className="text-sm text-white font-medium truncate">{previewFile?.name}</p>
              <p className="text-xs text-text-muted mt-0.5">{(previewFile?.size! / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            
            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              <button
                onClick={handleCancel}
                disabled={isUploading}
                className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-text-muted hover:text-white bg-transparent hover:bg-white/5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-orange-600 shadow-[0_0_15px_rgba(255,107,0,0.2)] rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>Upload</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
