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
  
  // First attempt: Try exact match
  let { data, error } = await supabase
    .from('Example AR')
    .select('*')
    .eq('State', state)
    .order('Date', { ascending: false });
    
  console.log('Initial query results:', data);
  
  // Second attempt: If no results, try with trimmed state name
  if ((!data || data.length === 0) && !error) {
    const trimmedState = state.trim();
    console.log('Trying with trimmed state name:', trimmedState);
    
    ({ data, error } = await supabase
      .from('Example AR')
      .select('*')
      .eq('State', trimmedState)
      .order('Date', { ascending: false }));
      
    console.log('Trimmed state results:', data);
  }
  
  // Third attempt: Try case-insensitive match
  if ((!data || data.length === 0) && !error) {
    console.log('Trying case-insensitive search');
    ({ data, error } = await supabase
      .from('Example AR')
      .select('*')
      .ilike('State', `%${state}%`)
      .order('Date', { ascending: false }));
      
    console.log('Case-insensitive results:', data);
  }
  
  // Last resort: Fetch all data to see what's available
  if ((!data || data.length === 0) && !error) {
    console.log('No matches found, fetching all data to examine available states');
    const { data: allData, error: allError } = await supabase
      .from('Example AR')
      .select('State, id')
      .order('State');
      
    if (!allError && allData && allData.length > 0) {
      console.log('Available states in database:', 
        [...new Set(allData.map(item => item.State).filter(Boolean))]);
    }
  }

  if (error) {
    console.error('Error fetching state AR data:', error);
    throw new Error(`Error fetching state AR data: ${error.message}`);
  }

  if (data && data.length > 0) {
    console.log('Sample record for debugging:');
    console.log(JSON.stringify(data[0], null, 2));
  } else {
    console.warn(`No data found for state: ${state}`);
  }

  return data || [];
}