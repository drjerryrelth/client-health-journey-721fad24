
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Get Supabase environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Log for debugging if environment variables are present
console.log('Supabase URL:', supabaseUrl ? '[present]' : '[missing]');
console.log('Supabase Anon Key:', supabaseAnonKey ? '[present]' : '[missing]');

// Default values for development - DO NOT use in production
// These will prevent initial loading errors but won't connect to a real database
const devUrl = 'https://example.supabase.co';
const devKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdGt2a3Brd2FpeWJ0eGVpcWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODAwMDM2MjYsImV4cCI6MTk5NTU3OTYyNn0.S67ekfSY_rudnzVsMvp5g1P7TQV7BcEZNoDKGCJQyeQ';

// Use environment variables or fallback to development defaults
const finalSupabaseUrl = supabaseUrl || devUrl;
const finalSupabaseKey = supabaseAnonKey || devKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Using development Supabase credentials. API calls will fail, but the app will render.');
  console.warn('Please set up proper Supabase environment variables for full functionality.');
}

// Create Supabase client
export const supabase = createClient<Database>(finalSupabaseUrl, finalSupabaseKey);

export default supabase;
