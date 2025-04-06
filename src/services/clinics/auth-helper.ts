
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

/**
 * Helper function to check if user is authenticated
 * Returns the session if authenticated, null otherwise
 */
export async function checkAuthentication(): Promise<Session | null> {
  try {
    // First try to get the session from localStorage for immediate access
    const storedSession = localStorage.getItem('supabase.auth.token');
    
    // Get session from Supabase directly - this is the most reliable method
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Authentication error:', error.message);
      return null;
    }
    
    if (!data.session) {
      console.log('No active session found in Supabase');
      
      // If no session in Supabase but we have one in localStorage, clear it to prevent confusion
      if (storedSession) {
        console.log('Clearing stale localStorage session');
        localStorage.removeItem('supabase.auth.token');
      }
      
      return null;
    }
    
    // Log successful authentication for debugging
    console.log('Active session found for user:', data.session.user.id);
    return data.session;
  } catch (err) {
    console.error('Unexpected error during authentication check:', err);
    return null;
  }
}

/**
 * Simple synchronous check for authentication state
 * This doesn't make API calls and just checks local storage
 * Use for UI purposes only, not for secure data access
 */
export function isAuthenticatedSync(): boolean {
  try {
    // Check if we have a session token stored
    const session = localStorage.getItem('supabase.auth.token');
    return !!session;
  } catch (err) {
    console.error('Error checking sync auth state:', err);
    return false;
  }
}
