import React, { useState } from 'react';

export const TIMELINE_OPTIONS = [
  'Last Month',
  'Last Quarter',
  'Last Year',
  'Year to Date',
  'All Time',
] as const;

export type TimelineFilter = typeof TIMELINE_OPTIONS[number];

interface TimelineFilterProps {
  value: TimelineFilter;
  onChange: (timeline: TimelineFilter) => void;
}

const TimelineFilter: React.FC<TimelineFilterProps> = ({ value, onChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-6 py-3 bg-white border border-primary-medium rounded-xl text-primary hover:bg-primary-lighter transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <span className="font-medium">Timeline: {value}</span>
        <span 
          className="ml-2 transform transition-transform duration-200" 
          style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▼
        </span>
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-primary-light rounded-xl shadow-xl z-10 overflow-hidden">
          {TIMELINE_OPTIONS.map((timeline) => (
            <button
              key={timeline}
              onClick={() => {
                onChange(timeline);
                setIsDropdownOpen(false);
              }}
              className="w-full px-6 py-3 text-left hover:bg-primary-lighter text-primary transition-colors duration-150 border-b border-gray-100 last:border-b-0"
            >
              {timeline}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimelineFilter;