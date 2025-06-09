import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from 'recharts';
import { parseISO, format } from 'date-fns';
import { TimelineFilter } from '../Timeline/TimelineFilter';

// Mock data structure for debt collections - in a real app this would come from Supabase
interface DebtCollectionData {
  id: number;
  State: string | null;
  'Open - Pursuing': string | null;
  'Payment Plan': string | null;
  'Closed - Unpaid': string | null;
  'Closed - Settled for Less': string | null;
  'Closed - Paid in Full': string | null;
  Date: string | null;
}

// Mock data structure for legal outcomes
interface LegalOutcomeData {
  id: number;
  State: string | null;
  'Total Collections': string | null;
  'Sent to Collections': string | null;
  Date: string | null;
}

const DEBT_COLLECTION_STAGES = [
  { label: 'Open - Pursuing', color: 'rgb(59, 130, 246)' }, // Blue
  { label: 'Payment Plan', color: 'rgb(16, 185, 129)' }, // Green
  { label: 'Closed - Unpaid', color: 'rgb(239, 68, 68)' }, // Red
  { label: 'Closed - Settled for Less', color: 'rgb(245, 158, 11)' }, // Amber
  { label: 'Closed - Paid in Full', color: 'rgb(34, 197, 94)' }, // Emerald
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

function filterLegalOutcomesByTimeline(data: LegalOutcomeData[], timeline: TimelineFilter): LegalOutcomeData[] {
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

// Mock data generator for debt collections - in a real app this would fetch from Supabase
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
      'Open - Pursuing': `$${(Math.random() * 1500000 + 300000).toFixed(0)}`,
      'Payment Plan': `$${(Math.random() * 800000 + 200000).toFixed(0)}`,
      'Closed - Unpaid': `$${(Math.random() * 600000 + 100000).toFixed(0)}`,
      'Closed - Settled for Less': `$${(Math.random() * 900000 + 150000).toFixed(0)}`,
      'Closed - Paid in Full': `$${(Math.random() * 1200000 + 400000).toFixed(0)}`,
      Date: date.toISOString().split('T')[0]
    });
  }
  
  return mockData;
};

// Mock data generator for legal outcomes
const generateMockLegalOutcomeData = (state: string): LegalOutcomeData[] => {
  const mockData: LegalOutcomeData[] = [];
  const currentDate = new Date();
  
  // Generate quarterly data for the last 8 quarters
  for (let i = 0; i < 8; i++) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - (i * 3)); // Go back by quarters
    
    const totalCollections = Math.random() * 5000000 + 2000000;
    const sentToCollections = totalCollections * (0.6 + Math.random() * 0.3); // 60-90% of total
    
    mockData.push({
      id: i + 1,
      State: state,
      'Total Collections': `$${totalCollections.toFixed(0)}`,
      'Sent to Collections': `$${sentToCollections.toFixed(0)}`,
      Date: date.toISOString().split('T')[0]
    });
  }
  
  return mockData;
};

const DebtCollectionsBreakdown: React.FC<DebtCollectionsBreakdownProps> = ({ selectedState, selectedTimeline }) => {
  const [debtData, setDebtData] = useState<DebtCollectionData[]>([]);
  const [legalOutcomeData, setLegalOutcomeData] = useState<LegalOutcomeData[]>([]);
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
        const mockDebtData = generateMockDebtCollectionData(selectedState);
        const mockLegalData = generateMockLegalOutcomeData(selectedState);
        console.log(`Generated ${mockDebtData.length} debt collection records for ${selectedState}`);
        console.log(`Generated ${mockLegalData.length} legal outcome records for ${selectedState}`);
        setDebtData(mockDebtData);
        setLegalOutcomeData(mockLegalData);
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
  const filteredLegalData = filterLegalOutcomesByTimeline(legalOutcomeData, selectedTimeline);
  console.log(`Filtered debt collection data for ${selectedState} (${selectedTimeline}):`, filteredData.length, 'records');

  // Process data for the chart
  const chartData = DEBT_COLLECTION_STAGES.map(stage => {
    const stageKey = stage.label as keyof DebtCollectionData;
    
    // Sum up values for this stage across all filtered records
    const total = filteredData.reduce((sum, record) => {
      let value: string | null = null;
      
      if (stageKey === 'Open - Pursuing') {
        value = record['Open - Pursuing'];
      } else if (stageKey === 'Payment Plan') {
        value = record['Payment Plan'];
      } else if (stageKey === 'Closed - Unpaid') {
        value = record['Closed - Unpaid'];
      } else if (stageKey === 'Closed - Settled for Less') {
        value = record['Closed - Settled for Less'];
      } else if (stageKey === 'Closed - Paid in Full') {
        value = record['Closed - Paid in Full'];
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

  // Process legal outcome data for quarterly comparison chart
  const processLegalOutcomeData = () => {
    if (!filteredLegalData || filteredLegalData.length === 0) return [];
    
    // Create a map to store quarterly totals
    const quarterlyTotals: Record<string, {
      quarter: string,
      quarterShort: string,
      timestamp: number,
      totalCollections: number,
      sentToCollections: number
    }> = {};
    
    // Process each record and aggregate by quarter
    filteredLegalData.forEach(record => {
      if (!record.Date) return;
      
      const date = parseISO(record.Date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const quarter = Math.floor(month / 3) + 1;
      const quarterKey = `${year}-Q${quarter}`;
      const quarterDisplay = `Q${quarter} ${year}`;
      const quarterShort = `Q${quarter}-${year.toString().slice(-2)}`;
      
      if (!quarterlyTotals[quarterKey]) {
        quarterlyTotals[quarterKey] = {
          quarter: quarterDisplay,
          quarterShort: quarterShort,
          timestamp: date.getTime(),
          totalCollections: 0,
          sentToCollections: 0
        };
      }
      
      // Add values
      quarterlyTotals[quarterKey].totalCollections += parseAmount(record['Total Collections']);
      quarterlyTotals[quarterKey].sentToCollections += parseAmount(record['Sent to Collections']);
    });
    
    // Convert to array and sort by date
    return Object.values(quarterlyTotals).sort((a, b) => a.timestamp - b.timestamp);
  };

  const legalOutcomeChartData = processLegalOutcomeData();
  
  // Get start and end quarter for the subtitle
  const getLegalOutcomeRangeLabel = () => {
    if (legalOutcomeChartData.length === 0) return "";
    if (legalOutcomeChartData.length === 1) return legalOutcomeChartData[0].quarter;
    const firstQuarter = legalOutcomeChartData[0].quarter;
    const lastQuarter = legalOutcomeChartData[legalOutcomeChartData.length - 1].quarter;
    return `${firstQuarter} - ${lastQuarter}`;
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
          
          {/* Legal Outcomes Overview Section */}
          {!loading && !error && filteredLegalData.length > 0 && legalOutcomeChartData.length > 0 && (
            <div className="mt-10">
              <div className="mb-2">
                <h3 className="text-xl font-semibold text-primary">Legal Outcomes Overview</h3>
                <p className="text-sm text-gray-500 italic">
                  Quarterly comparison: Total Collections vs. Sent to Collections ({getLegalOutcomeRangeLabel()})
                </p>
              </div>
              
              <div className="h-[400px] w-full bg-white rounded-xl">
                <ResponsiveContainer>
                  <LineChart
                    data={legalOutcomeChartData}
                    margin={{ top: 30, right: 30, left: 30, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="quarterShort"
                      tick={{ fill: '#0B3B6B', fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <YAxis
                      tickFormatter={(value: number) => `$${(value / 1000000).toFixed(1)}M`}
                      tick={{ fill: '#0B3B6B', fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `$${value.toLocaleString()}`, 
                        name === 'totalCollections' ? 'Total Collections' : 'Sent to Collections'
                      ]}
                      labelFormatter={(label: string) => {
                        const quarterData = legalOutcomeChartData.find(q => q.quarterShort === label);
                        return quarterData ? quarterData.quarter : label;
                      }}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="line"
                    />
                    
                    <Line
                      type="monotone"
                      dataKey="totalCollections"
                      stroke="rgb(59, 130, 246)"
                      strokeWidth={3}
                      dot={{ fill: 'rgb(59, 130, 246)', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: 'rgb(59, 130, 246)', strokeWidth: 2 }}
                      name="Total Collections"
                    />
                    <Line
                      type="monotone"
                      dataKey="sentToCollections"
                      stroke="rgb(239, 68, 68)"
                      strokeWidth={3}
                      dot={{ fill: 'rgb(239, 68, 68)', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: 'rgb(239, 68, 68)', strokeWidth: 2 }}
                      name="Sent to Collections"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-2 text-sm text-gray-500 text-right">
                Showing quarterly data for {legalOutcomeChartData.length} quarters
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebtCollectionsBreakdown;