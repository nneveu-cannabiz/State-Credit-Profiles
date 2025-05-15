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
      <div className="container max-w-4xl">
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
      </div>
    </div>
  );
};

export default StateCreditHealthRatingIndicator;