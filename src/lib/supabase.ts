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

  console.log('All AR data:', data);
  
  if (error) {
    console.error('Error fetching AR data:', error);
    throw new Error(`Error fetching AR data: ${error.message}`);
  }

  if (!data || data.length === 0) {
    console.warn('No AR data found in the database');
  }

  return data;
}

export async function fetchStateARData(state: string) {
  console.log('Fetching data for state:', state);
  
  // First, log all available states for debugging
  const { data: allStates, error: statesError } = await supabase
    .from('Example AR')
    .select('State')
    .order('State');
    
  if (allStates && allStates.length > 0) {
    console.log('Available states in database:', allStates.map(item => item.State));
  }
  
  // Trim the state input to handle any whitespace issues
  const trimmedState = state.trim();
  
  // First try exact match
  let { data, error } = await supabase
    .from('Example AR')
    .select('*')
    .eq('State', trimmedState)
    .order('Date', { ascending: false });
  
  console.log('Exact match results:', data);
  
  // If no results, try case-insensitive match
  if ((!data || data.length === 0) && !error) {
    console.log('No exact match found, trying case-insensitive search');
    ({ data, error } = await supabase
      .from('Example AR')
      .select('*')
      .ilike('State', `%${trimmedState}%`)
      .order('Date', { ascending: false }));
      
    console.log('Case-insensitive match results:', data);
  }

  // Log results for debugging
  console.log('Final data for state:', trimmedState, data);
  
  if (error) {
    console.error('Error fetching state AR data:', error);
    throw new Error(`Error fetching state AR data: ${error.message}`);
  }

  // Debugging: log data to understand structure
  if (data && data.length > 0) {
    console.log('Sample data entry:', data[0]);
    // Log each column to verify correct access
    console.log('State:', data[0].State);
    console.log('Current value:', data[0].Current);
    console.log('1-30 value:', data[0]['1 - 30']);
    console.log('31-60 value:', data[0]['31-60']);
    console.log('61-90 value:', data[0]['61-90']);
    console.log('91+ value:', data[0]['91+']);
    console.log('Date:', data[0].Date);
  } else {
    console.warn('No data found for state:', state);
  }

  return data || [];
}