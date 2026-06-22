"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ImageGrid } from "@/components/admin/ImageGrid";

type TabType = "hero" | "about" | "gallery";

export default function SiteContentPage() {
  const [activeTab, setActiveTab] = useState<TabType>("hero");
  const [data, setData] = useState<any>({ hero: [], about: [], gallery: [] });
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = (session as any)?.accessToken;
      
      const response = await fetch("http://localhost:4000/api/content/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error("Failed to fetch data");
      
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session, fetchData]);

  const tabs: { id: TabType; label: string; desc: string }[] = [
    { id: "hero", label: "Hero Banner", desc: "Manage main landing images" },
    { id: "about", label: "About Section", desc: "Manage images in the about section" },
    { id: "gallery", label: "Gallery", desc: "Manage 3D Helix gallery images" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Toast Notification Provider */}
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#111111',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)'
          },
          success: { iconTheme: { primary: '#4ade80', secondary: '#111' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#111' } }
        }} 
      />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <p className="text-primary font-medium tracking-[0.2em] text-sm">CONTENT MANAGER</p>
        <h1 className="text-4xl font-semibold tracking-tight">Site Content</h1>
        <p className="text-text-muted font-light max-w-2xl">
          Upload and manage the images that appear on your premium travel blog.
        </p>
      </motion.div>

      {/* Tabs Navigation */}
      <div className="w-full max-w-full overflow-x-auto flex gap-2 border-b border-white/5 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap shrink-0 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
              activeTab === tab.id
                ? "bg-primary text-white shadow-[0_0_20px_rgba(255,107,0,0.2)]"
                : "text-text-muted hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        <div className="bg-[#111111] border border-white/5 p-6 md:p-8 rounded-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">{tabs.find(t => t.id === activeTab)?.label}</h2>
            <p className="text-sm text-text-muted">{tabs.find(t => t.id === activeTab)?.desc}</p>
          </div>
          
          <ImageUploader 
            type={activeTab} 
            onUploadSuccess={fetchData} 
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white tracking-wide">Uploaded Images</h3>
          <ImageGrid 
            type={activeTab} 
            images={data[activeTab] || []} 
            isLoading={isLoading} 
            onUpdate={fetchData} 
          />
        </div>
      </motion.div>
    </div>
  );
}
