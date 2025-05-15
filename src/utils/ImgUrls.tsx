export const ImgUrls = {
  white_simple_cca_logo: 'https://i.imgur.com/0jslDI9.png',
  very_low_risk_rating_indicator: 'https://i.imgur.com/9asfk8j.png',
  low_risk_rating_indicator: 'https://i.imgur.com/Nb5Vyv8.png',
  medium_risk_rating_indicator: 'https://i.imgur.com/vDEYuGo.png',
  high_risk_rating_indicator: 'https://i.imgur.com/uJSFA4C.png',
  very_high_rating_indicator: 'https://i.imgur.com/krPi8dc.png',
} as const;

export type ImgUrlKey = keyof typeof ImgUrls;