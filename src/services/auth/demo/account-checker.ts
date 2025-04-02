
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
      const { data: authData } = await supabase.auth.admin.listUsers({
        filter: { email }
      });
      
      if (authData?.users && authData.users.length > 0) {
        console.log(`Demo account for ${email} already exists in auth.users`);
        return true;
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
