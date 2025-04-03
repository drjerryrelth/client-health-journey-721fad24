
import { createClient } from '@supabase/supabase-js';

// Use the environment variables or fallback to configuration from integrations file
const SUPABASE_URL = "https://bgnoaxdomwkwvgcwccry.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnbm9heGRvbXdrd3ZnY3djY3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNDk2OTgsImV4cCI6MjA1ODkyNTY5OH0.Bqck-dqNfG_EBoq2oReUTaIlZ8zQ3fdpjgHNYhTKJYc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
