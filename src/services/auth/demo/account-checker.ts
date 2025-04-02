
import { supabase } from '@/integrations/supabase/client';

// Helper function to check if a demo account already exists without triggering rate limits
export const isDemoAccountExists = async (email: string): Promise<boolean> => {
  try {
    // Use a safe method to check existence that won't trigger rate limits
    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .maybeSingle();
    
    if (!error && data) {
      console.log(`Demo account for ${email} already exists in profiles table`);
      return true;
    }
    
    // Try another check against auth users (admin only method, might not work for all cases)
    try {
      // Remove the filter parameter which was causing the TypeScript error
      // The admin.listUsers() method doesn't support filtering by email in the way we were using it
      const { data: authData } = await supabase.auth.admin.listUsers();
      
      // Instead, manually filter the results after fetching
      if (authData?.users) {
        // Use type assertion to help TypeScript understand the structure
        const matchingUser = authData.users.find(user => 
          user && typeof user === 'object' && 'email' in user && user.email === email
        );
        if (matchingUser) {
          console.log(`Demo account for ${email} already exists in auth.users`);
          return true;
        }
      }
    } catch (adminError) {
      // Admin API likely not available to the client, silently continue
      console.log('Admin API not available, continuing with regular checks');
    }
    
    return false;
  } catch (error) {
    console.error('Error checking if demo account exists:', error);
    // Assume it might exist to avoid creating duplicates
    return true;
  }
};
