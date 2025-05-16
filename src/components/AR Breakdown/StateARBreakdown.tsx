import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { fetchARData, ARData } from '../../lib/supabase';
import { parseISO } from 'date-fns';

const AGING_BUCKETS = [
  { label: 'Current', color: 'rgb(81, 207, 146)' },
  { label: '1 - 30', color: 'rgb(255, 222, 89)' },
  { label: '31-60', color: 'rgb(253, 199, 117)' },
  { label: '61-90', color: 'rgb(255, 145, 77)' },
  { label: '91+', color: 'rgb(255, 87, 87)' },
];

const TIMELINE_OPTIONS = [
  'Last Month',
  'Last Quarter',
  'Last Year',
  'Year to Date',
  'All Time',
] as const;
type TimelineFilter = typeof TIMELINE_OPTIONS[number];

function filterByTimeline(data: ARData[], timeline: TimelineFilter): ARData[] {
  if (timeline === 'All Time') return data;
  const now = new Date();
  let startDate = new Date();
  switch (timeline) {
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
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
  }
  return data.filter(item => {
    if (!item.Date) return false;
    const itemDate = parseISO(item.Date);
    return itemDate >= startDate && itemDate <= now;
  });
}

const StateARBreakdown: React.FC = () => {
  const [selectedTimeline, setSelectedTimeline] = useState<TimelineFilter>('Last Month');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [arData, setARData] = useState<ARData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchARData()
      .then(data => setARData(data || []))
      .finally(() => setLoading(false));
  }, []);

  const filteredData = filterByTimeline(arData, selectedTimeline);

  // Aggregate totals for each bucket
  const chartData = AGING_BUCKETS.map(bucket => ({
    category: bucket.label,
    total: filteredData.reduce((sum, row) => sum + (parseFloat((row as any)[bucket.label]?.replace(/[$,]/g, '') || '0') || 0), 0),
    color: bucket.color,
  }));

  return (
    <div className="flex flex-col p-8 bg-gradient-to-br from-white to-gray-50 min-h-[600px]">
      <div className="container max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">AR Aging Breakdown</h2>
              <p className="text-gray-600">Track your accounts receivable aging across different time periods</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-primary-medium rounded-xl text-primary hover:bg-primary-lighter transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <span className="font-medium">Timeline: {selectedTimeline}</span>
                <span className="ml-2 transform transition-transform duration-200" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-primary-light rounded-xl shadow-xl z-10 overflow-hidden">
                  {TIMELINE_OPTIONS.map((timeline) => (
                    <button
                      key={timeline}
                      onClick={() => {
                        setSelectedTimeline(timeline);
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
          </div>
          <div className="h-[450px] w-full bg-white rounded-xl p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Loading data...</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 50, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fill: '#0B3B6B', fontSize: 14 }} 
                    axisLine={{ stroke: '#e0e0e0' }}
                  />
                  <YAxis
                    tickFormatter={(value: number) => `$${value.toLocaleString()}`}
                    width={100}
                    tick={{ fill: '#0B3B6B', fontSize: 14 }}
                    axisLine={{ stroke: '#e0e0e0' }}
                  />
                  <Tooltip
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Total']}
                    labelFormatter={(label: string) => `${label} Days`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar
                    dataKey="total"
                    radius={[8, 8, 0, 0]}
                    name="Amount"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateARBreakdown;