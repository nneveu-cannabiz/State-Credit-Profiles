/*
  # Update Example AR data with new dates

  1. Changes
    - Clear existing data
    - Insert new mock data for 5 states
    - Date range: April 2025 back to May 2024
*/

-- Clear existing data
TRUNCATE TABLE "Example AR Headers";

-- Reset the sequence
ALTER SEQUENCE "Example AR Headers_id_seq" RESTART WITH 1;

-- Insert new data
INSERT INTO "Example AR Headers" (id, "State", "Current", "1 - 30", "31-60", "61-90", "91+", "Month")
VALUES
  -- California
  (1, 'California', '$245,000', '$125,000', '$85,000', '$45,000', '$15,000', '2025-04-01'),
  (2, 'California', '$235,000', '$130,000', '$80,000', '$40,000', '$20,000', '2025-03-01'),
  (3, 'California', '$255,000', '$115,000', '$75,000', '$35,000', '$25,000', '2025-02-01'),
  (4, 'California', '$265,000', '$120,000', '$70,000', '$30,000', '$30,000', '2025-01-01'),
  (5, 'California', '$275,000', '$110,000', '$65,000', '$25,000', '$35,000', '2024-12-01'),
  (6, 'California', '$285,000', '$105,000', '$60,000', '$20,000', '$40,000', '2024-11-01'),
  (7, 'California', '$295,000', '$100,000', '$55,000', '$15,000', '$45,000', '2024-10-01'),
  (8, 'California', '$305,000', '$95,000', '$50,000', '$10,000', '$50,000', '2024-09-01'),
  (9, 'California', '$315,000', '$90,000', '$45,000', '$5,000', '$55,000', '2024-08-01'),
  (10, 'California', '$325,000', '$85,000', '$40,000', '$0', '$60,000', '2024-07-01'),
  (11, 'California', '$335,000', '$80,000', '$35,000', '$0', '$65,000', '2024-06-01'),
  (12, 'California', '$345,000', '$75,000', '$30,000', '$0', '$70,000', '2024-05-01'),

  -- Texas
  (13, 'Texas', '$185,000', '$95,000', '$65,000', '$35,000', '$10,000', '2025-04-01'),
  (14, 'Texas', '$175,000', '$100,000', '$60,000', '$30,000', '$15,000', '2025-03-01'),
  (15, 'Texas', '$195,000', '$85,000', '$55,000', '$25,000', '$20,000', '2025-02-01'),
  (16, 'Texas', '$205,000', '$90,000', '$50,000', '$20,000', '$25,000', '2025-01-01'),
  (17, 'Texas', '$215,000', '$80,000', '$45,000', '$15,000', '$30,000', '2024-12-01'),
  (18, 'Texas', '$225,000', '$75,000', '$40,000', '$10,000', '$35,000', '2024-11-01'),
  (19, 'Texas', '$235,000', '$70,000', '$35,000', '$5,000', '$40,000', '2024-10-01'),
  (20, 'Texas', '$245,000', '$65,000', '$30,000', '$0', '$45,000', '2024-09-01'),
  (21, 'Texas', '$255,000', '$60,000', '$25,000', '$0', '$50,000', '2024-08-01'),
  (22, 'Texas', '$265,000', '$55,000', '$20,000', '$0', '$55,000', '2024-07-01'),
  (23, 'Texas', '$275,000', '$50,000', '$15,000', '$0', '$60,000', '2024-06-01'),
  (24, 'Texas', '$285,000', '$45,000', '$10,000', '$0', '$65,000', '2024-05-01'),

  -- New York
  (25, 'New York', '$295,000', '$155,000', '$95,000', '$55,000', '$20,000', '2025-04-01'),
  (26, 'New York', '$285,000', '$160,000', '$90,000', '$50,000', '$25,000', '2025-03-01'),
  (27, 'New York', '$305,000', '$145,000', '$85,000', '$45,000', '$30,000', '2025-02-01'),
  (28, 'New York', '$315,000', '$150,000', '$80,000', '$40,000', '$35,000', '2025-01-01'),
  (29, 'New York', '$325,000', '$140,000', '$75,000', '$35,000', '$40,000', '2024-12-01'),
  (30, 'New York', '$335,000', '$135,000', '$70,000', '$30,000', '$45,000', '2024-11-01'),
  (31, 'New York', '$345,000', '$130,000', '$65,000', '$25,000', '$50,000', '2024-10-01'),
  (32, 'New York', '$355,000', '$125,000', '$60,000', '$20,000', '$55,000', '2024-09-01'),
  (33, 'New York', '$365,000', '$120,000', '$55,000', '$15,000', '$60,000', '2024-08-01'),
  (34, 'New York', '$375,000', '$115,000', '$50,000', '$10,000', '$65,000', '2024-07-01'),
  (35, 'New York', '$385,000', '$110,000', '$45,000', '$5,000', '$70,000', '2024-06-01'),
  (36, 'New York', '$395,000', '$105,000', '$40,000', '$0', '$75,000', '2024-05-01'),

  -- Florida
  (37, 'Florida', '$165,000', '$85,000', '$55,000', '$25,000', '$5,000', '2025-04-01'),
  (38, 'Florida', '$155,000', '$90,000', '$50,000', '$20,000', '$10,000', '2025-03-01'),
  (39, 'Florida', '$175,000', '$75,000', '$45,000', '$15,000', '$15,000', '2025-02-01'),
  (40, 'Florida', '$185,000', '$80,000', '$40,000', '$10,000', '$20,000', '2025-01-01'),
  (41, 'Florida', '$195,000', '$70,000', '$35,000', '$5,000', '$25,000', '2024-12-01'),
  (42, 'Florida', '$205,000', '$65,000', '$30,000', '$0', '$30,000', '2024-11-01'),
  (43, 'Florida', '$215,000', '$60,000', '$25,000', '$0', '$35,000', '2024-10-01'),
  (44, 'Florida', '$225,000', '$55,000', '$20,000', '$0', '$40,000', '2024-09-01'),
  (45, 'Florida', '$235,000', '$50,000', '$15,000', '$0', '$45,000', '2024-08-01'),
  (46, 'Florida', '$245,000', '$45,000', '$10,000', '$0', '$50,000', '2024-07-01'),
  (47, 'Florida', '$255,000', '$40,000', '$5,000', '$0', '$55,000', '2024-06-01'),
  (48, 'Florida', '$265,000', '$35,000', '$0', '$0', '$60,000', '2024-05-01'),

  -- Illinois
  (49, 'Illinois', '$215,000', '$115,000', '$75,000', '$35,000', '$10,000', '2025-04-01'),
  (50, 'Illinois', '$205,000', '$120,000', '$70,000', '$30,000', '$15,000', '2025-03-01'),
  (51, 'Illinois', '$225,000', '$105,000', '$65,000', '$25,000', '$20,000', '2025-02-01'),
  (52, 'Illinois', '$235,000', '$110,000', '$60,000', '$20,000', '$25,000', '2025-01-01'),
  (53, 'Illinois', '$245,000', '$100,000', '$55,000', '$15,000', '$30,000', '2024-12-01'),
  (54, 'Illinois', '$255,000', '$95,000', '$50,000', '$10,000', '$35,000', '2024-11-01'),
  (55, 'Illinois', '$265,000', '$90,000', '$45,000', '$5,000', '$40,000', '2024-10-01'),
  (56, 'Illinois', '$275,000', '$85,000', '$40,000', '$0', '$45,000', '2024-09-01'),
  (57, 'Illinois', '$285,000', '$80,000', '$35,000', '$0', '$50,000', '2024-08-01'),
  (58, 'Illinois', '$295,000', '$75,000', '$30,000', '$0', '$55,000', '2024-07-01'),
  (59, 'Illinois', '$305,000', '$70,000', '$25,000', '$0', '$60,000', '2024-06-01'),
  (60, 'Illinois', '$315,000', '$65,000', '$20,000', '$0', '$65,000', '2024-05-01');