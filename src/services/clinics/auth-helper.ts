
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

/**
 * Helper function to check if user is authenticated
 * Returns the session if authenticated, null otherwise
 */
export async function checkAuthentication(): Promise<Session | null> {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Authentication error:', error.message);
      return null;
    }
    
    if (!data.session) {
      console.log('No active session found');
      return null;
    }
    
    return data.session;
  } catch (err) {
    console.error('Unexpected error during authentication check:', err);
    return null;
  }
}
