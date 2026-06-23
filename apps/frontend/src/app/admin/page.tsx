"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Image as ImageIcon, MessageSquare, TrendingUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/Skeleton";
import { RecentActivityChart } from "@/components/admin/RecentActivityChart";

interface DashboardStats {
  totalBlogs: number;
  pendingComments: number;
  totalViews: number;
  activeGallery: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalBlogs: 0,
    pendingComments: 0,
    totalViews: 0,
    activeGallery: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = (session as any)?.accessToken;
        if (!token) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}`}/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            setStats(result.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchStats();
    }
  }, [session]);

  const STATS_UI = [
    { title: "Total Blogs", value: stats.totalBlogs, icon: FileText, color: "text-blue-400", bg: "bg-blue-400/10" },
    { title: "Pending Comments", value: stats.pendingComments, icon: MessageSquare, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { title: "Active Gallery", value: stats.activeGallery, icon: ImageIcon, color: "text-green-400", bg: "bg-green-400/10" },
    { title: "Total Views", value: stats.totalViews >= 1000 ? `${(stats.totalViews / 1000).toFixed(1)}k` : stats.totalViews, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-2"
      >
        <p className="text-primary font-medium tracking-[0.2em] text-sm">OVERVIEW</p>
        <h1 className="text-4xl font-semibold tracking-tight">Welcome back, Admin</h1>
        <p className="text-text-muted font-light max-w-2xl">
          Here is what&apos;s happening with your blog platform today. Manage your content, interact with comments, and keep your gallery stunning.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS_UI.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * (i + 1), ease: [0.22, 1, 0.36, 1] }}
            className="group relative bg-[#111111] border border-white/5 rounded-2xl p-6 overflow-hidden cursor-default transition-all duration-500 hover:border-white/10 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5"
          >
            {/* Subtle glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} transition-transform duration-500 group-hover:scale-110`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  {isLoading ? (
                    <Skeleton className="h-9 w-16 mb-1 bg-white/5" />
                  ) : (
                    <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                  )}
                  <p className="text-sm font-medium text-text-muted mt-1 tracking-wide">{stat.title}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <RecentActivityChart />
      </motion.div>
      
    </div>
  );
}
