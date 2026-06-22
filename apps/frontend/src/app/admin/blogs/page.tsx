"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import Link from "next/link";
import { Plus, Search, Edit3, Trash2, Eye, Calendar, BarChart2 } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Skeleton } from "@/components/ui/Skeleton";
import { BlogSearchBar, BlogStatusFilter } from "@/components/admin/BlogSearchBar";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  views: number;
  isPublished: boolean;
  createdAt: string;
}

export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [appliedDate, setAppliedDate] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState<BlogStatusFilter>("all");
  const [appliedStatusFilter, setAppliedStatusFilter] = useState<BlogStatusFilter>("all");
  const { data: session } = useSession();
  
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    blogId: string | null;
  }>({ isOpen: false, blogId: null });

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = (session as any)?.accessToken;
      
      const queryParams = new URLSearchParams({
        limit: "50",
        ...(appliedSearch ? { search: appliedSearch } : {}),
        ...(appliedStatusFilter !== "all" ? { status: appliedStatusFilter } : {})
      });
      
      if (appliedDate) {
        const dateStr = appliedDate.toISOString().split("T")[0];
        queryParams.append("date", dateStr);
      }

      const response = await fetch(`http://localhost:4000/api/blogs/admin/list?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error("Failed to fetch blogs");
      
      const result = await response.json();
      if (result.data) {
        setBlogs(result.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load blogs");
    } finally {
      setIsLoading(false);
    }
  }, [session, appliedSearch, appliedDate, appliedStatusFilter]);

  useEffect(() => {
    if (session) {
      const timeout = setTimeout(() => {
        fetchBlogs();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [session, appliedSearch, appliedDate, appliedStatusFilter, fetchBlogs]);

  const handleSearch = () => {
    setAppliedSearch(searchQuery);
    setAppliedDate(selectedDate);
    setAppliedStatusFilter(statusFilter);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setAppliedSearch("");
    setSelectedDate(null);
    setAppliedDate(null);
    setStatusFilter("all");
    setAppliedStatusFilter("all");
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const token = (session as any)?.accessToken;
      const response = await fetch(`http://localhost:4000/api/blogs/${id}/publish`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");
      
      toast.success(currentStatus ? "Blog unpublished" : "Blog published");
      setBlogs(blogs.map(b => b.id === id ? { ...b, isPublished: !currentStatus } : b));
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const confirmDelete = async () => {
    if (!modalConfig.blogId) return;
    
    try {
      const token = (session as any)?.accessToken;
      const response = await fetch(`http://localhost:4000/api/blogs/${modalConfig.blogId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete blog");
      
      toast.success("Blog deleted successfully");
      setModalConfig({ isOpen: false, blogId: null });
      fetchBlogs();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete blog");
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 w-full">
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
        className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
      >
        <div className="space-y-2">
          <p className="text-primary font-medium tracking-[0.2em] text-sm">CONTENT MANAGER</p>
          <h1 className="text-4xl font-semibold tracking-tight">Blogs</h1>
          <p className="text-text-muted font-light max-w-2xl">
            Manage your blog posts, publish new articles, and track views.
          </p>
        </div>
        
        <Link 
          href="/admin/blogs/new"
          className="self-end sm:self-auto flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(255,107,0,0.2)] hover:shadow-[0_0_30px_rgba(255,107,0,0.4)] shrink-0"
        >
          <Plus className="w-5 h-5" />
          Create New Blog
        </Link>
      </motion.div>

      {/* Toolbar */}
      <BlogSearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onSearch={handleSearch}
        onClear={handleClearSearch}
      />

      {/* Blog List */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-24 w-full rounded-xl bg-white/5" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-text-muted" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No blogs found</h3>
            <p className="text-text-muted max-w-md">
              {appliedSearch || appliedStatusFilter !== "all" || appliedDate ? "We couldn't find any blogs matching your search." : "You haven't created any blogs yet. Click the 'Create New Blog' button to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-text-muted">
                  <th className="p-4 font-medium">Post</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Metrics</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg bg-white/5 overflow-hidden shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={blog.coverImage} 
                            alt={blog.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium text-white line-clamp-1">{blog.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-text-muted">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(blog.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePublish(blog.id, blog.isPublished)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                            blog.isPublished ? 'bg-primary' : 'bg-white/10'
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              blog.isPublished ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className={`text-xs font-medium ${blog.isPublished ? 'text-green-400' : 'text-text-muted'}`}>
                          {blog.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-sm text-text-muted">
                        <BarChart2 className="w-4 h-4" />
                        <span>{blog.views} views</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/blog/${blog.slug}`} 
                          target="_blank"
                          className="p-2 text-text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          title="View live"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link 
                          href={`/admin/blogs/${blog.id}`} 
                          className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => setModalConfig({ isOpen: true, blogId: blog.id })}
                          className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        title="Delete Blog Post"
        description="Are you sure you want to delete this blog post? This action cannot be undone and will remove all associated comments as well."
        type="danger"
        confirmText="Delete Post"
        onCancel={() => setModalConfig({ isOpen: false, blogId: null })}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
