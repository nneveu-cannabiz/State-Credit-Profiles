// Risk Rating Colors
export const RISK_RATING_COLORS = {
  VERY_LOW: '#51cf92',
  LOW: '#ffde59',
  MEDIUM: '#fdc775',
  HIGH: '#ff914d',
  VERY_HIGH: '#ff5757',
} as const;

// Risk Rating Labels with associated colors
export const RISK_RATINGS = {
  VERY_LOW: {
    label: 'Very Low Risk',
    color: RISK_RATING_COLORS.VERY_LOW,
  },
  LOW: {
    label: 'Low Risk',
    color: RISK_RATING_COLORS.LOW,
  },
  MEDIUM: {
    label: 'Medium Risk',
    color: RISK_RATING_COLORS.MEDIUM,
  },
  HIGH: {
    label: 'High Risk',
    color: RISK_RATING_COLORS.HIGH,
  },
  VERY_HIGH: {
    label: 'Very High Risk',
    color: RISK_RATING_COLORS.VERY_HIGH,
  },
} as const;

// AR Aging Categories with associated colors
export const AR_AGING = {
  CURRENT: {
    label: 'Current',
    color: RISK_RATING_COLORS.VERY_LOW,
  },
  DAYS_1_30: {
    label: '1 - 30',
    color: RISK_RATING_COLORS.LOW,
  },
  DAYS_31_60: {
    label: '31-60',
    color: RISK_RATING_COLORS.MEDIUM,
  },
  DAYS_61_90: {
    label: '61-90',
    color: RISK_RATING_COLORS.HIGH,
  },
  DAYS_91_PLUS: {
    label: '91+',
    color: RISK_RATING_COLORS.VERY_HIGH,
  },
} as const;

// Direct color mapping for AR aging categories
export const AR_AGING_COLORS = {
  'Current': RISK_RATING_COLORS.VERY_LOW,
  '1 - 30': RISK_RATING_COLORS.LOW,
  '31-60': RISK_RATING_COLORS.MEDIUM,
  '61-90': RISK_RATING_COLORS.HIGH,
  '91+': RISK_RATING_COLORS.VERY_HIGH,
} as const;

// Type exports for TypeScript support
export type RiskRatingColor = typeof RISK_RATING_COLORS[keyof typeof RISK_RATING_COLORS];
export type RiskRating = typeof RISK_RATINGS[keyof typeof RISK_RATINGS];
export type ARAgingCategory = typeof AR_AGING[keyof typeof AR_AGING];