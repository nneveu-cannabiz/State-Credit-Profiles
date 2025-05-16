// Risk Rating Colors
export const RISK_RATING_COLORS = {
  VERY_LOW: 'rgb(81, 207, 146)',    // #51cf92
  LOW: 'rgb(255, 222, 89)',         // #ffde59
  MEDIUM: 'rgb(253, 199, 117)',     // #fdc775
  HIGH: 'rgb(255, 145, 77)',        // #ff914d
  VERY_HIGH: 'rgb(255, 87, 87)',    // #ff5757
} as const;

// Color definitions by actual color names
export const AR_COLORS = {
  GREEN: 'rgb(81, 207, 146)',        // #51cf92
  YELLOW: 'rgb(255, 222, 89)',       // #ffde59
  MID_ORANGE: 'rgb(253, 199, 117)',  // #fdc775
  ORANGE: 'rgb(255, 145, 77)',       // #ff914d
  RED: 'rgb(255, 87, 87)',           // #ff5757
} as const;

// Type exports for TypeScript support
export type RiskRatingColor = typeof RISK_RATING_COLORS[keyof typeof RISK_RATING_COLORS];
export type ARColor = typeof AR_COLORS[keyof typeof AR_COLORS];