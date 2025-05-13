
import { useState } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { LoginFormValues } from '@/components/auth/login-schema';
import { cleanupAuthState } from '@/utils/auth-utils';

export const useRegularLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    console.log('Regular login attempt initiated', { email: data.email });

    try {
      // Clean up any existing auth state to avoid conflict
      cleanupAuthState();
      
      console.log('Attempting login with:', data.email);
      await login(data.email, data.password);
      toast({
        title: 'Login successful',
        description: 'Welcome to Client Health Tracker!',
      });
      
      // Navigation will be handled by the auth state listener
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during login',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleLogin
  };
};
