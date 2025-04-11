import { supabase } from '@/integrations/supabase/client';

export async function logoutUser() {
  console.log('Logging out user');
  
  // Add timeout to prevent hanging
  const logoutPromise = supabase.auth.signOut();
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Logout timeout')), 30000);
  });
  
  try {
    // Race between actual logout and timeout
    await Promise.race([
      logoutPromise,
      timeoutPromise.then(() => {
        console.warn('Logout request timed out, forcing client-side logout');
        // Force client-side logout regardless
        localStorage.removeItem('sb-bgnoaxdomwkwvgcwccry-auth-token');
        return { error: null };
      }),
    ]);
    
    return { error: null };
  } catch (error) {
    console.error('Error during logout:', error);
    // Even if there's an error, we want to clear the local session
    localStorage.removeItem('sb-bgnoaxdomwkwvgcwccry-auth-token');
    return { error };
  }
}

export async function getCurrentSession() {
  // Add timeout to prevent hanging
  const sessionPromise = supabase.auth.getSession();
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Session check timeout')), 100000);
  });
  
  try {
    // Race between actual session check and timeout
    const result = await Promise.race([
      sessionPromise,
      timeoutPromise.then(() => {
        console.warn('Session check timed out');
        return { data: { session: null }, error: null };
      }),
    ]);
    
    return result;
  } catch (error) {
    console.error('Error getting session:', error);
    return { data: { session: null }, error };
  }
}

export function setupAuthListener(callback: (event: string, session: any) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  
  return { subscription };
}

// Enhanced session recovery with better error handling and logging
export async function attemptSessionRecovery() {
  console.log('Attempting to recover session...');
  try {
    // First check if we already have a valid session
    const sessionPromise = supabase.auth.getSession();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Session check timeout')), 30000); // Higher timeout
    });
    
    // Race between session check and timeout
    const currentSession = await Promise.race([
      sessionPromise,
      timeoutPromise.then(() => {
        console.warn('Session check timed out during recovery');
        return { data: { session: null }, error: null };
      }),
    ]);
    
    if (currentSession.data?.session) {
      console.log('Valid session already exists, no recovery needed');
      return { recovered: true, session: currentSession.data.session };
    }
    
    // If no valid session, try to refresh with timeout
    console.log('No valid session found, attempting refresh');
    const refreshPromise = supabase.auth.refreshSession();
    const refreshTimeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Session refresh timeout')), 30000); // Higher timeout
    });
    
    // Race between refresh and timeout
    const { data, error } = await Promise.race([
      refreshPromise,
      refreshTimeoutPromise.then(() => {
        console.warn('Session refresh timed out');
        return { data: { session: null }, error: new Error('Session refresh timed out') };
      }),
    ]);
    
    if (error) {
      console.error('Session recovery failed:', error.message);
      // Clean up any potential stale tokens
      if (error.message && (
        error.message.includes('token is expired') || 
        error.message.includes('Auth session missing') ||
        error.message.includes('timeout')
      )) {
        console.log('Token expired or missing, clearing local storage');
        localStorage.removeItem('sb-bgnoaxdomwkwvgcwccry-auth-token');
      }
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
