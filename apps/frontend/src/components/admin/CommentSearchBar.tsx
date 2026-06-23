"use client";

import { Search, X } from "lucide-react";
import { CustomDatePicker } from "../shared/CustomDatePicker";

interface CommentSearchBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  onSearch: () => void;
  onClear: () => void;
}

export function CommentSearchBar({
  searchQuery,
  onSearchChange,
  selectedDate,
  onDateChange,
  onSearch,
  onClear,
}: CommentSearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#111111] border border-white/5 p-4 rounded-2xl w-full">
      {/* Text Input */}
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-text-muted" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by author or blog title..."
          className="w-full bg-[#151515] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-text-muted"
        />
        {searchQuery && (
          <button
            onClick={() => {
              onSearchChange("");
              onClear();
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Date Picker */}
      <div className="w-full sm:w-auto">
        <CustomDatePicker
          selectedDate={selectedDate}
          onChange={onDateChange}
          placeholderText="Filter by Date"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
        <button
          onClick={onSearch}
          className="flex-1 sm:flex-none px-4 py-2.5 bg-primary hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(255,107,0,0.15)] cursor-pointer"
        >
          Search
        </button>
        <button
          onClick={onClear}
          className="flex-1 sm:flex-none px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-all cursor-pointer"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
