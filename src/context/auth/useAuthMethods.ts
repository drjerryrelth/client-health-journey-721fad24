
import { AuthError, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, UserData } from '@/types/auth';

interface UseAuthMethodsProps {
  setIsLoading: (value: boolean) => void;
  toast: any;
}

export const useAuthMethods = ({ setIsLoading, toast }: UseAuthMethodsProps) => {
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      console.log('Login successful');
      return true;
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message || 'Failed to sign in');
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: { full_name: string; role: string }
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      if (error) throw error;
      toast.success('Registration successful! Please check your email for verification.');
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message || 'Failed to sign up');
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Improved hasRole function with better type safety
  const hasRole = (role: UserRole | UserRole[]) => (user: UserData | null): boolean => {
    if (!user) return false;
    
    // If no role requirement is specified, allow access
    if (!role) return true;
    
    // Handle array of roles
    if (Array.isArray(role)) {
      return role.includes(user.role as UserRole);
    }
    
    // Handle single role
    return user.role === role;
  };

  return {
    login,
    logout,
    signUp,
    hasRole,
  };
};
