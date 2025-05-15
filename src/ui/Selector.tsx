import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';

const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
  'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

interface SelectorProps {
  value: string;
  onChange: (state: string) => void;
  onCancel?: () => void;
}

const Selector: React.FC<SelectorProps> = ({ value, onChange, onCancel }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStates = useMemo(() => {
    return states.filter(state =>
      state.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="w-full max-w-xs">
      <div className="relative mb-2">
        <input
          type="text"
          placeholder="Search states..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-primary-medium bg-white
                   text-primary placeholder-primary-medium/70
                   shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                   transition duration-150 ease-in-out"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-medium" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full 
                     hover:bg-primary-lighter transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3 h-3 text-primary-medium hover:text-primary transition-colors" />
          </button>
        )}
      </div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          size={5}
          className="w-full px-4 py-2 rounded-lg border border-primary-medium bg-white text-primary overflow-auto
                   shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                   transition duration-150 ease-in-out"
        >
          {filteredStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-md
                     bg-white border border-primary-medium text-primary hover:bg-primary-lighter
                     transition-colors duration-150 text-sm font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default Selector;