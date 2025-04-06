
import { useCallback } from 'react';
import { UserRole } from '@/types';
import { UserData } from '@/types/auth';
import { loginWithEmail, signUpWithEmail, logoutUser } from '@/services/auth';
import { isDemoAdminEmail } from '@/services/auth/demo/utils';

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
    
    // PRIORITY 1: Special check for demo admin email - highest priority check
    if (user.email && isDemoAdminEmail(user.email)) {
      console.log('SECURITY: Demo admin email detected, granting admin access');
      // Demo admin email always has system admin privileges regardless of stored role
      return true;
    }
    
    // Get the actual user role for clarity
    const actualRole = user.role;
    console.log('Actual user role:', actualRole);
    
    // PRIORITY 2: Super admins and system admins should have access to everything
    if (actualRole === 'super_admin' || actualRole === 'admin') {
      console.log('User is super_admin or admin, granting access');
      return true;
    }
    
    // PRIORITY 3: Convert required role to array for easier checking
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
