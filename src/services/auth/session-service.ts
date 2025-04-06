
import { supabase } from '@/integrations/supabase/client';

export async function logoutUser() {
  console.log('Logging out user');
  
  try {
    // Perform logout with a reasonable timeout
    const { error } = await Promise.race([
      supabase.auth.signOut(),
      new Promise<{error: Error}>((_, reject) => 
        setTimeout(() => reject(new Error('Logout timeout')), 10000)
      )
    ]);
    
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
    // Use a more conservative timeout for session check
    const sessionPromise = supabase.auth.getSession();
    
    const sessionResult = await Promise.race([
      sessionPromise,
      new Promise<{data: {session: null}, error: Error}>((_, reject) => 
        setTimeout(() => {
          console.warn('Session check timed out, returning empty session');
          return {data: {session: null}, error: new Error('Session check timeout')};
        }, 8000)
      )
    ]);
    
    return sessionResult;
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
    // First try to get a session with a short timeout
    const { data: sessionData } = await Promise.race([
      supabase.auth.getSession(),
      new Promise<{data: {session: null}}>((resolve) => 
        setTimeout(() => resolve({data: {session: null}}), 5000)
      )
    ]);
    
    if (sessionData?.session) {
      console.log('Valid session already exists, no recovery needed');
      return { recovered: true, session: sessionData.session };
    }
    
    // If no valid session, try to refresh with a short timeout
    const { data, error } = await Promise.race([
      supabase.auth.refreshSession(),
      new Promise<{data: {session: null}, error: Error}>((_, reject) => 
        setTimeout(() => reject(new Error('Session refresh timeout')), 5000)
      )
    ]);
    
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
