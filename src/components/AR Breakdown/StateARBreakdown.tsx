import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { fetchStateARData, ARData } from '../../lib/supabase';
import { parseISO } from 'date-fns';
import { TimelineFilter } from '../Timeline/TimelineFilter';

const AGING_BUCKETS = [
  { label: 'Current', color: 'rgb(81, 207, 146)' },
  { label: '1 - 30', color: 'rgb(255, 222, 89)' },
  { label: '31-60', color: 'rgb(253, 199, 117)' },
  { label: '61-90', color: 'rgb(255, 145, 77)' },
  { label: '91+', color: 'rgb(255, 87, 87)' },
];

function filterByTimeline(data: ARData[], timeline: TimelineFilter): ARData[] {
  if (timeline === 'All Time') return data;
  const now = new Date();
  let startDate = new Date();
  switch (timeline) {
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

interface StateARBreakdownProps {
  selectedState: string;
  selectedTimeline: TimelineFilter;
}

// Function to safely parse currency strings like "$7,000,000"
function parseAmount(value: string | null): number {
  if (!value) return 0;
  
  try {
    // Remove dollar signs and commas
    const cleanValue = value.replace(/[$,]/g, '');
    const amount = parseFloat(cleanValue);
    return isNaN(amount) ? 0 : amount;
  } catch (err) {
    console.error('Error parsing amount:', value, err);
    return 0;
  }
}

const StateARBreakdown: React.FC<StateARBreakdownProps> = ({ selectedState, selectedTimeline }) => {
  const [arData, setARData] = useState<ARData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data whenever selectedState changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    console.log(`Fetching AR data for state: "${selectedState}"`);
    
    fetchStateARData(selectedState)
      .then(data => {
        console.log(`Received ${data.length} records for ${selectedState}`);
        setARData(data);
      })
      .catch(err => {
        console.error('Error loading AR data:', err);
        setError(`Failed to load data: ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, [selectedState]);

  // Filter data by timeline
  const filteredData = filterByTimeline(arData, selectedTimeline);
  console.log(`Filtered data for ${selectedState} (${selectedTimeline}):`, filteredData.length, 'records');

  // Process data for the chart
  const chartData = AGING_BUCKETS.map(bucket => {
    const bucketKey = bucket.label as keyof ARData;
    
    // Sum up values for this bucket across all filtered records
    const total = filteredData.reduce((sum, record) => {
      // Handle specific column names with brackets notation for special characters
      let value: string | null = null;
      
      if (bucketKey === 'Current') {
        value = record.Current;
      } else if (bucketKey === '1 - 30') {
        value = record['1 - 30'];
      } else if (bucketKey === '31-60') {
        value = record['31-60'];
      } else if (bucketKey === '61-90') {
        value = record['61-90'];
      } else if (bucketKey === '91+') {
        value = record['91+'];
      }
      
      // Parse the amount and add to running total
      return sum + parseAmount(value);
    }, 0);
    
    console.log(`Total for ${bucket.label}: $${total.toLocaleString()}`);
    
    return {
      category: bucket.label,
      value: total,
      color: bucket.color
    };
  });

  // Calculate grand total for percentage calculation and overview stats
  const grandTotal = chartData.reduce((sum, item) => sum + item.value, 0);

  // Sample data for Total Members Reporting
  const totalMembersReporting = 85;

  // Custom label renderer that shows both amount and percentage
  const renderCustomBarLabel = ({ x, y, width, value }: any) => {
    // Calculate percentage of total
    const percentage = grandTotal > 0 ? ((value / grandTotal) * 100).toFixed(1) : '0.0';
    
    return value > 0 ? (
      <g>
        {/* Dollar amount */}
        <text 
          x={x + width / 2} 
          y={y - 24} 
          fill="#0B3B6B" 
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={14}
          fontWeight="600"
        >
          ${value.toLocaleString()}
        </text>
        {/* Percentage */}
        <text 
          x={x + width / 2} 
          y={y - 8} 
          fill="#5A6776" 
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={12}
          fontWeight="500"
        >
          {percentage}%
        </text>
      </g>
    ) : null;
  };

  return (
    <div className="flex flex-col p-8 bg-gradient-to-br from-white to-gray-50 min-h-[600px]">
      <div className="container max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="mb-2">
            <h2 className="text-3xl font-bold text-primary">Accounts Receivables Breakdown</h2>
            
            {!loading && !error && filteredData.length > 0 && (
              <div className="mt-4 mb-2 flex flex-wrap gap-6">
                <div className="flex-1 min-w-[200px] bg-primary-lighter rounded-xl p-4">
                  <p className="text-gray-600 text-sm mb-1">Total AR Reported</p>
                  <p className="text-3xl font-bold text-primary">${grandTotal.toLocaleString()}</p>
                </div>
                <div className="flex-1 min-w-[200px] bg-primary-lighter rounded-xl p-4">
                  <p className="text-gray-600 text-sm mb-1">Total Members Reporting</p>
                  <p className="text-3xl font-bold text-primary">{totalMembersReporting}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* AR Aging Subheader */}
          <div className="mb-2">
            <h3 className="text-xl font-semibold text-primary">AR Aging</h3>
            <p className="text-sm text-gray-500 italic">Totals in each AR Category for {selectedTimeline}</p>
          </div>
          
          <div className="h-[450px] w-full bg-white rounded-xl p-1">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Loading data...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-red-500">{error}</p>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-600">No data available for {selectedState}.</p>
              </div>
            ) : (
              <ResponsiveContainer>
                <BarChart 
                  data={chartData} 
                  margin={{ top: 60, right: 30, left: 50, bottom: 5 }}
                  barCategoryGap={20}
                >
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
                    dataKey="value"
                    radius={[8, 8, 0, 0]}
                    name="Amount"
                    isAnimationActive={false}
                    label={renderCustomBarLabel}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          {!loading && !error && filteredData.length > 0 && (
            <div className="mt-4 text-sm text-gray-500 text-right">
              Showing {filteredData.length} records for {selectedState}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StateARBreakdown;