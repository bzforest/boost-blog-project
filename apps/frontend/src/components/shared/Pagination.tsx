import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams?: Record<string, string | undefined>;
}

export function Pagination({ currentPage, totalPages, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Function to generate URL for a specific page
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  // Logic to show limited page numbers (e.g., 1, 2, ..., 5, 6, 7, ..., 10)
  // For simplicity, we'll show all if totalPages <= 7
  let pages: (number | string)[] = [];
  if (totalPages <= 7) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (currentPage <= 3) {
      pages = [1, 2, 3, 4, "...", totalPages];
    } else if (currentPage >= totalPages - 2) {
      pages = [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      pages = [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-8">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={createPageURL(currentPage - 1)}
          className="p-2 bg-[#111111] hover:bg-[#1a1a1a] border border-white/10 rounded-lg text-white transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      ) : (
        <button
          disabled
          className="p-2 bg-[#111111]/50 border border-white/5 rounded-lg text-white/30 cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-text-muted">
                ...
              </span>
            );
          }

          const isCurrentPage = page === currentPage;

          return (
            <Link
              key={`page-${page}`}
              href={createPageURL(page)}
              className={`min-w-[40px] h-[40px] flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                isCurrentPage
                  ? "bg-primary text-white shadow-[0_0_15px_rgba(255,107,0,0.2)]"
                  : "bg-[#111111] hover:bg-[#1a1a1a] text-text-muted hover:text-white border border-white/10"
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={createPageURL(currentPage + 1)}
          className="p-2 bg-[#111111] hover:bg-[#1a1a1a] border border-white/10 rounded-lg text-white transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <button
          disabled
          className="p-2 bg-[#111111]/50 border border-white/5 rounded-lg text-white/30 cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
