import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { fetchStateARData, type ARData } from '../../lib/supabase';
import { AR_AGING } from '../../utils/Colorcoding';

// Hardcoded colors for AR aging categories in RGB format
const AR_COLORS = {
  'Current': 'rgb(81, 207, 146)',    // Very Low Risk (green)
  '1 - 30': 'rgb(255, 222, 89)',     // Low Risk (yellow)
  '31-60': 'rgb(253, 199, 117)',     // Medium Risk (orange)
  '61-90': 'rgb(255, 145, 77)',      // High Risk (dark orange)
  '91+': 'rgb(255, 87, 87)',         // Very High Risk (red)
} as const;

interface StateARBreakdownProps {
  selectedState: string;
}

type TimelineFilter = 'Last Month' | 'Last Quarter' | 'Last Year' | 'Year to Date' | 'All Time';
type ARCategory = keyof typeof AR_AGING;

const StateARBreakdown = ({ selectedState }: StateARBreakdownProps) => {
  const [arData, setARData] = useState<ARData[]>([]);
  const [selectedTimeline, setSelectedTimeline] = useState<TimelineFilter>('Last Month');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStateData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Loading data for state:', selectedState);
        const data = await fetchStateARData(selectedState);
        console.log('Raw data received:', data);
        if (data) {
          const filteredData = filterDataByTimeline(data, selectedTimeline);
          console.log('Filtered data:', filteredData);
          setARData(filteredData);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load AR data';
        console.error('Error loading AR data:', errorMessage);
        setError(errorMessage);
      }
      setIsLoading(false);
    };

    loadStateData();
  }, [selectedState, selectedTimeline]);

  const parseAmount = (value: string | null): number => {
    if (!value) return 0;
    // Remove any currency symbols and commas, then parse
    const cleanValue = value.replace(/[$,]/g, '');
    const number = parseFloat(cleanValue);
    return isNaN(number) ? 0 : number;
  };

  const timelineOptions: TimelineFilter[] = [
    'Last Month',
    'Last Quarter',
    'Last Year',
    'Year to Date',
    'All Time'
  ];

  const filterDataByTimeline = (data: ARData[], timeline: TimelineFilter): ARData[] => {
    const now = new Date();
    const startDate = new Date();

    switch(timeline) {
      case 'Last Month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'Last Quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'Last Year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'Year to Date':
        startDate.setMonth(0, 1);
        break;
      case 'All Time':
        return data;
    }

    return data.filter(item => {
      const itemDate = new Date(item.Date!);
      return itemDate >= startDate && itemDate <= now;
    });
  };


  const calculateTotalsByCategory = () => {
    console.log('Calculating totals from data:', arData);
    const totals: Record<ARCategory, number> = {
      'CURRENT': 0,
      'DAYS_1_30': 0,
      'DAYS_31_60': 0,
      'DAYS_61_90': 0,
      'DAYS_91_PLUS': 0
    };

    arData.forEach((item: ARData) => {
      (Object.keys(totals) as ARCategory[]).forEach(category => {
        const label = AR_AGING[category].label;
        totals[category] += parseAmount(item[label]);
        if (parseAmount(item[label]) > 0) {
          console.log(`Found value for ${label}:`, item[label]);
        }
      });
    });
    
    console.log('Final totals:', totals);

    return Object.entries(totals).map(([category, total]) => {
      const label = AR_AGING[category as ARCategory].label;
      return {
        category: label,
        total,
        color: AR_COLORS[label]
      };
    });
  };

  const chartData = calculateTotalsByCategory();

  return (
    <div className="flex flex-col p-6 bg-white">
      <div className="container max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-primary">AR Aging Breakdown</h2>
            <p className="text-primary-medium mt-1">Showing data for {selectedState}</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-primary-medium 
                       rounded-lg text-primary hover:bg-primary-lighter transition-colors"
            >
              Timeline: {selectedTimeline}
              <ChevronDown className="w-4 h-4" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-primary-light 
                            rounded-lg shadow-lg z-10">
                {timelineOptions.map((timeline) => (
                  <button
                    key={timeline}
                    onClick={() => {
                      setSelectedTimeline(timeline);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-primary-lighter 
                             text-primary first:rounded-t-lg last:rounded-b-lg"
                  >
                    {timeline}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {isLoading ? (
          <div className="h-[400px] w-full flex items-center justify-center">
            <div className="text-primary-medium">Loading data...</div>
          </div>
        ) : error ? (
          <div className="h-[400px] w-full flex items-center justify-center">
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        ) : chartData.length > 0 ? (
          <div className="h-[400px] w-full">
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 50, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fill: '#0B3B6B' }}
                />
                <YAxis 
                  tickFormatter={(value: number) => `$${value.toLocaleString()}`}
                  width={100}
                  tick={{ fill: '#0B3B6B' }}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Total']}
                  labelFormatter={(label: string) => `${label} Days`}
                />
                <Bar
                  dataKey="total"
                  fill={(data: { category: keyof typeof AR_COLORS }) => AR_COLORS[data.category]}
                  radius={[4, 4, 0, 0]}
                  name="Amount"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[400px] w-full flex items-center justify-center">
            <div className="text-primary-medium">No data available for {selectedState}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StateARBreakdown;