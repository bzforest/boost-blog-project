"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { CustomDatePicker } from "../shared/CustomDatePicker";
import { CustomDropdown } from "../shared/CustomDropdown";

export function PublicBlogSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [date, setDate] = useState<Date | null>(
    searchParams.get("date") ? new Date(searchParams.get("date") as string) : null
  );
  const [sort, setSort] = useState(searchParams.get("sort") || "date_desc");

  const sortOptions = [
    { label: "Newest First", value: "date_desc" },
    { label: "Oldest First", value: "date_asc" },
    { label: "Most Viewed", value: "views_desc" },
    { label: "Least Viewed", value: "views_asc" },
    { label: "Title A-Z", value: "title_asc" },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // Reset to page 1 on new search
    
    if (query) params.set("q", query);
    else params.delete("q");

    if (date) params.set("date", date.toISOString().split("T")[0]);
    else params.delete("date");

    if (sort) params.set("sort", sort);
    else params.delete("sort");

    router.push(`?${params.toString()}`);
  };

  const handleClear = () => {
    setQuery("");
    setDate(null);
    setSort("date_desc");
    router.push("?");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 bg-[#111111] border border-white/5 p-4 rounded-2xl w-full">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-text-muted" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by title or excerpt..."
          className="w-full bg-[#151515] border border-white/5 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-text-muted"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              handleSearch();
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex w-full md:w-auto gap-4 flex-col sm:flex-row">
        {/* Date Picker */}
        <div className="w-full sm:w-auto min-w-[160px]">
          <CustomDatePicker
            selectedDate={date}
            onChange={setDate}
            placeholderText="Filter by Date"
            className="!py-2.5"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="w-full sm:w-auto min-w-[160px]">
          <CustomDropdown
            options={sortOptions}
            value={sort}
            onChange={setSort}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
        <button
          onClick={handleSearch}
          className="flex-1 md:flex-none px-6 py-2.5 bg-primary hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(255,107,0,0.15)] cursor-pointer"
        >
          Search
        </button>
        <button
          onClick={handleClear}
          className="flex-1 md:flex-none px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-all cursor-pointer"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
