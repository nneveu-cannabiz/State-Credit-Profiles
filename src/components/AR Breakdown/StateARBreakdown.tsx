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
    <div className="flex flex-col p-6 bg-white">
      <div className="container max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-primary">AR Aging Breakdown</h2>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-primary-medium rounded-lg text-primary hover:bg-primary-lighter transition-colors"
            >
              Timeline: {selectedTimeline}
              <span className="ml-2">▼</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-primary-light rounded-lg shadow-lg z-10">
                {TIMELINE_OPTIONS.map((timeline) => (
                  <button
                    key={timeline}
                    onClick={() => {
                      setSelectedTimeline(timeline);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-primary-lighter text-primary first:rounded-t-lg last:rounded-b-lg"
                  >
                    {timeline}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="h-[400px] w-full">
          {loading ? (
            <div className="flex items-center justify-center h-full">Loading...</div>
          ) : (
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 50, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" tick={{ fill: '#0B3B6B' }} />
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
                  radius={[4, 4, 0, 0]}
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
  );
};

export default StateARBreakdown;