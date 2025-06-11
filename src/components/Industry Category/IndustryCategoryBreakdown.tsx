import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TimelineFilter } from '../Timeline/TimelineFilter';

// Industry categories that our members belong to
const INDUSTRY_CATEGORIES = [
  'Cultivation',
  'Distribution', 
  'Manufacturing',
  'Packaging',
  'Software',
  'Financial Funding Services',
  'Delivery'
];

// License types that companies have
const LICENSE_TYPES = [
  'Manufacturer',
  'Cultivator', 
  'Retailer'
];

interface IndustryCategoryBreakdownProps {
  selectedState: string;
  selectedTimeline: TimelineFilter;
}

// Mock data structure for industry category payment data
interface IndustryPaymentData {
  industryCategory: string;
  manufacturer: number;
  cultivator: number;
  retailer: number;
}

// Function to generate mock data for average days to pay by industry category
const generateMockIndustryPaymentData = (state: string): IndustryPaymentData[] => {
  return INDUSTRY_CATEGORIES.map(category => {
    // Generate realistic payment days with some variation by industry
    const baseManufacturer = 25 + Math.random() * 15; // 25-40 days
    const baseCultivator = 30 + Math.random() * 20; // 30-50 days  
    const baseRetailer = 35 + Math.random() * 25; // 35-60 days
    
    // Add some industry-specific variations
    let manufacturerDays = baseManufacturer;
    let cultivatorDays = baseCultivator;
    let retailerDays = baseRetailer;
    
    switch (category) {
      case 'Software':
        // Software companies might get paid faster
        manufacturerDays -= 5;
        cultivatorDays -= 5;
        retailerDays -= 5;
        break;
      case 'Financial Funding Services':
        // Financial services might have longer payment terms
        manufacturerDays += 10;
        cultivatorDays += 10;
        retailerDays += 10;
        break;
      case 'Delivery':
        // Delivery services might get paid faster
        manufacturerDays -= 3;
        cultivatorDays -= 3;
        retailerDays -= 3;
        break;
    }
    
    return {
      industryCategory: category,
      manufacturer: Math.round(manufacturerDays),
      cultivator: Math.round(cultivatorDays),
      retailer: Math.round(retailerDays)
    };
  });
};

const IndustryCategoryBreakdown: React.FC<IndustryCategoryBreakdownProps> = ({ 
  selectedState, 
  selectedTimeline 
}) => {
  const [industryData, setIndustryData] = useState<IndustryPaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // Fetch data whenever selectedState changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    console.log(`Fetching industry category data for state: "${selectedState}"`);
    
    // Simulate API call with mock data
    setTimeout(() => {
      try {
        const mockData = generateMockIndustryPaymentData(selectedState);
        console.log(`Generated ${mockData.length} industry category records for ${selectedState}`);
        setIndustryData(mockData);
      } catch (err) {
        console.error('Error loading industry category data:', err);
        setError(`Failed to load data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [selectedState]);

  // Toggle card expansion
  const toggleCard = (industryCategory: string) => {
    const newExpandedCards = new Set(expandedCards);
    if (newExpandedCards.has(industryCategory)) {
      newExpandedCards.delete(industryCategory);
    } else {
      newExpandedCards.add(industryCategory);
    }
    setExpandedCards(newExpandedCards);
  };

  // Calculate overall average for an industry
  const calculateIndustryOverallAverage = (industry: IndustryPaymentData) => {
    return Math.round((industry.manufacturer + industry.cultivator + industry.retailer) / 3);
  };

  // Calculate overall averages across all industries
  const calculateOverallAverages = () => {
    if (industryData.length === 0) return { manufacturer: 0, cultivator: 0, retailer: 0 };
    
    const totals = industryData.reduce((acc, item) => ({
      manufacturer: acc.manufacturer + item.manufacturer,
      cultivator: acc.cultivator + item.cultivator,
      retailer: acc.retailer + item.retailer
    }), { manufacturer: 0, cultivator: 0, retailer: 0 });
    
    return {
      manufacturer: Math.round(totals.manufacturer / industryData.length),
      cultivator: Math.round(totals.cultivator / industryData.length),
      retailer: Math.round(totals.retailer / industryData.length)
    };
  };

  const overallAverages = calculateOverallAverages();

  // Colors for the license types
  const LICENSE_TYPE_COLORS = {
    manufacturer: '#3B82F6', // Blue
    cultivator: '#10B981', // Emerald
    retailer: '#8B5CF6' // Purple
  };

  return (
    <div className="p-5">
      {/* Average Days to Pay by Industry Category Section */}
      <div className="mt-6 mb-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading industry data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        ) : industryData.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-600">No industry category data available for {selectedState}.</p>
          </div>
        ) : (
          <>
            {/* Overall Averages Summary - Moved above the header */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-primary mb-3 text-center">Overall State Averages</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-primary-light rounded-lg p-3 text-center shadow-sm">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: LICENSE_TYPE_COLORS.manufacturer }}></div>
                    <p className="text-sm font-medium text-gray-700">Manufacturer</p>
                  </div>
                  <p className="text-2xl font-bold text-primary">{overallAverages.manufacturer} days</p>
                </div>
                <div className="bg-primary-light rounded-lg p-3 text-center shadow-sm">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: LICENSE_TYPE_COLORS.cultivator }}></div>
                    <p className="text-sm font-medium text-gray-700">Cultivator</p>
                  </div>
                  <p className="text-2xl font-bold text-primary">{overallAverages.cultivator} days</p>
                </div>
                <div className="bg-primary-light rounded-lg p-3 text-center shadow-sm">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: LICENSE_TYPE_COLORS.retailer }}></div>
                    <p className="text-sm font-medium text-gray-700">Retailer</p>
                  </div>
                  <p className="text-2xl font-bold text-primary">{overallAverages.retailer} days</p>
                </div>
              </div>
            </div>

            {/* Section Header - Now below Overall State Averages */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-primary">Average Days to Pay by Industry Category</h3>
              <p className="text-sm text-gray-500 italic">
                How long our members in each industry category take to get paid by different license types
              </p>
            </div>

            {/* Collapsible Industry Category Cards */}
            <div className="space-y-4">
              {industryData.map((industry, index) => {
                const isExpanded = expandedCards.has(industry.industryCategory);
                const overallAverage = calculateIndustryOverallAverage(industry);
                
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Collapsible Header */}
                    <button
                      onClick={() => toggleCard(industry.industryCategory)}
                      className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-4">
                        {/* Header with industry name */}
                        <div className="text-left">
                          <span className="text-gray-500 italic text-base">CCA Member Industry Category: </span>
                          <span className="text-primary text-xl font-bold">{industry.industryCategory}</span>
                        </div>
                        
                        {/* Overall Average Days to be Paid */}
                        <div className="text-sm text-gray-600">
                          Overall Average Days to be Paid: <span className="font-semibold text-primary">{overallAverage} days</span>
                        </div>
                      </div>
                      
                      {/* Expand/Collapse Icon */}
                      <div className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-primary" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </button>

                    {/* Expandable Content */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600 mb-4 text-center mt-4">
                          Average days to be paid by the following:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Manufacturer Card - Same as Total Industry Categories background */}
                          <div className="p-3 bg-primary-lighter rounded-lg text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: LICENSE_TYPE_COLORS.manufacturer }}></div>
                              <h5 className="text-base font-semibold text-primary">Manufacturer</h5>
                            </div>
                            <div className="text-center">
                              <span className="text-xl font-bold text-primary">{industry.manufacturer}</span>
                              <span className="text-base text-primary ml-1">Days</span>
                            </div>
                          </div>

                          {/* Cultivator Card - Light Grey */}
                          <div className="p-3 bg-gray-50 rounded-lg text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: LICENSE_TYPE_COLORS.cultivator }}></div>
                              <h5 className="text-base font-semibold text-primary">Cultivator</h5>
                            </div>
                            <div className="text-center">
                              <span className="text-xl font-bold text-primary">{industry.cultivator}</span>
                              <span className="text-base text-primary ml-1">Days</span>
                            </div>
                          </div>

                          {/* Retailer Card - Lighter Blue */}
                          <div className="p-3 bg-slate-50 rounded-lg text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: LICENSE_TYPE_COLORS.retailer }}></div>
                              <h5 className="text-base font-semibold text-primary">Retailer</h5>
                            </div>
                            <div className="text-center">
                              <span className="text-xl font-bold text-primary">{industry.retailer}</span>
                              <span className="text-base text-primary ml-1">Days</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Summary Chart */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-primary mb-4">Payment Days Comparison Chart</h4>
              <div className="h-[500px] w-full bg-white rounded-xl border border-gray-200">
                <ResponsiveContainer>
                  <BarChart
                    data={industryData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                    barCategoryGap={20}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="industryCategory"
                      tick={{ fill: '#0B3B6B', fontSize: 11 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis
                      label={{ value: 'Days to Pay', angle: -90, position: 'insideLeft' }}
                      tick={{ fill: '#0B3B6B', fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => [`${value} days`, name]}
                      labelFormatter={(label: string) => `Industry: ${label}`}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Bar
                      dataKey="manufacturer"
                      name="Manufacturer"
                      fill={LICENSE_TYPE_COLORS.manufacturer}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="cultivator"
                      name="Cultivator"
                      fill={LICENSE_TYPE_COLORS.cultivator}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="retailer"
                      name="Retailer"
                      fill={LICENSE_TYPE_COLORS.retailer}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-500 text-right">
              Showing data for {industryData.length} industry categories for {selectedState}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IndustryCategoryBreakdown;