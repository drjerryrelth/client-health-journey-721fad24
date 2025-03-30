
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Get Supabase environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log for debugging if environment variables are present
console.log('Supabase URL:', supabaseUrl ? '[present]' : '[missing]');
console.log('Supabase Anon Key:', supabaseAnonKey ? '[present]' : '[missing]');

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  // Provide fallback values for development only
  // This should be removed in production
}

// Create Supabase client with explicit type casting to avoid null/undefined errors
export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

export default supabase;
