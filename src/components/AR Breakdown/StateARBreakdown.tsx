import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
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
  let endDate = new Date();
  
  // Handle quarterly options (e.g., "Q1 2024 (Jan-Mar)")
  if (timeline.startsWith('Q')) {
    const quarterMatch = timeline.match(/Q(\d) (\d{4})/);
    if (quarterMatch) {
      const quarter = parseInt(quarterMatch[1]);
      const year = parseInt(quarterMatch[2]);
      
      // Set start and end dates for the quarter
      const quarterStartMonth = (quarter - 1) * 3; // 0, 3, 6, 9
      startDate = new Date(year, quarterStartMonth, 1);
      endDate = new Date(year, quarterStartMonth + 3, 0); // Last day of the quarter
    }
  } else {
    // Handle existing timeline options
    switch (timeline) {
      case 'Last Year':
        startDate.setFullYear(now.getFullYear() - 1);
        endDate = now;
        break;
      case 'Year to Date':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = now;
        break;
      default:
        return data;
    }
  }
  
  return data.filter(item => {
    if (!item.Date) return false;
    const itemDate = parseISO(item.Date);
    return itemDate >= startDate && itemDate <= endDate;
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

// Function to calculate average days to pay and payment probabilities
function calculatePaymentStats(chartData: any[], grandTotal: number) {
  // Mock calculation for average days to pay (in a real app, this would come from actual payment data)
  // Weight the days by the amount in each bucket
  const weightedDays = chartData.reduce((sum, bucket) => {
    let bucketDays = 0;
    
    // Assign average days for each bucket
    switch (bucket.category) {
      case 'Current':
        bucketDays = 15; // Average 15 days for current
        break;
      case '1 - 30':
        bucketDays = 45; // Average 45 days for 1-30 past due
        break;
      case '31-60':
        bucketDays = 75; // Average 75 days for 31-60 past due
        break;
      case '61-90':
        bucketDays = 105; // Average 105 days for 61-90 past due
        break;
      case '91+':
        bucketDays = 150; // Average 150 days for 91+ past due
        break;
    }
    
    return sum + (bucketDays * bucket.value);
  }, 0);
  
  const averageDaysToPay = grandTotal > 0 ? Math.round(weightedDays / grandTotal) : 0;
  
  // Calculate payment probability for each bucket using specified percentages
  const paymentProbabilities = chartData.map(bucket => {
    let probability = 0;
    
    switch (bucket.category) {
      case 'Current':
        probability = 33; // 33% chance of getting paid if current
        break;
      case '1 - 30':
        probability = 42; // 42% chance if 1-30 days past due
        break;
      case '31-60':
        probability = 12; // 12% chance if 31-60 days past due
        break;
      case '61-90':
        probability = 8; // 8% chance if 61-90 days past due
        break;
      case '91+':
        probability = 5; // 5% chance if 91+ days past due
        break;
    }
    
    return {
      category: bucket.category,
      probability: probability,
      color: bucket.color
    };
  });
  
  return {
    averageDaysToPay,
    paymentProbabilities
  };
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

  // Calculate payment statistics
  const { averageDaysToPay, paymentProbabilities } = calculatePaymentStats(chartData, grandTotal);

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

  // Process data for monthly overview chart - by month
  const processMonthlyData = () => {
    if (!filteredData || filteredData.length === 0) return [];
    
    // Create a map to store monthly totals
    const monthlyTotals: Record<string, {
      month: string,
      monthShort: string,
      monthYear: string,
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
      const monthShort = format(date, 'MMM');
      const monthYear = format(date, 'MMM-yy');
      
      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = {
          month: monthDisplay,
          monthShort: monthShort,
          monthYear: monthYear,
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

  // Create the data array for the horizontal bar chart by aging bucket
  const createAgingBucketData = () => {
    if (monthlyData.length === 0) return [];
    
    const result = [];
    for (const bucket of AGING_BUCKETS) {
      const bucketName = bucket.label;
      const bucketColor = bucket.color;
      
      const data: any = {
        name: bucketName,
        color: bucketColor,
      };
      
      // Add a property for each month
      monthlyData.forEach(month => {
        let bucketValue = 0;
        if (bucketName === 'Current') {
          bucketValue = month.Current;
        } else if (bucketName === '1 - 30') {
          bucketValue = month['1 - 30'];
        } else if (bucketName === '31-60') {
          bucketValue = month['31-60'];
        } else if (bucketName === '61-90') {
          bucketValue = month['61-90'];
        } else if (bucketName === '91+') {
          bucketValue = month['91+'];
        }
        
        // Store the value with the month short name as key
        data[month.monthShort] = bucketValue;
      });
      
      result.push(data);
    }
    
    return result;
  };

  const monthlyData = processMonthlyData();
  const agingBucketData = createAgingBucketData();
  const monthKeys = monthlyData.map(month => month.monthShort);
  
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
          
          {/* Payment Analysis Section - Clean and Compact */}
          {!loading && !error && filteredData.length > 0 && (
            <div className="mt-6 mb-8 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-5 border border-gray-200">
              {/* Section Header */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-primary mb-1">Payment Analysis</h3>
                <p className="text-sm text-gray-500 italic">Average payment timeline and probability by AR aging bucket</p>
              </div>
              
              {/* Compact Layout - Average Days and Probabilities in one row */}
              <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Average Days to Pay - Compact */}
                <div className="flex-shrink-0">
                  <div className="bg-white rounded-lg px-6 py-4 shadow-sm border border-gray-300">
                    <p className="text-gray-600 text-sm mb-1 text-center">Average Days to Pay</p>
                    <p className="text-2xl font-bold text-primary text-center">{averageDaysToPay} days</p>
                  </div>
                </div>
                
                {/* Payment Probability Grid - Compact */}
                <div className="flex-1">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {paymentProbabilities.map((bucket, index) => (
                      <div 
                        key={index}
                        className="bg-white border border-gray-300 rounded-lg p-3 text-center shadow-sm"
                      >
                        <div 
                          className="w-3 h-3 rounded-full mx-auto mb-2"
                          style={{ backgroundColor: bucket.color }}
                        ></div>
                        <p className="text-xs font-medium text-gray-700 mb-1">{bucket.category}</p>
                        <p className="text-lg font-bold text-primary">{bucket.probability}%</p>
                        <p className="text-xs text-gray-500">chance</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
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
          
          {/* Monthly AR Overview Section - Horizontal Bar Chart by Aging Bucket */}
          {!loading && !error && filteredData.length > 0 && monthlyData.length > 0 && (
            <div className="mt-10">
              <div className="mb-2">
                <h3 className="text-xl font-semibold text-primary">Monthly AR Overview</h3>
                <p className="text-sm text-gray-500 italic">
                  Showing months from {getTimelineRangeLabel()}
                </p>
              </div>
              
              <div className="h-[700px] w-full bg-white rounded-xl">
                <ResponsiveContainer>
                  <BarChart
                    data={agingBucketData}
                    layout="vertical"
                    margin={{ top: 30, right: 180, left: 120, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      type="number"
                      tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
                      tick={{ fill: '#0B3B6B', fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <YAxis 
                      dataKey="name"
                      type="category"
                      tick={{ fill: '#0B3B6B', fontSize: 14, fontWeight: 600 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                      width={100}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string) => {
                        // Use the exact same logic as the labels
                        const monthData = monthlyData.find(m => m.monthShort === name);
                        const monthYear = monthData ? monthData.monthYear : name;
                        return [`$${value.toLocaleString()}`, monthYear];
                      }}
                      labelFormatter={(label: string) => `${label} Aging Bucket`}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    
                    {/* Create a bar for each month */}
                    {monthKeys.map((monthKey, index) => (
                      <Bar
                        key={`month-${index}`}
                        dataKey={monthKey}
                        name={monthKey}
                        radius={[0, 4, 4, 0]}
                      >
                        {/* Assign the correct color to each bar based on the aging bucket */}
                        {agingBucketData.map((entry, bucketIndex) => (
                          <Cell 
                            key={`cell-${bucketIndex}-${index}`} 
                            fill={entry.color}
                          />
                        ))}
                        
                        {/* Add labels at the END of each bar using the EXACT same logic as tooltip */}
                        <LabelList
                          dataKey={monthKey}
                          content={(props: any) => {
                            const { x, y, width, height, value } = props;
                            
                            // Skip if no value or value is 0
                            if (!value || value <= 0) return null;
                            
                            // Use the EXACT SAME logic as tooltip - find the month data by monthKey
                            const monthData = monthlyData.find(m => m.monthShort === monthKey);
                            const monthYear = monthData ? monthData.monthYear : monthKey;
                            const formattedValue = `$${value.toLocaleString()}`;
                            
                            // Position at the END of the bar (to the right)
                            const labelX = x + width + 8;
                            const centerY = y + height / 2;
                            
                            return (
                              <g>
                                {/* Month-Year label */}
                                <text
                                  x={labelX}
                                  y={centerY - 6}
                                  fill="#0B3B6B"
                                  textAnchor="start"
                                  dominantBaseline="middle"
                                  fontSize={12}
                                  fontWeight="600"
                                >
                                  {monthYear}
                                </text>
                                {/* Dollar amount label */}
                                <text
                                  x={labelX}
                                  y={centerY + 8}
                                  fill="#6B7280"
                                  textAnchor="start"
                                  dominantBaseline="middle"
                                  fontSize={11}
                                  fontWeight="500"
                                >
                                  {formattedValue}
                                </text>
                              </g>
                            );
                          }}
                        />
                      </Bar>
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-2 text-sm text-gray-500 text-right">
                Showing data for {monthlyData.length} months across {AGING_BUCKETS.length} aging buckets
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StateARBreakdown;