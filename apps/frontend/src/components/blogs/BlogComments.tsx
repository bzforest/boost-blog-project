"use client";

import { useState, useRef } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { User, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { CommentCard } from "@/components/shared/CommentCard";

interface CommentType {
  id: string;
  author: string;
  content: string;
  createdAt: string | Date;
  parentId: string | null;
}

interface BlogCommentsProps {
  blogId: string;
  comments: CommentType[];
}

export function BlogComments({ blogId, comments }: BlogCommentsProps) {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const formRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Group comments
  const parentComments = comments.filter((c) => !c.parentId);
  const replies = comments.filter((c) => c.parentId);
  const visibleComments = parentComments.slice(0, visibleCount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:4000/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId,
          author,
          content,
          parentId: replyingTo?.id || null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.details && Array.isArray(errorData.details)) {
          throw new Error(errorData.details[0]);
        }
        throw new Error(errorData.error || "Failed to submit comment");
      }

      toast.success("Comment submitted and awaiting approval.");
      setAuthor("");
      setContent("");
      setReplyingTo(null);
    } catch (error: any) {
      toast.error(error.message || "An error occurred while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 border-t border-white/10 pt-12">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-semibold text-white">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <div ref={formRef} className="bg-[#111111] border border-white/5 rounded-2xl p-6 md:p-8 mb-12">
        <h4 className="text-lg font-medium text-white mb-6">Leave a comment</h4>
        
        {replyingTo && (
          <div className="flex items-center justify-between bg-primary/10 border border-primary/20 text-primary px-4 py-3 rounded-xl mb-6">
            <span className="text-sm font-medium">
              Replying to <span className="font-bold">{replyingTo.name}</span>
            </span>
            <button 
              onClick={() => setReplyingTo(null)}
              className="text-primary hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-center pointer-events-none z-10">
                <User className="w-5 h-5 text-text-muted" />
              </div>
              <Input
                type="text"
                placeholder="Your Name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="pl-11"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div>
            <Textarea
              ref={textareaRef}
              placeholder="Your Comment"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8"
            >
              {isSubmitting ? "Submitting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-8">
        {parentComments.length > 0 ? (
          <>
            {visibleComments.map((comment) => {
            const commentReplies = replies.filter((r) => r.parentId === comment.id);
            
            return (
              <div key={comment.id} className="space-y-6">
                <CommentCard
                  author={comment.author}
                  createdAt={format(new Date(comment.createdAt), "dd MMM yyyy, HH:mm")}
                  content={comment.content}
                  repliesCount={commentReplies.length}
                  onReply={() => {
                    setReplyingTo({ id: comment.id, name: comment.author });
                    setTimeout(() => {
                      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      textareaRef.current?.focus();
                    }, 100);
                  }}
                >
                  {commentReplies.length > 0 && commentReplies.map((reply) => (
                    <div key={reply.id} className="flex flex-col gap-2">
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium text-sm text-primary">{reply.author}</span>
                        <span className="text-[10px] text-text-muted/60 uppercase tracking-widest">
                          {format(new Date(reply.createdAt), "dd MMM yyyy, HH:mm")}
                        </span>
                      </div>
                      <p className="text-sm text-text-muted/80 leading-relaxed font-light whitespace-pre-wrap break-words">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </CommentCard>
              </div>
            );
          })}

          {parentComments.length > visibleCount && (
            <Button 
              variant="outline" 
              className="w-full mt-6 border-primary/20 hover:bg-primary/10 text-primary" 
              onClick={() => setVisibleCount(prev => prev + 5)}
            >
              Load More Comments
            </Button>
          )}
          </>
        ) : (
          <div className="text-center py-12 bg-[#111111] rounded-2xl border border-white/5">
            <p className="text-text-muted">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}
