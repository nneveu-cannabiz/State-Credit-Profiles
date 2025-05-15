import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import Selector from '../../ui/Selector';

interface StateSelectorProps {
  value: string;
  onChange: (state: string) => void;
}

const StateSelector: React.FC<StateSelectorProps> = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleStateChange = (state: string) => {
    onChange(state);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-center p-6 border-b border-primary-light bg-primary-lighter/30">
      <div className="container max-w-4xl">
        <div className="flex flex-col items-center">
          {isEditing ? (
            <div className="animate-fade-in w-full max-w-md">
              <Selector 
                value={value} 
                onChange={handleStateChange}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          ) : (
            <div 
              onClick={() => setIsEditing(true)}
              className="group cursor-pointer inline-flex items-center gap-3 px-4 py-2 rounded-lg
                       hover:bg-white/50 transition-colors"
            >
              <h2 className="text-5xl font-semibold text-primary group-hover:text-primary/90">
                {value}
              </h2>
              <Pencil 
                className="w-4 h-4 text-primary-medium opacity-0 group-hover:opacity-100 
                         transition-all duration-200"
                aria-hidden="true"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StateSelector;