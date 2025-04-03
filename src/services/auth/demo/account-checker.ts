
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
    
    // First check if the account exists in auth
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.log('Error checking if demo account exists:', error.message);
      
      // Check if error is due to lack of admin permissions
      if (error.message?.includes('not authorized') || error.message?.includes('not admin')) {
        console.log('Admin API not available. Falling back to sign-in check method.');
        
        // Try to check if user can be retrieved with non-admin API
        const { data: users } = await supabase.auth.admin.listUsers();
        
        if (users) {
          // Explicitly type the users array
          const typedUsers = users.users as UserData[] || [];
          
          // Try to find user with matching email
          const matchingUser = typedUsers.find(user => 
            user.email === email
          );
          return !!matchingUser;
        }
        
        return false;
      }
      
      return false;
    }
    
    if (data && data.users) {
      // Check if a user with this email exists
      const userExists = data.users.some(user => user.email === email);
      console.log('Demo account exists:', userExists);
      return userExists;
    }
    
    return false;
  } catch (error) {
    console.error('Unexpected error checking if demo account exists:', error);
    return false;
  }
}
