import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend, PieChart, Pie, LabelList } from 'recharts';
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
  'Legal Action Taken': string | null;
  'Legal Action Not Needed': string | null;
  'Legal Action - Paid in Full': string | null;
  'Legal Action - Settled for Less': string | null;
  'Legal Action - Payment Plan': string | null;
  'Legal Action - Unpaid': string | null;
  Date: string | null;
}

const DEBT_COLLECTION_STAGES = [
  { label: 'Open - Pursuing', color: 'rgb(255, 222, 89)' }, // Yellow
  { label: 'Payment Plan', color: 'rgb(253, 199, 117)' }, // Darker yellow/orange
  { label: 'Closed - Unpaid', color: 'rgb(239, 68, 68)' }, // Red
  { label: 'Closed - Settled for Less', color: 'rgb(245, 158, 11)' }, // Amber
  { label: 'Closed - Paid in Full', color: 'rgb(34, 197, 94)' }, // Emerald
];

const LEGAL_ACTION_COLORS = [
  { label: 'Legal Action Taken', color: '#ACC4E2' }, // Primary medium
  { label: 'Legal Action Not Needed/Or Taken Yet', color: '#EEF3F9' }, // Primary light
];

const LEGAL_OUTCOME_COLORS = [
  { label: 'Legal Action - Paid in Full', color: 'rgb(34, 197, 94)' }, // Green
  { label: 'Legal Action - Settled for Less', color: 'rgb(245, 158, 11)' }, // Amber
  { label: 'Legal Action - Payment Plan', color: 'rgb(255, 222, 89)' }, // Yellow
  { label: 'Legal Action - Unpaid', color: 'rgb(239, 68, 68)' }, // Red
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
    
    // For legal action split - typically 30-50% require legal action
    const legalActionTaken = sentToCollections * (0.3 + Math.random() * 0.2);
    const legalActionNotNeeded = sentToCollections - legalActionTaken;
    
    // Break down legal action outcomes
    const paidInFull = legalActionTaken * (0.25 + Math.random() * 0.15); // 25-40%
    const settledForLess = legalActionTaken * (0.20 + Math.random() * 0.15); // 20-35%
    const paymentPlan = legalActionTaken * (0.15 + Math.random() * 0.10); // 15-25%
    const unpaid = legalActionTaken - paidInFull - settledForLess - paymentPlan; // Remainder
    
    mockData.push({
      id: i + 1,
      State: state,
      'Total Collections': `$${totalCollections.toFixed(0)}`,
      'Sent to Collections': `$${sentToCollections.toFixed(0)}`,
      'Legal Action Taken': `$${legalActionTaken.toFixed(0)}`,
      'Legal Action Not Needed': `$${legalActionNotNeeded.toFixed(0)}`,
      'Legal Action - Paid in Full': `$${paidInFull.toFixed(0)}`,
      'Legal Action - Settled for Less': `$${settledForLess.toFixed(0)}`,
      'Legal Action - Payment Plan': `$${paymentPlan.toFixed(0)}`,
      'Legal Action - Unpaid': `$${unpaid.toFixed(0)}`,
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

  // Process legal action data for pie chart
  const processLegalActionData = () => {
    if (!filteredLegalData || filteredLegalData.length === 0) return [];
    
    // Sum up totals across all filtered records
    const totals = filteredLegalData.reduce((acc, record) => {
      acc.legalActionTaken += parseAmount(record['Legal Action Taken']);
      acc.legalActionNotNeeded += parseAmount(record['Legal Action Not Needed']);
      return acc;
    }, { legalActionTaken: 0, legalActionNotNeeded: 0 });
    
    // Calculate total for percentages
    const total = totals.legalActionTaken + totals.legalActionNotNeeded;
    
    // Generate mock case counts (in a real app, this would come from the database)
    const generateCaseCount = (amount: number) => Math.floor(amount / 15000) + Math.floor(Math.random() * 20);
    
    return [
      {
        name: 'Legal Action Taken',
        value: totals.legalActionTaken,
        color: '#ACC4E2', // Primary medium
        caseCount: generateCaseCount(totals.legalActionTaken),
        percentage: total > 0 ? ((totals.legalActionTaken / total) * 100).toFixed(1) : '0.0'
      },
      {
        name: 'Legal Action Not Needed/Or Taken Yet',
        value: totals.legalActionNotNeeded,
        color: '#EEF3F9', // Primary light
        caseCount: generateCaseCount(totals.legalActionNotNeeded),
        percentage: total > 0 ? ((totals.legalActionNotNeeded / total) * 100).toFixed(1) : '0.0'
      }
    ];
  };

  // Process legal collection outcomes data for bar chart
  const processLegalCollectionOutcomes = () => {
    if (!filteredLegalData || filteredLegalData.length === 0) return [];
    
    // Sum up totals across all filtered records
    const totals = filteredLegalData.reduce((acc, record) => {
      acc.paidInFull += parseAmount(record['Legal Action - Paid in Full']);
      acc.settledForLess += parseAmount(record['Legal Action - Settled for Less']);
      acc.paymentPlan += parseAmount(record['Legal Action - Payment Plan']);
      acc.unpaid += parseAmount(record['Legal Action - Unpaid']);
      return acc;
    }, { 
      paidInFull: 0, 
      settledForLess: 0, 
      paymentPlan: 0, 
      unpaid: 0 
    });

    // Calculate total for percentages
    const total = totals.paidInFull + totals.settledForLess + totals.paymentPlan + totals.unpaid;
    
    // Generate mock case counts (in a real app, this would come from the database)
    const generateCaseCount = (amount: number) => Math.floor(amount / 15000) + Math.floor(Math.random() * 20);
    
    return LEGAL_OUTCOME_COLORS.map(outcome => {
      let value = 0;
      let caseCount = 0;
      
      if (outcome.label === 'Legal Action - Paid in Full') {
        value = totals.paidInFull;
        caseCount = generateCaseCount(value);
      } else if (outcome.label === 'Legal Action - Settled for Less') {
        value = totals.settledForLess;
        caseCount = generateCaseCount(value);
      } else if (outcome.label === 'Legal Action - Payment Plan') {
        value = totals.paymentPlan;
        caseCount = generateCaseCount(value);
      } else if (outcome.label === 'Legal Action - Unpaid') {
        value = totals.unpaid;
        caseCount = generateCaseCount(value);
      }
      
      const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
      
      return {
        category: outcome.label,
        value: value,
        color: outcome.color,
        caseCount: caseCount,
        percentage: percentage
      };
    });
  };

  const legalActionPieData = processLegalActionData();
  const legalOutcomesData = processLegalCollectionOutcomes();
  
  // Custom label renderer for legal outcomes bar chart
  const renderLegalOutcomeLabel = ({ x, y, width, value, payload }: any) => {
    // Add null check for payload and ensure value is greater than 0
    if (!payload || value <= 0) {
      return null;
    }
    
    return (
      <g>
        {/* Dollar amount */}
        <text 
          x={x + width / 2} 
          y={y - 36} 
          fill="#0B3B6B" 
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={12}
          fontWeight="600"
        >
          ${value.toLocaleString()}
        </text>
        {/* Case count */}
        <text 
          x={x + width / 2} 
          y={y - 22} 
          fill="#5A6776" 
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={11}
          fontWeight="500"
        >
          {payload.caseCount} cases
        </text>
        {/* Percentage */}
        <text 
          x={x + width / 2} 
          y={y - 8} 
          fill="#5A6776" 
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={11}
          fontWeight="500"
        >
          {payload.percentage}%
        </text>
      </g>
    );
  };

  // Custom label renderer for pie chart - displays category name and percentage inside slices
  const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Split the name into multiple lines for better readability
    const words = name.split(' ');
    const lines = [];
    
    if (words.length <= 3) {
      lines.push(words.join(' '));
    } else {
      // Split into two lines
      const midPoint = Math.ceil(words.length / 2);
      lines.push(words.slice(0, midPoint).join(' '));
      lines.push(words.slice(midPoint).join(' '));
    }

    // Calculate the total height needed for all text elements
    const lineHeight = 14;
    const spaceBetweenLabelAndPercent = 8;
    const totalTextHeight = (lines.length * lineHeight) + spaceBetweenLabelAndPercent + lineHeight;
    
    // Start position - center the entire text block vertically
    const startY = y - (totalTextHeight / 2) + (lineHeight / 2);

    return (
      <g>
        {/* Category name lines */}
        {lines.map((line, index) => (
          <text 
            key={index}
            x={x} 
            y={startY + (index * lineHeight)} 
            fill="#0B3B6B" 
            textAnchor="middle" 
            dominantBaseline="central"
            fontSize={11}
            fontWeight="600"
          >
            {line}
          </text>
        ))}
        
        {/* Percentage - positioned with proper spacing below the category name */}
        <text 
          x={x} 
          y={startY + (lines.length * lineHeight) + spaceBetweenLabelAndPercent} 
          fill="#0B3B6B" 
          textAnchor="middle" 
          dominantBaseline="central"
          fontSize={13}
          fontWeight="700"
        >
          {`${(percent * 100).toFixed(1)}%`}
        </text>
      </g>
    );
  };

  // Custom tooltip for pie chart with enhanced information
  const renderPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-800 mb-2">{data.name}</p>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600">
              <span className="font-medium">Total Value:</span> ${data.value.toLocaleString()}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Total Cases:</span> {data.caseCount}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Percentage:</span> {data.percentage}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5">
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
      
      <div className="h-[500px] w-full bg-white rounded-xl p-0">
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
              margin={{ top: 60, right: 30, left: 30, bottom: 5 }}
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
      {!loading && !error && filteredLegalData.length > 0 && legalOutcomesData.length > 0 && (
        <div className="mt-10">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-primary">Legal Outcomes Overview</h3>
            <p className="text-sm text-gray-500 italic">
              Analysis of collections requiring legal action for {selectedTimeline}
            </p>
          </div>
          
          {/* Two charts side by side - Pie chart on left, Bar chart on right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart - Legal Action Split (LEFT) */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-lg font-medium text-primary mb-2">Legal Action Distribution</h4>
              <div className="h-[350px] w-full">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={legalActionPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderPieLabel}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {legalActionPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={renderPieTooltip} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart - Legal Collection Outcomes (RIGHT) */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-lg font-medium text-primary mb-2">Legal Collection Outcomes Overview</h4>
              <div className="h-[350px] w-full">
                <ResponsiveContainer>
                  <BarChart
                    data={legalOutcomesData}
                    margin={{ top: 50, right: 20, left: 20, bottom: 80 }}
                    barCategoryGap={15}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="category"
                      tick={{ fill: '#0B3B6B', fontSize: 10 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis
                      tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
                      tick={{ fill: '#0B3B6B', fontSize: 11 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string, props: any) => [
                        `$${value.toLocaleString()} (${props.payload.caseCount} cases, ${props.payload.percentage}%)`, 
                        'Amount'
                      ]}
                      labelFormatter={(label: string) => label}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    
                    <Bar
                      dataKey="value"
                      radius={[4, 4, 0, 0]}
                      name="Amount"
                      isAnimationActive={false}
                      label={renderLegalOutcomeLabel}
                    >
                      {legalOutcomesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-500 text-right">
            Showing legal outcome data for {filteredLegalData.length} records
          </div>
        </div>
      )}
    </div>
  );
};

export default DebtCollectionsBreakdown;