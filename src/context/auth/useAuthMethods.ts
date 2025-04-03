
import { useCallback } from 'react';
import { UserRole } from '@/types';
import { UserData } from '@/types/auth';
import { loginWithEmail, signUpWithEmail, logoutUser } from '@/services/auth';

type UseAuthMethodsProps = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  toast: any;
};

export const useAuthMethods = ({ setIsLoading, toast }: UseAuthMethodsProps) => {
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
   * CRUCIAL FIX: This function was allowing clinic admins to have system admin permissions
   */
  const hasRole = useCallback((requiredRole: UserRole | UserRole[]) => (user: UserData | null) => {
    console.log('Checking role:', requiredRole, 'for user:', user);
    
    if (!user) {
      console.log('No user, so no role');
      return false;
    }
    
    // CRITICAL CHANGE: Use strict role checking for different admin types
    // System admin roles - admin, super_admin
    // Special role - clinic_admin (has access to admin dashboard but limited to their clinic)
    // User roles - coach, client
    
    // Get the actual user role for clarity
    const actualRole = user.role;
    const isSuperAdmin = actualRole === 'super_admin';
    const isSystemAdmin = actualRole === 'admin';
    const isClinicAdmin = actualRole === 'clinic_admin';
    const isCoach = actualRole === 'coach';
    const isClient = actualRole === 'client';
    
    console.log({isSuperAdmin, isSystemAdmin, isClinicAdmin, isCoach, isClient});
    
    // Convert required role to array for easier checking
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    // IMPORTANT: Strictly enforce role separation
    // If admin is required, only system admins can access (never clinic admins)
    if (requiredRoles.includes('admin')) {
      return isSystemAdmin || isSuperAdmin;
    }
    
    // If clinic_admin is required, clinic admins, system admins and super admins can access
    if (requiredRoles.includes('clinic_admin')) {
      return isClinicAdmin || isSystemAdmin || isSuperAdmin;
    }
    
    // For coach role
    if (requiredRoles.includes('coach')) {
      return isCoach || isSystemAdmin || isSuperAdmin;
    }
    
    // For client role
    if (requiredRoles.includes('client')) {
      return isClient || isSystemAdmin || isSuperAdmin;
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
