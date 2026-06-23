"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, Save, Sparkles, Loader2 } from "lucide-react";

import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { BlogImageUploader } from "@/components/admin/BlogImageUploader";
import { Skeleton } from "@/components/ui/Skeleton";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { data: session } = useSession();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: [] as string[],
    images: [] as string[],
    isPublished: false,
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = (session as any)?.accessToken;
        const response = await fetch(`http://localhost:4000/api/blogs/admin/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch blog");

        const result = await response.json();
        const blog = result.data;

        setForm({
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          content: blog.content,
          coverImage: blog.coverImage ? [blog.coverImage] : [],
          images: blog.images || [],
          isPublished: blog.isPublished,
        });
      } catch (error: any) {
        toast.error("Failed to load blog details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session && id) {
      fetchBlog();
    }
  }, [session, id]);

  const generateSlug = () => {
    if (!form.title) {
      toast.error("Please enter a title first");
      return;
    }

    if (/[ก-๙]/.test(form.title)) {
      toast.error("Auto-generate works with English titles only. Please enter manually.");
      return;
    }

    const slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    if (!slug) {
      toast.error("Auto-generate works with English titles only. Please enter manually.");
      return;
    }

    setForm({ ...form, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title) return toast.error("Title is required");
    if (!form.slug) return toast.error("Slug is required");
    if (!form.excerpt) return toast.error("Excerpt is required");
    if (!form.content) return toast.error("Content is required");
    if (form.coverImage.length === 0) return toast.error("Cover image is required");

    try {
      setIsSaving(true);
      const token = (session as any)?.accessToken;
      
      const payload = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        coverImage: form.coverImage[0],
        images: form.images,
        isPublished: form.isPublished,
      };

      const response = await fetch(`http://localhost:4000/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update blog");
      }

      toast.success("Blog updated successfully!");
      
      setTimeout(() => {
        router.push("/admin/blogs");
      }, 1000);
      
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto w-full p-8 space-y-8">
        <Skeleton className="h-10 w-48 bg-white/5" />
        <Skeleton className="h-96 w-full rounded-2xl bg-white/5" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full pb-24">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link 
          href="/admin/blogs" 
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Edit <span className="text-primary">Blog</span></h1>
      </motion.div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info Section */}
        <div className="bg-[#111111] border border-white/5 p-6 md:p-8 rounded-2xl space-y-6">
          <h2 className="text-xl font-medium text-primary mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Title</label>
              <input 
                type="text" 
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter blog title"
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">URL Slug</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="my-awesome-blog-post"
                  className="flex-1 bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20"
                  required
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="hidden sm:inline">Auto-generate</span>
                </button>
              </div>
              <p className="text-xs text-white/30 mt-1.5">This will be the URL: yoursite.com/blog/<strong>{form.slug || 'slug-here'}</strong></p>
              <p className="text-xs text-text-muted mt-1">* Auto-generate supports English titles only.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Excerpt</label>
              <textarea 
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="A short summary of the blog post"
                rows={3}
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20 resize-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Content Section (Rich Text Editor) */}
        <div className="bg-[#111111] border border-white/5 p-6 md:p-8 rounded-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-medium text-primary">Content</h2>
          </div>
          <RichTextEditor 
            content={form.content} 
            onChange={(content) => setForm({ ...form, content })} 
          />
        </div>

        {/* Media Section */}
        <div className="bg-[#111111] border border-white/5 p-6 md:p-8 rounded-2xl space-y-8">
          <h2 className="text-xl font-medium text-primary">Media</h2>
          
          <div className="pt-2">
            <BlogImageUploader 
              label="Cover Image"
              maxImages={1}
              currentImages={form.coverImage}
              onChange={(imgs) => setForm({ ...form, coverImage: imgs })}
              helperText="This image will be displayed on the blog list and at the top of the article."
            />
          </div>

          <div className="w-full h-px bg-white/5" />

          <div>
            <BlogImageUploader 
              label="Additional Images"
              maxImages={6}
              currentImages={form.images}
              onChange={(imgs) => setForm({ ...form, images: imgs })}
              helperText="You can upload up to 6 extra images to be used within your content."
            />
          </div>
        </div>

        {/* Sticky Action Bar */}
        <div className="fixed bottom-0 left-0 sm:left-64 right-0 p-4 bg-[#0a0a0a]/80 backdrop-blur-md border-t border-white/10 z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <span className="text-sm text-text-muted">Status:</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isPublished: !form.isPublished })}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                    form.isPublished ? 'bg-primary' : 'bg-white/10'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      form.isPublished ? 'translate-x-4.5' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ml-1 ${form.isPublished ? 'text-green-400' : 'text-text-muted'}`}>
                  {form.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/admin/blogs")}
                className="px-5 py-2 text-sm font-medium text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(255,107,0,0.2)] hover:shadow-[0_0_30px_rgba(255,107,0,0.4)] disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
