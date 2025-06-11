import React, { useState } from 'react';
import StateARBreakdown from '../AR Breakdown/StateARBreakdown';
import DebtCollectionsBreakdown from '../Debt Collections/DebtCollectionsBreakdown';
import IndustryCategoryBreakdown from '../Industry Category/IndustryCategoryBreakdown';
import { TimelineFilter } from '../Timeline/TimelineFilter';

interface BreakdownTabsProps {
  selectedState: string;
  selectedTimeline: TimelineFilter;
}

type TabType = 'ar' | 'debt' | 'industry';

const BreakdownTabs: React.FC<BreakdownTabsProps> = ({ selectedState, selectedTimeline }) => {
  const [activeTab, setActiveTab] = useState<TabType>('ar');

  const tabs = [
    {
      id: 'ar' as TabType,
      label: 'Accounts Receivables Breakdown',
      shortLabel: 'AR Breakdown'
    },
    {
      id: 'debt' as TabType,
      label: 'Debt Collections Breakdown',
      shortLabel: 'Collections'
    },
    {
      id: 'industry' as TabType,
      label: 'Industry Category Breakdown',
      shortLabel: 'Industry'
    }
  ];

  return (
    <div className="flex flex-col p-6 bg-gradient-to-br from-white to-gray-50">
      <div className="container max-w-5xl mx-auto">
        {/* Tab Navigation */}
        <div className="bg-white rounded-t-2xl shadow-lg border border-gray-100 border-b-0">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 px-6 py-4 text-lg font-semibold rounded-t-2xl transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-white text-primary border-b-2 border-primary shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-primary border-b border-gray-200'
                  }
                `}
              >
                {/* Show full label on larger screens, short label on mobile */}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-2xl shadow-lg border border-gray-100 border-t-0">
          {activeTab === 'ar' && (
            <div className="p-0">
              <StateARBreakdown 
                selectedState={selectedState} 
                selectedTimeline={selectedTimeline} 
              />
            </div>
          )}
          
          {activeTab === 'debt' && (
            <div className="p-0">
              <DebtCollectionsBreakdown 
                selectedState={selectedState} 
                selectedTimeline={selectedTimeline} 
              />
            </div>
          )}

          {activeTab === 'industry' && (
            <div className="p-0">
              <IndustryCategoryBreakdown 
                selectedState={selectedState} 
                selectedTimeline={selectedTimeline} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreakdownTabs;