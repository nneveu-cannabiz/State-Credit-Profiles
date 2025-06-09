import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { parseISO, format } from 'date-fns';
import { TimelineFilter } from '../Timeline/TimelineFilter';

// Mock data structure for debt collections - in a real app this would come from Supabase
interface DebtCollectionData {
  id: number;
  State: string | null;
  'Pre-Legal': string | null;
  'Legal': string | null;
  'Collections Agency': string | null;
  'Write-Off': string | null;
  Date: string | null;
}

const DEBT_COLLECTION_STAGES = [
  { label: 'Pre-Legal', color: 'rgb(59, 130, 246)' }, // Blue
  { label: 'Legal', color: 'rgb(245, 158, 11)' }, // Amber
  { label: 'Collections Agency', color: 'rgb(239, 68, 68)' }, // Red
  { label: 'Write-Off', color: 'rgb(107, 114, 128)' }, // Gray
];

function filterByTimeline(data: DebtCollectionData[], timeline: TimelineFilter): DebtCollectionData[] {
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

interface DebtCollectionsBreakdownProps {
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

// Mock data generator - in a real app this would fetch from Supabase
const generateMockDebtCollectionData = (state: string): DebtCollectionData[] => {
  const mockData: DebtCollectionData[] = [];
  const currentDate = new Date();
  
  // Generate data for the last 12 months
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);
    
    mockData.push({
      id: i + 1,
      State: state,
      'Pre-Legal': `$${(Math.random() * 2000000 + 500000).toFixed(0)}`,
      'Legal': `$${(Math.random() * 1500000 + 300000).toFixed(0)}`,
      'Collections Agency': `$${(Math.random() * 1000000 + 200000).toFixed(0)}`,
      'Write-Off': `$${(Math.random() * 800000 + 100000).toFixed(0)}`,
      Date: date.toISOString().split('T')[0]
    });
  }
  
  return mockData;
};

const DebtCollectionsBreakdown: React.FC<DebtCollectionsBreakdownProps> = ({ selectedState, selectedTimeline }) => {
  const [debtData, setDebtData] = useState<DebtCollectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data whenever selectedState changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    console.log(`Fetching debt collection data for state: "${selectedState}"`);
    
    // Simulate API call with mock data
    setTimeout(() => {
      try {
        const mockData = generateMockDebtCollectionData(selectedState);
        console.log(`Generated ${mockData.length} debt collection records for ${selectedState}`);
        setDebtData(mockData);
      } catch (err) {
        console.error('Error loading debt collection data:', err);
        setError(`Failed to load data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [selectedState]);

  // Filter data by timeline
  const filteredData = filterByTimeline(debtData, selectedTimeline);
  console.log(`Filtered debt collection data for ${selectedState} (${selectedTimeline}):`, filteredData.length, 'records');

  // Process data for the chart
  const chartData = DEBT_COLLECTION_STAGES.map(stage => {
    const stageKey = stage.label as keyof DebtCollectionData;
    
    // Sum up values for this stage across all filtered records
    const total = filteredData.reduce((sum, record) => {
      let value: string | null = null;
      
      if (stageKey === 'Pre-Legal') {
        value = record['Pre-Legal'];
      } else if (stageKey === 'Legal') {
        value = record['Legal'];
      } else if (stageKey === 'Collections Agency') {
        value = record['Collections Agency'];
      } else if (stageKey === 'Write-Off') {
        value = record['Write-Off'];
      }
      
      // Parse the amount and add to running total
      return sum + parseAmount(value);
    }, 0);
    
    console.log(`Total for ${stage.label}: $${total.toLocaleString()}`);
    
    return {
      category: stage.label,
      value: total,
      color: stage.color
    };
  });

  // Calculate grand total for percentage calculation and overview stats
  const grandTotal = chartData.reduce((sum, item) => sum + item.value, 0);

  // Sample data for Total Cases
  const totalCases = 342;

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
      'Pre-Legal': number,
      'Legal': number,
      'Collections Agency': number,
      'Write-Off': number,
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
          'Pre-Legal': 0,
          'Legal': 0,
          'Collections Agency': 0,
          'Write-Off': 0,
          Total: 0
        };
      }
      
      // Add values from each stage
      monthlyTotals[monthKey]['Pre-Legal'] += parseAmount(record['Pre-Legal']);
      monthlyTotals[monthKey]['Legal'] += parseAmount(record['Legal']);
      monthlyTotals[monthKey]['Collections Agency'] += parseAmount(record['Collections Agency']);
      monthlyTotals[monthKey]['Write-Off'] += parseAmount(record['Write-Off']);
      
      // Calculate total
      monthlyTotals[monthKey].Total = 
        monthlyTotals[monthKey]['Pre-Legal'] +
        monthlyTotals[monthKey]['Legal'] +
        monthlyTotals[monthKey]['Collections Agency'] +
        monthlyTotals[monthKey]['Write-Off'];
    });
    
    // Convert to array and sort by date
    return Object.values(monthlyTotals).sort((a, b) => a.timestamp - b.timestamp);
  };

  // Create the data array for the horizontal bar chart by debt collection stage
  const createDebtStageData = () => {
    if (monthlyData.length === 0) return [];
    
    const result = [];
    for (const stage of DEBT_COLLECTION_STAGES) {
      const stageName = stage.label;
      const stageColor = stage.color;
      
      const data: any = {
        name: stageName,
        color: stageColor,
      };
      
      // Add a property for each month
      monthlyData.forEach(month => {
        let stageValue = 0;
        if (stageName === 'Pre-Legal') {
          stageValue = month['Pre-Legal'];
        } else if (stageName === 'Legal') {
          stageValue = month['Legal'];
        } else if (stageName === 'Collections Agency') {
          stageValue = month['Collections Agency'];
        } else if (stageName === 'Write-Off') {
          stageValue = month['Write-Off'];
        }
        
        // Store the value with the month short name as key
        data[month.monthShort] = stageValue;
      });
      
      result.push(data);
    }
    
    return result;
  };

  const monthlyData = processMonthlyData();
  const debtStageData = createDebtStageData();
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
            <h2 className="text-3xl font-bold text-primary">Debt Collections Breakdown</h2>
            
            {!loading && !error && filteredData.length > 0 && (
              <div className="mt-2 mb-1 flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px] bg-primary-lighter rounded-xl p-3">
                  <p className="text-gray-600 text-sm mb-1">Total Debt in Collections</p>
                  <p className="text-3xl font-bold text-primary">${grandTotal.toLocaleString()}</p>
                </div>
                <div className="flex-1 min-w-[200px] bg-primary-lighter rounded-xl p-3">
                  <p className="text-gray-600 text-sm mb-1">Total Cases</p>
                  <p className="text-3xl font-bold text-primary">{totalCases}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Collection Stages Subheader */}
          <div className="mt-12 mb-2">
            <h3 className="text-xl font-semibold text-primary">Collection Stages</h3>
            <p className="text-sm text-gray-500 italic">Totals in each Collection Stage for {selectedTimeline}</p>
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
                <p className="text-gray-600">No debt collection data available for {selectedState}.</p>
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
                    labelFormatter={(label: string) => `${label} Stage`}
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
          
          {/* Monthly Debt Collections Overview Section - Horizontal Bar Chart by Collection Stage */}
          {!loading && !error && filteredData.length > 0 && monthlyData.length > 0 && (
            <div className="mt-10">
              <div className="mb-2">
                <h3 className="text-xl font-semibold text-primary">Monthly Collections Overview</h3>
                <p className="text-sm text-gray-500 italic">
                  Showing months from {getTimelineRangeLabel()}
                </p>
              </div>
              
              <div className="h-[500px] w-full bg-white rounded-xl">
                <ResponsiveContainer>
                  <BarChart
                    data={debtStageData}
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
                      labelFormatter={(label: string) => `${label} Collection Stage`}
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
                        {/* Assign the correct color to each bar based on the collection stage */}
                        {debtStageData.map((entry, stageIndex) => (
                          <Cell 
                            key={`cell-${stageIndex}-${index}`} 
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
                Showing data for {monthlyData.length} months across {DEBT_COLLECTION_STAGES.length} collection stages
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebtCollectionsBreakdown;