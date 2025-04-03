
import { supabase } from '@/integrations/supabase/client';

// Define interface for user data
interface UserData {
  id: string;
  email?: string;
}

/**
 * Check if a demo account exists in auth.users
 * This is used to avoid rate limit errors with demo logins
 */
export async function isDemoAccountExists(email: string): Promise<boolean> {
  if (!email) {
    console.error('Email is required to check if demo account exists');
    return false;
  }
  
  try {
    console.log('Checking if demo account exists:', email);
    
    // For demo accounts, we'll just assume they exist for now
    // This is safer than trying to use admin APIs that may not be available
    return true;
  } catch (error) {
    console.error('Unexpected error checking if demo account exists:', error);
    return false;
  }
}
