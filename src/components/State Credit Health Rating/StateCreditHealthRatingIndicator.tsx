import React from 'react';
import { ImgUrls } from '../../utils/ImgUrls';

interface RiskRating {
  text: string;
  color: string;
}

const riskRatings: Record<string, RiskRating> = {
  veryLow: { text: 'Very Low Risk', color: '#51cf92' },
  low: { text: 'Low Risk', color: '#ffde59' },
  medium: { text: 'Medium Risk', color: '#fdc775' },
  high: { text: 'High Risk', color: '#ff914d' },
  veryHigh: { text: 'Very High Risk', color: '#ff5757' },
};

const StateCreditHealthRatingIndicator: React.FC = () => {
  // For now, using medium risk rating statically
  const currentRating = riskRatings.medium;

  return (
    <div className="flex flex-col items-center p-6 bg-white relative">
      <div className="container max-w-6xl">
        {/* State Credit Health Rating - Centered */}
        <div className="flex flex-col items-center gap-2">
          <img
            src={ImgUrls.medium_risk_rating_indicator}
            alt="Credit Health Rating Indicator"
            className="w-40 h-auto"
          />
          <div className="text-center">
            <span className="text-xl font-semibold text-primary">
              State Credit Health Rating: <span style={{ color: currentRating.color }}>{currentRating.text}</span>
            </span>
          </div>
        </div>

        {/* Performance Ranking - Positioned to the right */}
        <div className="absolute top-6 right-6 bg-white rounded-lg shadow-md border border-gray-200 p-4 w-64 hidden lg:block">
          <h4 className="text-sm font-semibold text-primary mb-1">Performance Ranking</h4>
          <p className="text-xs text-gray-600 mb-3">Performance ranking in each category compared to other states</p>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-700">Accounts Receivables Ranking:</span>
              <span className="text-xs font-semibold text-primary">
                22 <span className="text-xs italic text-gray-400 font-normal">out of 35</span>
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-700">Debt Collections Ranking:</span>
              <span className="text-xs font-semibold text-primary">
                18 <span className="text-xs italic text-gray-400 font-normal">out of 35</span>
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-700">Average Days to Pay Ranking:</span>
              <span className="text-xs font-semibold text-primary">
                27 <span className="text-xs italic text-gray-400 font-normal">out of 35</span>
              </span>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-xs font-semibold text-gray-800">Overall State Ranking:</span>
              <span className="text-xs font-bold text-primary">
                24 <span className="text-xs italic text-gray-400 font-normal">out of 35</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateCreditHealthRatingIndicator;