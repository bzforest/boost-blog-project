"use client";

import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar as CalendarIcon, X } from "lucide-react";

interface CustomDatePickerProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  className?: string;
}

// Custom Input to match our theme
const CustomInput = forwardRef<HTMLInputElement, any>(
  ({ value, onClick, onChange, placeholder, className, isClearable, onClear }, ref) => (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <CalendarIcon className="h-4 w-4 text-text-muted group-hover:text-primary transition-colors" />
      </div>
      <input
        value={value}
        onClick={onClick}
        onChange={onChange}
        placeholder={placeholder}
        ref={ref}
        readOnly
        className={`w-full bg-[#111111] border border-white/5 rounded-xl py-2.5 pl-10 pr-8 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-text-muted cursor-pointer ${className}`}
      />
      {isClearable && value && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onClear) onClear();
          }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
);

CustomInput.displayName = "CustomInput";

export function CustomDatePicker({
  selectedDate,
  onChange,
  placeholderText = "Select Date",
  className = "",
}: CustomDatePickerProps) {
  return (
    <div className="relative group w-full sm:w-auto min-w-[200px]">
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => onChange(date)}
        dateFormat="dd MMM yyyy"
        placeholderText={placeholderText}
        customInput={
          <CustomInput 
            className={className} 
            isClearable={!!selectedDate} 
            onClear={() => onChange(null)} 
          />
        }
        calendarClassName="!bg-[#151515] !border-white/10 !rounded-xl !font-sans !shadow-2xl"
        dayClassName={(date: Date) =>
          "!text-white/80 hover:!bg-primary/20 hover:!text-white !rounded-lg"
        }
        monthClassName={() => "!text-white"}
        wrapperClassName="w-full"
      />
      {/* Overriding some default datepicker styles via global classes in globals.css later if needed */}
      <style jsx global>{`
        .react-datepicker__header {
          background-color: #111111 !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-top-left-radius: 0.75rem !important;
          border-top-right-radius: 0.75rem !important;
        }
        .react-datepicker__current-month,
        .react-datepicker-time__header,
        .react-datepicker-year-header {
          color: #fff !important;
          font-weight: 500 !important;
        }
        .react-datepicker__day-name {
          color: rgba(255, 255, 255, 0.4) !important;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: #ff6b00 !important;
          color: white !important;
          border-radius: 0.5rem !important;
        }
        .react-datepicker__day--outside-month {
          color: rgba(255, 255, 255, 0.2) !important;
        }
        .react-datepicker__triangle {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
