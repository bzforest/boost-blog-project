import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Trash2, ExternalLink, CornerDownRight, RotateCcw } from "lucide-react";

type TabType = "PENDING" | "APPROVED" | "REJECTED";

interface AdminCommentCardProps {
  comment: {
    id: string;
    author: string;
    content: string;
    createdAt: string;
    blog: {
      title: string;
      slug: string;
    };
    parent: {
      id: string;
      author: string;
      content: string;
    } | null;
  };
  activeTab: TabType;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onRestore?: (id: string) => void;
  formatDate: (dateString: string) => string;
}

export function AdminCommentCard({
  comment,
  activeTab,
  onApprove,
  onReject,
  onRestore,
  formatDate,
}: AdminCommentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111111] border border-white/5 rounded-2xl p-5 md:p-6 hover:border-white/10 transition-colors group"
    >
      {/* Comment Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex flex-col">
          <h4 className="text-sm font-semibold text-white">{comment.author}</h4>
          <p className="text-xs text-text-muted mt-0.5">
            {formatDate(comment.createdAt)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Pending Actions */}
          {activeTab === "PENDING" && (
            <>
              {onApprove && (
                <button
                  onClick={() => onApprove(comment.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-400 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-colors cursor-pointer"
                  title="Approve comment"
                >
                  <Check className="w-3.5 h-3.5" />
                  Approve
                </button>
              )}
              {onReject && (
                <button
                  onClick={() => onReject(comment.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                  title="Reject comment"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Reject
                </button>
              )}
            </>
          )}

          {/* Approved Actions */}
          {activeTab === "APPROVED" && onReject && (
            <button
              onClick={() => onReject(comment.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
              title="Reject comment"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reject
            </button>
          )}

          {/* Rejected Actions */}
          {activeTab === "REJECTED" && onRestore && (
            <button
              onClick={() => onRestore(comment.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors cursor-pointer"
              title="Restore comment"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restore
            </button>
          )}
        </div>
      </div>

      {/* Reply Context */}
      {comment.parent && (
        <div className="flex items-start gap-2 mb-3 ml-1 pl-3 border-l-2 border-white/10">
          <CornerDownRight className="w-3.5 h-3.5 text-text-muted mt-0.5 shrink-0" />
          <p className="text-xs text-text-muted line-clamp-1">
            Replied to{" "}
            <span className="text-white/60 font-medium">
              {comment.parent.author}
            </span>
            : <span className="italic">&ldquo;{comment.parent.content}&rdquo;</span>
          </p>
        </div>
      )}

      {/* Comment Content */}
      <p
        className={`text-sm leading-relaxed mb-3 ${
          activeTab === "REJECTED" ? "text-white/40 line-through" : "text-white/80"
        }`}
      >
        {comment.content}
      </p>

      {/* Blog Reference */}
      <div className="flex items-center gap-2 pt-3 border-t border-white/5">
        <span className="text-xs text-text-muted">Commented on:</span>
        <Link
          href={`/blogs/${comment.blog.slug}`}
          target="_blank"
          className="text-xs text-primary hover:text-primary-hover transition-colors font-medium inline-flex items-center gap-1"
        >
          {comment.blog.title}
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
}
