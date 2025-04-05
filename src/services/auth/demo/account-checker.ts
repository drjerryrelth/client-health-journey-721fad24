
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
    
    // Type the users data properly to fix the TypeScript error
    if (data && data.users && Array.isArray(data.users)) {
      // Check if any user has the matching email
      return data.users.some(user => 
        user && typeof user === 'object' && 'email' in user && 
        user.email && user.email.toLowerCase() === email.toLowerCase()
      );
    }
    
    // Default to false if data structure is unexpected
    return false;
  } catch (err) {
    console.error('Unexpected error checking if demo account exists:', err);
    // Default to false in case of unexpected errors
    return false;
  }
}
