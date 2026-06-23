import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, Eye, User } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlogComments } from "@/components/blogs/BlogComments";
import { BlogGallery } from "@/components/blogs/BlogGallery";
import { FadeIn } from "@/components/ui/FadeIn";
export const dynamic = "force-dynamic";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Fetch Blog Data
  let blog;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/blogs/${slug}`, {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      notFound();
    }
    
    const json = await res.json();
    blog = json.data;
  } catch (error) {
    notFound();
  }

  if (!blog || !blog.isPublished) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background">
        {/* 2. Hero Cover Image */}
        <div className="relative w-full h-[60vh] min-h-[400px]">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-6">
              <FadeIn>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {blog.title}
                </h1>
              </FadeIn>
              
              <FadeIn delay={0.1}>
                <div className="flex flex-wrap items-center gap-6 text-text-muted text-sm md:text-base font-medium">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    <span>Admin</span> {/* Fallback if no author field on Blog */}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>{format(new Date(blog.createdAt), "dd MMM yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />
                    <span>{blog.views.toLocaleString()} Views</span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-20">
          <FadeIn delay={0.2}>
            {/* 3. Body Content (Tailwind Typography) */}
            <article 
              className="prose prose-invert prose-orange max-w-none 
                         prose-headings:font-semibold prose-a:text-primary 
                         prose-img:rounded-2xl prose-img:w-full
                         prose-p:leading-relaxed prose-p:text-text-muted/90"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </FadeIn>

          {/* 4. Sub-images Gallery */}
          <FadeIn delay={0.3}>
            <BlogGallery images={blog.images} />
          </FadeIn>

          {/* 5. Interactive Comments Section */}
          <FadeIn delay={0.4}>
            <BlogComments blogId={blog.id} comments={blog.comments} />
          </FadeIn>

        </div>
      </main>

      <Footer />
    </>
  );
}
