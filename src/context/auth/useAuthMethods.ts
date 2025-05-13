import { useCallback } from 'react';
import { UserRole } from '@/types';
import { UserData } from '@/types/auth';
import { loginWithEmail, signUpWithEmail, logoutUser } from '@/services/auth';
import { isDemoAdminEmail, isDemoClinicAdminEmail, isDemoCoachEmail, isDemoClientEmail } from '@/services/auth/demo/utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

type UseAuthMethodsProps = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setUser?: React.Dispatch<React.SetStateAction<UserData | null>>;
  setSupabaseUser?: React.Dispatch<React.SetStateAction<any | null>>;
};

export const useAuthMethods = ({ 
  setIsLoading,
  setUser,
  setSupabaseUser 
}: UseAuthMethodsProps) => {
  const navigate = useNavigate();

  // Login method implementation
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await loginWithEmail(email, password);
      
      if (!result.data.user) {
        toast.error('No user returned from login');
        throw new Error('No user returned from login');
      }

      // Set the user state
      if (setUser && setSupabaseUser) {
        setSupabaseUser(result.data.user);
        
        // If user is a coach, fetch their coach_id
        let coach_id: string | undefined;
        if (result.role === 'coach') {
          const { data: coachData } = await supabase
            .from('coaches')
            .select('id')
            .eq('email', email)
            .single();
          coach_id = coachData?.id;
        }

        setUser({
          id: result.data.user.id,
          name: result.data.user.user_metadata?.full_name || email.split('@')[0],
          email: email,
          role: result.role,
          clinicId: result.data.user.user_metadata?.clinic_id || undefined,
          coach_id
        });
      }

      // Determine redirect path based on role
      let redirectPath = '/';
      switch (result.role) {
        case 'admin':
        case 'super_admin':
          redirectPath = '/admin/dashboard';
          break;
        case 'clinic_admin':
          redirectPath = '/admin/dashboard';
          break;
        case 'coach':
          redirectPath = '/coach/dashboard';
          break;
        case 'client':
          redirectPath = '/client';
          break;
        default:
          redirectPath = '/';
      }

      // Navigate to the appropriate dashboard
      navigate(redirectPath);
      
      return result;
    } catch (error: any) {
      console.error('Login error details:', error);
      toast.error(error.message || 'An error occurred during login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, navigate, setUser, setSupabaseUser]);

  // Logout method implementation
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      // Clear any local storage items
      localStorage.removeItem('sb-bgnoaxdomwkwvgcwccry-auth-token');
      
      // Attempt logout
      const { error } = await logoutUser();
      
      if (error) {
        toast.error('Failed to logout');
        throw error;
      }

      // Clear user state
      if (setUser && setSupabaseUser) {
        setUser(null);
        setSupabaseUser(null);
      }

      // Force a hard navigation to login page
      window.location.href = '/login';
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
      // Even if there's an error, we should still try to redirect
      window.location.href = '/login';
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setUser, setSupabaseUser]);

  // Sign up method implementation
  const signUp = useCallback(async (email: string, password: string, userData: { full_name: string; role: string }) => {
    setIsLoading(true);
    try {
      const result = await signUpWithEmail(email, password, userData);
      
      if (!result.user) {
        toast.error('No user returned from sign up');
        throw new Error('No user returned from sign up');
      }
      
      return result;
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'An error occurred during sign up');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  /**
   * Strictly check if a user has the required role(s)
   * This is a critical security function to properly enforce role-based access
   */
  const hasRole = useCallback((requiredRole: UserRole | UserRole[]) => (user: UserData | null) => {
    console.log('Checking role:', requiredRole, 'for user:', user);
    
    if (!user) {
      console.log('No user, access denied');
      return false;
    }
    
    // PRIORITY 0: Special check for demo client emails
    if (user.email && isDemoClientEmail(user.email)) {
      console.log('SECURITY: Demo client email detected, checking client-level access');
      
      // Convert required role to array for easier checking
      const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      
      // Client demo accounts should only access client routes
      if (requiredRoles.includes('client')) {
        console.log('SECURITY: Demo client email accessing client route, allowing access');
        return true;
      }
      
      // Block access to non-client routes
      console.log('SECURITY: Demo client attempting to access non-client route, denying access');
      return false;
    }
    
    // PRIORITY 1: Special check for demo admin email - highest priority check
    if (user.email && isDemoAdminEmail(user.email)) {
      console.log('SECURITY: Demo admin email detected, granting admin access');
      // Demo admin email always has system admin privileges regardless of stored role
      return true;
    }
    
    // PRIORITY 1.5: Special check for demo clinic admin email
    if (user.email && isDemoClinicAdminEmail(user.email)) {
      console.log('SECURITY: Demo clinic admin email detected, checking clinic-level access');
      // For clinic admins, we need to check if they're trying to access clinic-level resources
      // They should NOT have access to system-wide admin features
      
      // Convert required role to array for easier checking
      const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      
      // Check if the required roles include 'admin' but not 'clinic_admin' - this indicates a system-admin-only route
      if (requiredRoles.includes('admin') && !requiredRoles.includes('clinic_admin')) {
        console.log('SECURITY: Clinic admin attempting to access system admin route, denying access');
        return false;
      }
      
      // If required roles include 'clinic_admin', grant access
      if (requiredRoles.includes('clinic_admin')) {
        console.log('SECURITY: Clinic admin accessing permitted route');
        return true;
      }
      
      // For any other role requirement, use standard role checking
      console.log('SECURITY: Using standard role checking for clinic admin');
    }
    
    // PRIORITY 1.75: Special check for coach users 
    if (user.role === 'coach' || (user.email && isDemoCoachEmail(user.email))) {
      console.log('SECURITY: Coach role detected, checking appropriate access');
      
      // Convert required role to array for easier checking
      const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      
      // Check if the required roles include admin routes - coaches should not access these
      if (requiredRoles.includes('admin') || requiredRoles.includes('clinic_admin')) {
        console.log('SECURITY: Coach attempting to access admin route, denying access');
        return false;
      }
      
      // If required roles include 'coach', grant access
      if (requiredRoles.includes('coach')) {
        console.log('SECURITY: Coach accessing permitted route');
        return true;
      }
    }
    
    // PRIORITY 1.85: Special check for client users 
    if (user.role === 'client' || (user.email && isDemoClientEmail(user.email))) {
      console.log('SECURITY: Client role detected, checking appropriate access');
      
      // Convert required role to array for easier checking
      const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      
      // Check if the required roles include admin or coach routes - clients should not access these
      if (requiredRoles.includes('admin') || requiredRoles.includes('clinic_admin') || requiredRoles.includes('coach')) {
        console.log('SECURITY: Client attempting to access admin or coach route, denying access');
        return false;
      }
      
      // If required roles include 'client', grant access
      if (requiredRoles.includes('client')) {
        console.log('SECURITY: Client accessing permitted route');
        return true;
      }
    }
    
    // Get the actual user role for clarity
    const actualRole = user.role;
    console.log('Actual user role:', actualRole);
    
    // PRIORITY 2: Super admins and system admins should have access to everything
    if (actualRole === 'super_admin' || actualRole === 'admin') {
      console.log('User is super_admin or admin, granting access');
      return true;
    }
    
    // PRIORITY 3: Clinic admins have special restrictions - they should not access system admin routes
    if (actualRole === 'clinic_admin') {
      console.log('User is clinic_admin, checking restricted access');
      
      // Convert required role to array for easier checking
      const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      
      // Check if the required roles include 'admin' but not 'clinic_admin' - this indicates a system-admin-only route
      if (requiredRoles.includes('admin') && !requiredRoles.includes('clinic_admin')) {
        console.log('SECURITY: Clinic admin attempting to access system admin route, denying access');
        return false;
      }
      
      // If required roles include 'clinic_admin', grant access
      if (requiredRoles.includes('clinic_admin')) {
        console.log('SECURITY: Clinic admin accessing permitted route');
        return true;
      }
    }
    
    // PRIORITY 4: Convert required role to array for easier checking
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    // Matching roles check
    if (requiredRoles.includes(actualRole)) {
      console.log(`User has required role: ${actualRole}`);
      return true;
    }
    
    // No specific role check passed
    console.log(`No match for required roles: ${requiredRoles.join(', ')}`);
    return false;
  }, []);

  return {
    login,
    logout,
    signUp,
    hasRole,
  };
};
