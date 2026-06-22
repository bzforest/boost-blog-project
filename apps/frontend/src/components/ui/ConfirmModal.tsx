"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning"
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={onCancel}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden z-10"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full flex-shrink-0 ${
                type === "danger" ? "bg-red-500/10 text-red-500" : "bg-yellow-500/10 text-yellow-500"
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              
              <div className="flex-1 pt-1">
                <h3 className="text-lg font-semibold text-white tracking-wide">{title}</h3>
                <p className="text-text-muted text-sm mt-2 leading-relaxed">{description}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-white bg-transparent hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors cursor-pointer ${
                  type === "danger" 
                    ? "bg-red-500 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                    : "bg-primary hover:bg-orange-600 shadow-[0_0_15px_rgba(255,107,0,0.2)]"
                }`}
              >
                {confirmText}
              </button>
            </div>
            
            <button 
              onClick={onCancel}
              className="absolute top-4 right-4 p-2 text-white/40 hover:text-white rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
