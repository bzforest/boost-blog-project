"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Check, Trash2, MessageSquare, ExternalLink, CornerDownRight, RotateCcw } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Skeleton } from "@/components/ui/Skeleton";
import { CommentSearchBar } from "@/components/admin/CommentSearchBar";
import { AdminCommentCard } from "@/components/admin/AdminCommentCard";

interface CommentData {
  id: string;
  author: string;
  content: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  blogId: string;
  parentId: string | null;
  blog: {
    title: string;
    slug: string;
  };
  parent: {
    id: string;
    author: string;
    content: string;
  } | null;
}

type TabType = "PENDING" | "APPROVED" | "REJECTED";

export default function CommentsAdminPage() {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("PENDING");
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [appliedDate, setAppliedDate] = useState<Date | null>(null);

  const { data: session } = useSession();

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    commentId: string | null;
    actionType: "reject" | "approve" | "restore" | null;
  }>({ isOpen: false, commentId: null, actionType: null });

  const fetchComments = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = (session as any)?.accessToken;

      const queryParams = new URLSearchParams({
        status: activeTab,
        limit: "100",
      });

      if (appliedSearch) {
        queryParams.append("search", appliedSearch);
      }
      
      if (appliedDate) {
        // Format to YYYY-MM-DD
        const dateStr = appliedDate.toISOString().split("T")[0];
        queryParams.append("date", dateStr);
      }

      const response = await fetch(
        `http://localhost:4000/api/comments/admin/list?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch comments");

      const result = await response.json();
      if (result.data) {
        setComments(result.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  }, [session, activeTab, appliedSearch, appliedDate]);

  useEffect(() => {
    if (session) {
      fetchComments();
    }
  }, [session, activeTab, fetchComments]);

  const handleSearch = () => {
    setAppliedSearch(searchQuery);
    setAppliedDate(selectedDate);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setAppliedSearch("");
    setSelectedDate(null);
    setAppliedDate(null);
  };

  const confirmAction = async () => {
    if (!modalConfig.commentId || !modalConfig.actionType) return;

    try {
      const token = (session as any)?.accessToken;
      const endpoint = `http://localhost:4000/api/comments/admin/${modalConfig.commentId}/${modalConfig.actionType}`;
      
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`Failed to ${modalConfig.actionType} comment`);

      toast.success(`Comment ${modalConfig.actionType}d successfully`);
      setModalConfig({ isOpen: false, commentId: null, actionType: null });
      fetchComments();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${modalConfig.actionType} comment`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "PENDING", label: "Pending" },
    { id: "APPROVED", label: "Approved" },
    { id: "REJECTED", label: "Rejected" },
  ];

  const getModalProps = () => {
    switch (modalConfig.actionType) {
      case "approve":
        return {
          title: "Approve Comment",
          description: "Are you sure you want to approve this comment? It will be publicly visible on the blog post.",
          type: "info" as const,
          confirmText: "Approve",
        };
      case "reject":
        return {
          title: "Reject Comment",
          description: "Are you sure you want to reject this comment? It will be removed from public view but kept in the rejected tab.",
          type: "danger" as const,
          confirmText: "Reject",
        };
      case "restore":
        return {
          title: "Restore Comment",
          description: "Are you sure you want to restore this comment? It will become publicly visible again.",
          type: "info" as const,
          confirmText: "Restore",
        };
      default:
        return {
          title: "Confirm Action",
          description: "Are you sure you want to proceed?",
          type: "info" as const,
          confirmText: "Confirm",
        };
    }
  };

  const modalProps = getModalProps();

  return (
    <div className="max-w-6xl mx-auto space-y-8 w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <p className="text-primary font-medium tracking-[0.2em] text-sm">
          CONTENT MANAGER
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Comments</h1>
        <p className="text-text-muted font-light max-w-2xl">
          Review, approve, or remove user comments across your blog posts.
        </p>
      </motion.div>

      {/* Search Bar Section */}
      <CommentSearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onSearch={handleSearch}
        onClear={handleClearSearch}
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
              activeTab === tab.id
                ? "bg-primary text-white shadow-[0_0_20px_rgba(255,107,0,0.2)]"
                : "text-text-muted hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Comment List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="h-32 w-full rounded-2xl bg-white/5"
              />
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center bg-[#111111] border border-white/5 rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-text-muted" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              No {activeTab.toLowerCase()} comments
            </h3>
            <p className="text-text-muted max-w-md">
              {activeTab === "PENDING"
                ? "There are no comments waiting for review. Check back later."
                : activeTab === "REJECTED" 
                ? "No rejected comments found." 
                : "No approved comments yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <AdminCommentCard
                key={comment.id}
                comment={comment}
                activeTab={activeTab}
                formatDate={formatDate}
                onApprove={(id) => setModalConfig({ isOpen: true, commentId: id, actionType: "approve" })}
                onReject={(id) => setModalConfig({ isOpen: true, commentId: id, actionType: "reject" })}
                onRestore={(id) => setModalConfig({ isOpen: true, commentId: id, actionType: "restore" })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalProps.title}
        description={modalProps.description}
        type={modalProps.type}
        confirmText={modalProps.confirmText}
        onCancel={() =>
          setModalConfig({ isOpen: false, commentId: null, actionType: null })
        }
        onConfirm={confirmAction}
      />
    </div>
  );
}
