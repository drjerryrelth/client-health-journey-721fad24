import { useCallback } from 'react';
import { UserRole } from '@/types';
import { UserData } from '@/types/auth';
import { loginWithEmail, signUpWithEmail, logoutUser } from '@/services/auth';

type UseAuthMethodsProps = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  toast: any;
};

export const useAuthMethods = ({ setIsLoading, toast }: UseAuthMethodsProps) => {
  // Login method implementation
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await loginWithEmail(email, password);
      
      if (!result.user) {
        toast({
          title: 'Login failed',
          description: 'No user returned from login',
          variant: 'destructive',
        });
        throw new Error('No user returned from login');
      }
      
      return result;
    } catch (error: any) {
      console.error('Login error details:', error);
      toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during login.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, toast]);

  // Logout method implementation
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      const { error } = await logoutUser();
      
      if (error) {
        toast({
          title: 'Logout failed',
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Logout failed',
        description: error.message || 'An error occurred during logout.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, toast]);

  // Sign up method implementation
  const signUp = useCallback(async (email: string, password: string, userData: { full_name: string; role: string }) => {
    setIsLoading(true);
    try {
      const result = await signUpWithEmail(email, password, userData);
      
      toast({
        title: 'Sign up successful',
        description: 'Your account has been created.',
      });
      
      return result;
    } catch (error: any) {
      toast({
        title: 'Sign up failed',
        description: error.message || 'An error occurred during sign up.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, toast]);

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
    
    // Get the actual user role for clarity
    const actualRole = user.role;
    console.log('Actual user role:', actualRole);
    
    // Determine role types for strict checking
    const isSuperAdmin = actualRole === 'super_admin';
    const isSystemAdmin = actualRole === 'admin';
    const isClinicAdmin = actualRole === 'clinic_admin';
    const isCoach = actualRole === 'coach';
    const isClient = actualRole === 'client';
    
    console.log('Role checks:', {isSuperAdmin, isSystemAdmin, isClinicAdmin, isCoach, isClient});
    
    // Convert required role to array for easier checking
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    // CRITICAL SECURITY FIX: Super admins and system admins should have access to everything
    if (isSuperAdmin || isSystemAdmin) {
      console.log('User is super_admin or admin, granting access to:', requiredRoles);
      return true;
    }
    
    // For other roles, check if the user's role is in the required roles
    if (requiredRoles.includes(actualRole)) {
      console.log(`User has required role: ${actualRole}`);
      return true;
    }
    
    // Special case: if clinic_admin is required and user is clinic_admin, grant access
    if (requiredRoles.includes('clinic_admin') && isClinicAdmin) {
      console.log('User is clinic_admin, granting access to clinic_admin resources');
      return true;
    }
    
    // Special case: if coach is required and user is coach, grant access
    if (requiredRoles.includes('coach') && isCoach) {
      console.log('User is coach, granting access to coach resources');
      return true;
    }
    
    // Special case: if client is required and user is client, grant access
    if (requiredRoles.includes('client') && isClient) {
      console.log('User is client, granting access to client resources');
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
