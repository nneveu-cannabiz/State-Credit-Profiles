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
        className="flex items-center gap-1 px-3 py-2 bg-white/80 border border-primary-medium/60 rounded-lg text-primary-medium text-sm hover:bg-primary-lighter transition-all duration-200 shadow-sm"
      >
        <span className="font-medium">Timeline: {value}</span>
        <span 
          className="ml-1 transform transition-transform duration-200 text-xs" 
          style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▼
        </span>
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-1 w-40 bg-white border border-primary-light rounded-lg shadow-lg z-10 overflow-hidden">
          {TIMELINE_OPTIONS.map((timeline) => (
            <button
              key={timeline}
              onClick={() => {
                onChange(timeline);
                setIsDropdownOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-primary-lighter text-primary transition-colors duration-150 border-b border-gray-100 last:border-b-0"
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

export { TimelineFilter }