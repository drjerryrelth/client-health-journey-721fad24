
import { supabase } from '@/integrations/supabase/client';

export async function logoutUser() {
  console.log('Logging out user');
  
  // Add timeout to prevent hanging
  const logoutPromise = supabase.auth.signOut();
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Logout timeout')), 5000);
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
    setTimeout(() => reject(new Error('Session check timeout')), 5000);
  });
  
  try {
    // Race between actual session check and timeout
    return await Promise.race([
      sessionPromise,
      timeoutPromise.then(() => {
        console.warn('Session check timed out');
        return { data: { session: null }, error: null };
      }),
    ]);
  } catch (error) {
    console.error('Error getting current session:', error);
    return { data: { session: null }, error };
  }
}

export function setupAuthListener(callback: (event: string, session: any) => void) {
  console.log('Setting up auth listener');
  return supabase.auth.onAuthStateChange(callback);
}

// New function to attempt session recovery
export async function attemptSessionRecovery() {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Session recovery failed:', error.message);
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
    return { recovered: false, error: e };
  }
}
