
import { supabase } from '@/integrations/supabase/client';
import { isDemoEmail } from './utils';

/**
 * Check if a demo account already exists in the system
 */
export async function isDemoAccountExists(email: string): Promise<boolean> {
  if (!isDemoEmail(email)) {
    return false;
  }
  
  try {
    // Check if the user exists in auth.users
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('Error checking if demo account exists:', error);
      // Default to false if there's an error
      return false;
    }
    
    // If there are users with this email, the account exists
    return data && data.users && data.users.some(user => 
      user.email && user.email.toLowerCase() === email.toLowerCase()
    );
  } catch (err) {
    console.error('Unexpected error checking if demo account exists:', err);
    // Default to false in case of unexpected errors
    return false;
  }
}
