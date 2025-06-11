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
    <div className="flex flex-col items-center p-6 bg-white">
      <div className="container max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          {/* State Credit Health Rating - Left Side */}
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

          {/* Performance Ranking - Right Side */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 min-w-[320px]">
            <h3 className="text-lg font-semibold text-primary mb-2">Performance Ranking</h3>
            <p className="text-sm text-gray-600 mb-4">Performance ranking in each category compared to other states</p>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Accounts Receivables Ranking:</span>
                <span className="text-sm font-semibold text-primary">
                  22 <span className="text-xs italic text-gray-400 font-normal">out of 35</span>
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Debt Collections Ranking:</span>
                <span className="text-sm font-semibold text-primary">
                  18 <span className="text-xs italic text-gray-400 font-normal">out of 35</span>
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Average Days to Pay Ranking:</span>
                <span className="text-sm font-semibold text-primary">
                  27 <span className="text-xs italic text-gray-400 font-normal">out of 35</span>
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-sm font-semibold text-gray-800">Overall State Ranking:</span>
                <span className="text-sm font-bold text-primary">
                  24 <span className="text-xs italic text-gray-400 font-normal">out of 35</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateCreditHealthRatingIndicator;