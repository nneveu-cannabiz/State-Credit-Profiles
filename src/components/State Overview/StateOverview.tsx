import React from 'react';

interface StateOverviewProps {
  selectedState: string;
}

// For now, only California has sample data
const sampleData = {
  'California': {
    totalCompanies: 524,
    totalActiveLicenses: 7546,
    licenseBreakdown: {
      manufacturer: 234,
      cultivator: 2779,
      retailer: 4533
    }
  }
};

const StateOverview: React.FC<StateOverviewProps> = ({ selectedState }) => {
  // Use California data as default, in a real app this would come from the database
  const stateData = sampleData[selectedState as keyof typeof sampleData] || sampleData['California'];
  
  return (
    <div className="flex flex-col p-6 bg-white">
      <div className="container max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          {/* Overview Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-primary mb-4">Overview</h2>
            <div className="flex flex-wrap gap-8">
              <div className="flex-1 min-w-[200px] bg-primary-lighter rounded-xl p-4">
                <p className="text-gray-600 text-sm mb-1">Total Companies</p>
                <p className="text-3xl font-bold text-primary">{stateData.totalCompanies.toLocaleString()}</p>
              </div>
              <div className="flex-1 min-w-[200px] bg-primary-lighter rounded-xl p-4">
                <p className="text-gray-600 text-sm mb-1">Total Active Licenses</p>
                <p className="text-3xl font-bold text-primary">{stateData.totalActiveLicenses.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* License Breakdown Section */}
          <div>
            <h2 className="text-2xl font-bold text-primary mb-4">License Breakdown</h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px] border border-gray-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <p className="text-lg font-medium text-primary">Manufacturer</p>
                </div>
                <p className="text-2xl font-bold text-primary">{stateData.licenseBreakdown.manufacturer.toLocaleString()} <span className="text-sm font-normal text-gray-500">Active Licenses</span></p>
              </div>
              
              <div className="flex-1 min-w-[200px] border border-gray-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <p className="text-lg font-medium text-primary">Cultivator</p>
                </div>
                <p className="text-2xl font-bold text-primary">{stateData.licenseBreakdown.cultivator.toLocaleString()} <span className="text-sm font-normal text-gray-500">Active Licenses</span></p>
              </div>
              
              <div className="flex-1 min-w-[200px] border border-gray-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <p className="text-lg font-medium text-primary">Retailer</p>
                </div>
                <p className="text-2xl font-bold text-primary">{stateData.licenseBreakdown.retailer.toLocaleString()} <span className="text-sm font-normal text-gray-500">Active Licenses</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateOverview;