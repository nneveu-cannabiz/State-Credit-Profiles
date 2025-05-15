import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export interface ARData {
  id: number;
  State: string | null;
  Current: string | null;
  "1 - 30": string | null;
  "31-60": string | null;
  "61-90": string | null;
  "91+": string | null;
  Date: string | null;
}

export const supabase = createClient<{
  Tables: {
    "Example AR": ARData;
  };
}>(supabaseUrl, supabaseAnonKey);

export async function fetchARData() {
  const { data, error } = await supabase
    .from('Example AR')
    .select('*')
    .order('Date', { ascending: false });

  if (error) {
    throw new Error(`Error fetching AR data: ${error.message}`);
  }

  return data;
}

export async function fetchStateARData(state: string) {
  console.log('Fetching data for state:', state);
  const { data, error } = await supabase
    .from('Example AR')
    .select('*')
    .eq('State', state)
    .order('Date', { ascending: false });

  console.log('Received data:', data);
  console.log('Error if any:', error);

  if (error) {
    throw new Error(`Error fetching state AR data: ${error.message}`);
  }

  if (!data || data.length === 0) {
    console.warn(`No data found for state: ${state}`);
  }

  return data;
}