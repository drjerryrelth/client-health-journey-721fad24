
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  "https://bgnoaxdomwkwvgcwccry.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnbm9heGRvbXdrd3ZnY3djY3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNDk2OTgsImV4cCI6MjA1ODkyNTY5OH0.Bqck-dqNfG_EBoq2oReUTaIlZ8zQ3fdpjgHNYhTKJYc"
);
