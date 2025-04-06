
import { supabase } from '@/integrations/supabase/client';

export async function logoutUser() {
  console.log('Logging out user');
  
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error during logout:', error);
    // Always clear the local session on error to prevent being stuck
    localStorage.removeItem('sb-bgnoaxdomwkwvgcwccry-auth-token');
    return { error };
  }
}

export async function getCurrentSession() {
  try {
    return await supabase.auth.getSession();
  } catch (error) {
    console.error('Error getting current session:', error);
    return { data: { session: null }, error };
  }
}

export function setupAuthListener(callback: (event: string, session: any) => void) {
  console.log('Setting up auth listener');
  return supabase.auth.onAuthStateChange(callback);
}

export async function attemptSessionRecovery() {
  console.log('Attempting to recover session...');
  try {
    // First try to get a session
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (sessionData?.session) {
      console.log('Valid session already exists, no recovery needed');
      return { recovered: true, session: sessionData.session };
    }
    
    // If no valid session, try to refresh
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Session recovery failed:', error.message);
      // Clean up any potential stale tokens
      localStorage.removeItem('sb-bgnoaxdomwkwvgcwccry-auth-token');
      return { recovered: false, error };
    }
    
    if (data.session) {
      console.log('Session successfully recovered');
      return { recovered: true, session: data.session };
    } else {
      console.log('No session to recover');
      return { recovered: false, error: null };
    }
  } catch (e) {
    console.error('Exception during session recovery:', e);
    // Cleanup on any error
    localStorage.removeItem('sb-bgnoaxdomwkwvgcwccry-auth-token');
    return { recovered: false, error: e };
  }
}
