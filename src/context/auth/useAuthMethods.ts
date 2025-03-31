
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types';
import { UserData } from '@/types/auth';
import { loginWithEmail, signUpWithEmail, logoutUser } from '@/services/auth';

type UseAuthMethodsProps = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  toast: any;
};

export const useAuthMethods = ({ setIsLoading, toast }: UseAuthMethodsProps) => {
  const login = async (email: string, password: string) => {
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
      toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during login.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
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
  };

  const signUp = async (email: string, password: string, userData: { full_name: string; role: string }) => {
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
  };

  // Enhanced hasRole function with improved role checking logic
  const hasRole = (requiredRole: UserRole | UserRole[]) => (user: UserData | null) => {
    console.log('Checking role:', requiredRole, 'for user:', user);
    
    // If no user or no role, no permissions
    if (!user) {
      console.log('No user, so no role');
      return false;
    }
    
    // If checking for multiple roles (OR logic)
    if (Array.isArray(requiredRole)) {
      const hasAnyRole = requiredRole.includes(user.role);
      console.log(`User has any of [${requiredRole.join(', ')}]?`, hasAnyRole);
      return hasAnyRole;
    }
    
    // Single role check
    const hasSpecificRole = user.role === requiredRole;
    console.log(`User has role ${requiredRole}?`, hasSpecificRole);
    return hasSpecificRole;
  };

  return {
    login,
    logout,
    signUp,
    hasRole,
  };
};
