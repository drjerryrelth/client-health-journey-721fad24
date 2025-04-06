
import { supabase } from '@/integrations/supabase/client';
import { isDemoEmail, isDemoAdminEmail } from './utils';

/**
 * Check if a demo account already exists in the system
 */
export async function isDemoAccountExists(email: string): Promise<boolean> {
  if (!isDemoEmail(email)) {
    return false;
  }
  
  // Special case for demo admin email - we want to ensure this account exists
  // so return false to trigger account creation
  if (isDemoAdminEmail(email)) {
    console.log('Demo admin email detected, checking if account exists');
    
    try {
      // For demo admin, use a different approach - check auth users directly
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        console.error('Error checking if demo admin account exists:', error);
        // For demo admin, default to false to ensure account creation
        return false;
      }
      
      // Check if any user has the matching email
      const adminExists = data?.users?.some(user => 
        user?.email?.toLowerCase() === email.toLowerCase()
      ) || false;
      
      console.log('Demo admin account exists:', adminExists);
      return adminExists;
    } catch (err) {
      console.error('Unexpected error checking if demo admin account exists:', err);
      // Default to false to ensure account creation
      return false;
    }
  }
  
  // For non-admin demo accounts, proceed with regular check
  try {
    // Check if the user exists in auth.users
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('Error checking if demo account exists:', error);
      // Default to false if there's an error
      return false;
    }
    
    // Check if any user has the matching email
    return data?.users?.some(user => 
      user?.email?.toLowerCase() === email.toLowerCase()
    ) || false;
  } catch (err) {
    console.error('Unexpected error checking if demo account exists:', err);
    // Default to false in case of unexpected errors
    return false;
  }
}
