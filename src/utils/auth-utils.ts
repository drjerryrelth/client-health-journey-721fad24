
/**
 * Shared utility functions for authentication
 */

// Function to clean up auth state that is not dependent on any hooks
export const cleanupAuthState = () => {
  console.log('Cleaning up auth state before auth operation');
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });

  // Also clean sessionStorage if used
  try {
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (e) {
    // Ignore errors if sessionStorage is not available
  }
};

/**
 * Helper function to determine if an initial auth state check has been completed
 * to prevent access denied errors during auth initialization
 */
export const shouldAllowAccess = (
  isLoading: boolean, 
  user: any, 
  initialAuthCheckComplete?: boolean
) => {
  // Don't deny access while still loading or before initial check is complete
  if (isLoading || (initialAuthCheckComplete === false)) {
    console.log('Auth check still in progress, allowing temporary access');
    return true;
  }
  
  // Once loading is complete, require a valid user
  return !!user;
};
