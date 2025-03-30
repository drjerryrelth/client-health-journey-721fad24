
import { UserRole } from '@/types';
import { UserData } from '@/types/auth';
import { 
  loginWithEmail, 
  signUpWithEmail, 
  logoutUser 
} from '@/services/auth';

type UseAuthMethodsProps = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  toast: any;
};

export const useAuthMethods = ({
  setIsLoading,
  toast
}: UseAuthMethodsProps) => {

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      await loginWithEmail(email, password);
      return Promise.resolve();
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Provide specific error messages based on error code
      let errorMessage = 'Invalid email or password';
      
      if (error.message.includes('Invalid login')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.message.includes('rate limited')) {
        errorMessage = 'Too many login attempts. Please try again later.';
      } else if (error.message.includes('Email not confirmed')) {
        // For demo purposes, we'll handle this case specially
        const isDemoLogin = email === 'drrelth@contourlight.com';
        if (isDemoLogin) {
          errorMessage = 'This demo account requires email confirmation in Supabase. To use the demo account, please go to Supabase User Management and confirm the email manually.';
        } else {
          errorMessage = 'Please check your email and confirm your account before logging in.';
        }
      }
      
      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: { full_name: string; role: string }) => {
    setIsLoading(true);
    
    try {
      await signUpWithEmail(email, password, userData);
      
      const isDemoAccount = email === 'drrelth@contourlight.com';
      
      if (isDemoAccount) {
        toast({
          title: 'Demo account created',
          description: 'Since email confirmation is required, please go to the Supabase User Management panel to confirm the email manually.',
        });
      } else {
        toast({
          title: 'Account created',
          description: 'Please check your email to confirm your account before logging in.',
        });
      }
      
      return Promise.resolve();
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      let errorMessage = error.message || 'Could not create account';
      
      // Handle specific Supabase signup errors
      if (error.message?.includes('email address is invalid')) {
        errorMessage = 'The email address format is invalid. Please use a different email.';
      } else if (error.message?.includes('already registered')) {
        errorMessage = 'This email is already registered. Please try logging in instead.';
      }
      
      toast({
        title: 'Account creation failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'There was a problem signing out.',
        variant: 'destructive',
      });
    }
  };

  const hasRole = (role: UserRole | UserRole[], currentUser: UserData | null = null) => {
    if (!currentUser) return false;
    
    if (Array.isArray(role)) {
      return role.includes(currentUser.role);
    }
    
    return currentUser.role === role;
  };

  return {
    login,
    signUp,
    logout,
    hasRole: (role: UserRole | UserRole[]) => (user: UserData | null = null) => hasRole(role, user)
  };
};
