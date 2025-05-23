/*
  # Update Example AR Headers data
  
  1. Changes
    - Clear existing data
    - Insert new mock data for 5 states with dates from April 2025 to May 2024
*/

-- Clear existing data
TRUNCATE TABLE "Example AR Headers";

-- Insert new data
INSERT INTO "Example AR Headers" ("State", "Current", "1 - 30", "31-60", "61-90", "91+", "Month")
VALUES
  -- California
  ('California', '$245,000', '$125,000', '$85,000', '$45,000', '$15,000', '2025-04-01'),
  ('California', '$235,000', '$130,000', '$80,000', '$40,000', '$20,000', '2025-03-01'),
  ('California', '$255,000', '$115,000', '$75,000', '$35,000', '$25,000', '2025-02-01'),
  ('California', '$265,000', '$120,000', '$70,000', '$30,000', '$30,000', '2025-01-01'),
  ('California', '$275,000', '$110,000', '$65,000', '$25,000', '$35,000', '2024-12-01'),
  ('California', '$285,000', '$105,000', '$60,000', '$20,000', '$40,000', '2024-11-01'),
  ('California', '$295,000', '$100,000', '$55,000', '$15,000', '$45,000', '2024-10-01'),
  ('California', '$305,000', '$95,000', '$50,000', '$10,000', '$50,000', '2024-09-01'),
  ('California', '$315,000', '$90,000', '$45,000', '$5,000', '$55,000', '2024-08-01'),
  ('California', '$325,000', '$85,000', '$40,000', '$0', '$60,000', '2024-07-01'),
  ('California', '$335,000', '$80,000', '$35,000', '$0', '$65,000', '2024-06-01'),
  ('California', '$345,000', '$75,000', '$30,000', '$0', '$70,000', '2024-05-01'),

  -- Texas
  ('Texas', '$185,000', '$95,000', '$65,000', '$35,000', '$10,000', '2025-04-01'),
  ('Texas', '$175,000', '$100,000', '$60,000', '$30,000', '$15,000', '2025-03-01'),
  ('Texas', '$195,000', '$85,000', '$55,000', '$25,000', '$20,000', '2025-02-01'),
  ('Texas', '$205,000', '$90,000', '$50,000', '$20,000', '$25,000', '2025-01-01'),
  ('Texas', '$215,000', '$80,000', '$45,000', '$15,000', '$30,000', '2024-12-01'),
  ('Texas', '$225,000', '$75,000', '$40,000', '$10,000', '$35,000', '2024-11-01'),
  ('Texas', '$235,000', '$70,000', '$35,000', '$5,000', '$40,000', '2024-10-01'),
  ('Texas', '$245,000', '$65,000', '$30,000', '$0', '$45,000', '2024-09-01'),
  ('Texas', '$255,000', '$60,000', '$25,000', '$0', '$50,000', '2024-08-01'),
  ('Texas', '$265,000', '$55,000', '$20,000', '$0', '$55,000', '2024-07-01'),
  ('Texas', '$275,000', '$50,000', '$15,000', '$0', '$60,000', '2024-06-01'),
  ('Texas', '$285,000', '$45,000', '$10,000', '$0', '$65,000', '2024-05-01'),

  -- New York
  ('New York', '$295,000', '$155,000', '$95,000', '$55,000', '$20,000', '2025-04-01'),
  ('New York', '$285,000', '$160,000', '$90,000', '$50,000', '$25,000', '2025-03-01'),
  ('New York', '$305,000', '$145,000', '$85,000', '$45,000', '$30,000', '2025-02-01'),
  ('New York', '$315,000', '$150,000', '$80,000', '$40,000', '$35,000', '2025-01-01'),
  ('New York', '$325,000', '$140,000', '$75,000', '$35,000', '$40,000', '2024-12-01'),
  ('New York', '$335,000', '$135,000', '$70,000', '$30,000', '$45,000', '2024-11-01'),
  ('New York', '$345,000', '$130,000', '$65,000', '$25,000', '$50,000', '2024-10-01'),
  ('New York', '$355,000', '$125,000', '$60,000', '$20,000', '$55,000', '2024-09-01'),
  ('New York', '$365,000', '$120,000', '$55,000', '$15,000', '$60,000', '2024-08-01'),
  ('New York', '$375,000', '$115,000', '$50,000', '$10,000', '$65,000', '2024-07-01'),
  ('New York', '$385,000', '$110,000', '$45,000', '$5,000', '$70,000', '2024-06-01'),
  ('New York', '$395,000', '$105,000', '$40,000', '$0', '$75,000', '2024-05-01'),

  -- Florida
  ('Florida', '$165,000', '$85,000', '$55,000', '$25,000', '$5,000', '2025-04-01'),
  ('Florida', '$155,000', '$90,000', '$50,000', '$20,000', '$10,000', '2025-03-01'),
  ('Florida', '$175,000', '$75,000', '$45,000', '$15,000', '$15,000', '2025-02-01'),
  ('Florida', '$185,000', '$80,000', '$40,000', '$10,000', '$20,000', '2025-01-01'),
  ('Florida', '$195,000', '$70,000', '$35,000', '$5,000', '$25,000', '2024-12-01'),
  ('Florida', '$205,000', '$65,000', '$30,000', '$0', '$30,000', '2024-11-01'),
  ('Florida', '$215,000', '$60,000', '$25,000', '$0', '$35,000', '2024-10-01'),
  ('Florida', '$225,000', '$55,000', '$20,000', '$0', '$40,000', '2024-09-01'),
  ('Florida', '$235,000', '$50,000', '$15,000', '$0', '$45,000', '2024-08-01'),
  ('Florida', '$245,000', '$45,000', '$10,000', '$0', '$50,000', '2024-07-01'),
  ('Florida', '$255,000', '$40,000', '$5,000', '$0', '$55,000', '2024-06-01'),
  ('Florida', '$265,000', '$35,000', '$0', '$0', '$60,000', '2024-05-01'),

  -- Illinois
  ('Illinois', '$215,000', '$115,000', '$75,000', '$35,000', '$10,000', '2025-04-01'),
  ('Illinois', '$205,000', '$120,000', '$70,000', '$30,000', '$15,000', '2025-03-01'),
  ('Illinois', '$225,000', '$105,000', '$65,000', '$25,000', '$20,000', '2025-02-01'),
  ('Illinois', '$235,000', '$110,000', '$60,000', '$20,000', '$25,000', '2025-01-01'),
  ('Illinois', '$245,000', '$100,000', '$55,000', '$15,000', '$30,000', '2024-12-01'),
  ('Illinois', '$255,000', '$95,000', '$50,000', '$10,000', '$35,000', '2024-11-01'),
  ('Illinois', '$265,000', '$90,000', '$45,000', '$5,000', '$40,000', '2024-10-01'),
  ('Illinois', '$275,000', '$85,000', '$40,000', '$0', '$45,000', '2024-09-01'),
  ('Illinois', '$285,000', '$80,000', '$35,000', '$0', '$50,000', '2024-08-01'),
  ('Illinois', '$295,000', '$75,000', '$30,000', '$0', '$55,000', '2024-07-01'),
  ('Illinois', '$305,000', '$70,000', '$25,000', '$0', '$60,000', '2024-06-01'),
  ('Illinois', '$315,000', '$65,000', '$20,000', '$0', '$65,000', '2024-05-01');