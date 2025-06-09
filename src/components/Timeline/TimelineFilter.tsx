import React, { useState } from 'react';

// Helper function to get current quarter and year
const getCurrentQuarter = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-based
  const currentQuarter = Math.floor(currentMonth / 3) + 1;
  return { currentYear, currentQuarter };
};

// Generate quarterly options from Q1 2024 to current quarter
const generateQuarterlyOptions = () => {
  const { currentYear, currentQuarter } = getCurrentQuarter();
  const quarters = [];
  
  // Start from Q1 2024
  for (let year = 2024; year <= currentYear; year++) {
    const maxQuarter = year === currentYear ? currentQuarter : 4;
    for (let quarter = 1; quarter <= maxQuarter; quarter++) {
      const monthRanges = {
        1: 'Jan-Mar',
        2: 'Apr-Jun', 
        3: 'Jul-Sep',
        4: 'Oct-Dec'
      };
      quarters.push(`Q${quarter} ${year} (${monthRanges[quarter as keyof typeof monthRanges]})`);
    }
  }
  
  return quarters;
};

const QUARTERLY_OPTIONS = generateQuarterlyOptions();

export const TIMELINE_OPTIONS = [
  ...QUARTERLY_OPTIONS,
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
        <div className="absolute right-0 mt-1 w-56 bg-white border border-primary-light rounded-lg shadow-lg z-10 overflow-hidden max-h-64 overflow-y-auto">
          {/* Quarterly Options Section */}
          <div className="border-b border-gray-100">
            <div className="px-3 py-2 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Quarterly
            </div>
            {QUARTERLY_OPTIONS.map((timeline) => (
              <button
                key={timeline}
                onClick={() => {
                  onChange(timeline);
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-primary-lighter text-primary transition-colors duration-150 border-b border-gray-50 last:border-b-0"
              >
                {timeline}
              </button>
            ))}
          </div>
          
          {/* Other Options Section */}
          <div>
            <div className="px-3 py-2 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Other Periods
            </div>
            {['Last Year', 'Year to Date', 'All Time'].map((timeline) => (
              <button
                key={timeline}
                onClick={() => {
                  onChange(timeline as TimelineFilter);
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-primary-lighter text-primary transition-colors duration-150 border-b border-gray-100 last:border-b-0"
              >
                {timeline}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineFilter;

export { TimelineFilter }