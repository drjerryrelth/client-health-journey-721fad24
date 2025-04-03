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

  const hasRole = useCallback((requiredRole: UserRole | UserRole[]) => (user: UserData | null) => {
    console.log('Checking role:', requiredRole, 'for user:', user);
    
    if (!user) {
      console.log('No user, so no role');
      return false;
    }
    
    const isSuperAdmin = user.role === 'super_admin';
    const isSystemAdmin = user.role === 'admin';
    const isClinicAdmin = user.role === 'clinic_admin';
    
    console.log('Is clinic admin?', isClinicAdmin);
    console.log('Is system admin?', isSystemAdmin);
    console.log('Is super admin?', isSuperAdmin);

    if ((Array.isArray(requiredRole) && requiredRole.includes('admin')) || requiredRole === 'admin') {
      return isSystemAdmin || isSuperAdmin;
    }
    
    if ((Array.isArray(requiredRole) && requiredRole.includes('clinic_admin')) || requiredRole === 'clinic_admin') {
      return isClinicAdmin || isSystemAdmin || isSuperAdmin;
    }
    
    if (Array.isArray(requiredRole)) {
      const hasAnyRole = requiredRole.some(role => user.role === role);
      console.log(`User has any of [${requiredRole.join(', ')}]?`, hasAnyRole);
      return hasAnyRole;
    }
    
    const hasSpecificRole = user.role === requiredRole;
    console.log(`User has role ${requiredRole}?`, hasSpecificRole);
    return hasSpecificRole;
  }, []);

  return {
    login,
    logout,
    signUp,
    hasRole,
  };
};
