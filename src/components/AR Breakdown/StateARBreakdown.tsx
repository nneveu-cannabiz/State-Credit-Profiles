import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend, Area, AreaChart } from 'recharts';
import { fetchStateARData, ARData } from '../../lib/supabase';
import { parseISO, format } from 'date-fns';
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

  // Process data for monthly overview chart
  const processMonthlyData = () => {
    if (!filteredData || filteredData.length === 0) return [];
    
    // Create a map to store monthly totals
    const monthlyTotals: Record<string, {
      month: string,
      timestamp: number,
      Current: number,
      '1 - 30': number,
      '31-60': number,
      '61-90': number,
      '91+': number,
      Total: number
    }> = {};
    
    // Process each record and aggregate by month
    filteredData.forEach(record => {
      if (!record.Date) return;
      
      const date = parseISO(record.Date);
      const monthKey = format(date, 'yyyy-MM');
      const monthDisplay = format(date, 'MMM yyyy');
      
      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = {
          month: monthDisplay,
          timestamp: date.getTime(),
          Current: 0,
          '1 - 30': 0,
          '31-60': 0,
          '61-90': 0,
          '91+': 0,
          Total: 0
        };
      }
      
      // Add values from each bucket
      monthlyTotals[monthKey].Current += parseAmount(record.Current);
      monthlyTotals[monthKey]['1 - 30'] += parseAmount(record['1 - 30']);
      monthlyTotals[monthKey]['31-60'] += parseAmount(record['31-60']);
      monthlyTotals[monthKey]['61-90'] += parseAmount(record['61-90']);
      monthlyTotals[monthKey]['91+'] += parseAmount(record['91+']);
      
      // Calculate total
      monthlyTotals[monthKey].Total = 
        monthlyTotals[monthKey].Current +
        monthlyTotals[monthKey]['1 - 30'] +
        monthlyTotals[monthKey]['31-60'] +
        monthlyTotals[monthKey]['61-90'] +
        monthlyTotals[monthKey]['91+'];
    });
    
    // Convert to array and sort by date
    return Object.values(monthlyTotals).sort((a, b) => a.timestamp - b.timestamp);
  };
  
  const monthlyData = processMonthlyData();
  
  // Get start and end month for the subtitle
  const getTimelineRangeLabel = () => {
    if (monthlyData.length === 0) return "";
    if (monthlyData.length === 1) return monthlyData[0].month;
    const firstMonth = monthlyData[0].month;
    const lastMonth = monthlyData[monthlyData.length - 1].month;
    return `${firstMonth} - ${lastMonth}`;
  };

  return (
    <div className="flex flex-col p-6 bg-gradient-to-br from-white to-gray-50 min-h-[600px]">
      <div className="container max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
          <div className="mb-1">
            <h2 className="text-3xl font-bold text-primary">Accounts Receivables Breakdown</h2>
            
            {!loading && !error && filteredData.length > 0 && (
              <div className="mt-2 mb-1 flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px] bg-primary-lighter rounded-xl p-3">
                  <p className="text-gray-600 text-sm mb-1">Total AR Reported</p>
                  <p className="text-3xl font-bold text-primary">${grandTotal.toLocaleString()}</p>
                </div>
                <div className="flex-1 min-w-[200px] bg-primary-lighter rounded-xl p-3">
                  <p className="text-gray-600 text-sm mb-1">Total Members Reporting</p>
                  <p className="text-3xl font-bold text-primary">{totalMembersReporting}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* AR Aging Subheader */}
          <div className="mt-12 mb-2">
            <h3 className="text-xl font-semibold text-primary">AR Aging</h3>
            <p className="text-sm text-gray-500 italic">Totals in each AR Category for {selectedTimeline}</p>
          </div>
          
          <div className="h-[400px] w-full bg-white rounded-xl p-0">
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
                  margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
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
            <div className="mt-2 text-sm text-gray-500 text-right">
              Showing {filteredData.length} records for {selectedState}
            </div>
          )}
          
          {/* Monthly AR Overview Section */}
          {!loading && !error && filteredData.length > 0 && monthlyData.length > 0 && (
            <div className="mt-10">
              <div className="mb-2">
                <h3 className="text-xl font-semibold text-primary">Monthly AR Overview</h3>
                <p className="text-sm text-gray-500 italic">
                  Showing months from {getTimelineRangeLabel()}
                </p>
              </div>
              
              <div className="h-[400px] w-full bg-white rounded-xl">
                <ResponsiveContainer>
                  <AreaChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#0B3B6B', fontSize: 14 }} 
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <YAxis 
                      tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
                      width={80}
                      tick={{ fill: '#0B3B6B', fontSize: 14 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="Current" 
                      stackId="1" 
                      stroke={AGING_BUCKETS[0].color} 
                      fill={AGING_BUCKETS[0].color} 
                      name="Current"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="1 - 30" 
                      stackId="1" 
                      stroke={AGING_BUCKETS[1].color} 
                      fill={AGING_BUCKETS[1].color} 
                      name="1-30 Days"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="31-60" 
                      stackId="1" 
                      stroke={AGING_BUCKETS[2].color} 
                      fill={AGING_BUCKETS[2].color} 
                      name="31-60 Days"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="61-90" 
                      stackId="1" 
                      stroke={AGING_BUCKETS[3].color} 
                      fill={AGING_BUCKETS[3].color} 
                      name="61-90 Days"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="91+" 
                      stackId="1" 
                      stroke={AGING_BUCKETS[4].color} 
                      fill={AGING_BUCKETS[4].color} 
                      name="91+ Days"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-2 text-sm text-gray-500 text-right">
                Showing monthly data for {monthlyData.length} months
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StateARBreakdown;