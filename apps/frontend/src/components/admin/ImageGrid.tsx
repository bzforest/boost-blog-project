"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit3, Check, X, Eye, EyeOff, RotateCcw, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/Skeleton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface SiteImage {
  id: string;
  imageUrl: string;
  isActive: boolean;
  altText?: string | null;
  sortOrder?: number;
  createdAt: string;
}

interface ImageGridProps {
  type: "hero" | "about" | "gallery";
  images: SiteImage[];
  isLoading: boolean;
  onUpdate: () => void;
}

const ACTIVE_LIMITS: Record<string, number> = {
  hero: 7,
  about: 1,
  gallery: 12,
};

export function ImageGrid({ type, images, isLoading, onUpdate }: ImageGridProps) {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  // --- Draft State ---
  const [draftImages, setDraftImages] = useState<SiteImage[]>(images);

  // Sync draft with API data when images prop changes (after refetch)
  useEffect(() => {
    setDraftImages(images);
  }, [images]);

  // Detect unsaved changes
  const hasChanges = useMemo(() => {
    if (draftImages.length !== images.length) return false;
    return draftImages.some((draft) => {
      const original = images.find((img) => img.id === draft.id);
      return original && original.isActive !== draft.isActive;
    });
  }, [draftImages, images]);

  // Count changes
  const changeCount = useMemo(() => {
    return draftImages.filter((draft) => {
      const original = images.find((img) => img.id === draft.id);
      return original && original.isActive !== draft.isActive;
    }).length;
  }, [draftImages, images]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ altText: "", sortOrder: 0 });
  const [isSaving, setIsSaving] = useState(false);

  // --- Modal State (for Delete & Batch Apply) ---
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "delete" | "apply";
    image: SiteImage | null;
  }>({ isOpen: false, type: "delete", image: null });

  // --- Toggle Draft (no API call) ---
  const toggleDraft = (id: string) => {
    const target = draftImages.find((img) => img.id === id);
    if (!target) return;

    // If trying to activate, check limit
    if (!target.isActive) {
      const limit = ACTIVE_LIMITS[type];
      const currentActiveCount = draftImages.filter((img) => img.isActive).length;
      if (currentActiveCount >= limit) {
        toast.error(
          `You can only have up to ${limit} active ${type === "gallery" ? "gallery" : type} image${limit > 1 ? "s" : ""}.`
        );
        return;
      }
    }

    setDraftImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, isActive: !img.isActive } : img))
    );
  };

  // --- Cancel Draft ---
  const cancelDraft = () => {
    setDraftImages(images);
  };

  // --- Apply Changes (Batch) ---
  const handleApplyClick = () => {
    setModalConfig({ isOpen: true, type: "apply", image: null });
  };

  const confirmAction = async () => {
    const { type: actionType, image } = modalConfig;
    setModalConfig((prev) => ({ ...prev, isOpen: false }));

    if (actionType === "apply") {
      setIsSaving(true);
      try {
        const updates = draftImages.map((img) => ({
          id: img.id,
          isActive: img.isActive,
        }));

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}`}/content/${type}/bulk-active`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ updates }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to apply changes");
        }

        toast.success(`${changeCount} change${changeCount > 1 ? "s" : ""} applied successfully!`);
        onUpdate();
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsSaving(false);
      }
    } else if (actionType === "delete" && image) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}`}/content/${type}/${image.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to delete image");

        toast.success("Image deleted successfully");
        onUpdate();
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const handleDeleteClick = (image: SiteImage) => {
    setModalConfig({ isOpen: true, type: "delete", image });
  };

  const saveDetails = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}`}/content/${type}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            altText: editForm.altText,
            sortOrder: Number(editForm.sortOrder),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update details");

      toast.success("Details updated");
      setEditingId(null);
      onUpdate();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 w-full rounded-2xl bg-white/5" />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-text-muted border border-white/5 rounded-2xl bg-[#111111]">
        <p className="tracking-wide">No images found for this section.</p>
      </div>
    );
  }

  const limit = ACTIVE_LIMITS[type];
  const activeCount = draftImages.filter((img) => img.isActive).length;

  return (
    <>
      {/* Active Count Indicator */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-text-muted">
          Active: <span className={`font-semibold ${activeCount >= limit ? "text-red-400" : "text-green-400"}`}>{activeCount}</span>
          <span className="text-white/30"> / {limit}</span>
        </p>
      </div>

      {/* Unsaved Changes Bar */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between px-5 py-3 rounded-xl bg-white/[0.03] border border-primary/20 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <p className="text-sm text-white/80">
                  <span className="font-semibold text-primary">{changeCount}</span>{" "}
                  unsaved change{changeCount > 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={cancelDraft}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Cancel
                </button>
                <button
                  onClick={handleApplyClick}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSaving ? "Applying..." : "Apply Changes"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {draftImages.map((image) => {
            const original = images.find((img) => img.id === image.id);
            const isChanged = original && original.isActive !== image.isActive;

            return (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className={`group relative bg-[#111111] border rounded-2xl overflow-hidden transition-colors ${
                  isChanged
                    ? "border-primary/40 ring-1 ring-primary/20"
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                {/* Changed Badge */}
                {isChanged && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-primary/20 text-primary">
                      Changed
                    </span>
                  </div>
                )}

                {/* Image Preview */}
                <div className="relative aspect-video sm:aspect-square md:aspect-video w-full bg-black/50 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.imageUrl}
                    alt={image.altText || "Site content image"}
                    className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                      !image.isActive && "opacity-40 grayscale"
                    }`}
                  />

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => toggleDraft(image.id)}
                      className={`p-2 rounded-full cursor-pointer ${
                        image.isActive
                          ? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
                          : "bg-green-500/20 text-green-500 hover:bg-green-500/30"
                      } transition-colors`}
                      title={image.isActive ? "Hide on website" : "Show on website"}
                    >
                      {image.isActive ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>

                    <button
                      onClick={() => !image.isActive && handleDeleteClick(image)}
                      disabled={image.isActive}
                      className={`p-2 rounded-full transition-colors ${
                        image.isActive
                          ? "bg-white/5 text-white/20 cursor-not-allowed"
                          : "bg-red-500/20 text-red-500 hover:bg-red-500/30 cursor-pointer"
                      }`}
                      title={image.isActive ? "Cannot delete an active image. Please hide it first." : "Delete image"}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        image.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-white/10 text-white/50"
                      }`}
                    >
                      {image.isActive ? "Active" : "Hidden"}
                    </span>
                  </div>
                </div>

                {/* Editable Details (Gallery Only) */}
                {type === "gallery" && (
                  <div className="p-4 border-t border-white/5 bg-[#0a0a0a]">
                    {editingId === image.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-text-muted mb-1 block">
                            Alt Text
                          </label>
                          <input
                            type="text"
                            value={editForm.altText}
                            onChange={(e) =>
                              setEditForm({ ...editForm, altText: e.target.value })
                            }
                            className="w-full bg-[#111111] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="Image description"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-text-muted mb-1 block">
                            Sort Order
                          </label>
                          <input
                            type="number"
                            value={editForm.sortOrder}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                sortOrder: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-full bg-[#111111] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                        <div className="flex gap-2 justify-end pt-1">
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 text-text-muted hover:text-white hover:bg-white/5 rounded-md transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => saveDetails(image.id)}
                            className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded-md transition-colors cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between group/edit">
                        <div className="overflow-hidden">
                          <p className="text-sm text-white truncate">
                            {image.altText || (
                              <span className="text-white/30 italic">
                                No description
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-text-muted mt-0.5">
                            Order: {image.sortOrder || 0}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setEditingId(image.id);
                            setEditForm({
                              altText: image.altText || "",
                              sortOrder: image.sortOrder || 0,
                            });
                          }}
                          className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-md opacity-0 group-hover/edit:opacity-100 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={
          modalConfig.type === "delete"
            ? "Delete Image"
            : "Apply Visibility Changes"
        }
        description={
          modalConfig.type === "delete"
            ? "Are you sure you want to permanently delete this image? This action cannot be undone."
            : `Are you sure you want to apply ${changeCount} visibility change${changeCount > 1 ? "s" : ""} to the live website?`
        }
        type={modalConfig.type === "delete" ? "danger" : "warning"}
        confirmText={modalConfig.type === "delete" ? "Delete" : "Apply Changes"}
        onCancel={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={confirmAction}
      />
    </>
  );
}
