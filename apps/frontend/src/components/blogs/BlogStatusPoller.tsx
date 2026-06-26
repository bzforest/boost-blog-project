"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function BlogStatusPoller({ slug }: { slug: string }) {
  const router = useRouter();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
        const res = await fetch(`${apiUrl}/blogs/${slug}`, {
          cache: "no-store",
        });
        
        // If 404 or not published, the API returns !res.ok
        if (!res.ok) {
          window.location.href = "/404";
          return;
        }
        
        const json = await res.json();
        const blog = json?.data;
        
        if (!blog || !blog.isPublished) {
          window.location.href = "/404";
        }
      } catch (error) {
        console.error("Failed to check blog status:", error);
      }
    };

    // 1. Check immediately on mount
    checkStatus();

    // 2. Check every 30 seconds
    const intervalId = setInterval(checkStatus, 30000);

    // 3. Check immediately when user switches back to this tab (handles browser throttling)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkStatus();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [slug]);

  return null;
}
