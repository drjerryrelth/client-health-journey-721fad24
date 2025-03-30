
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types';
import { LoginFormValues } from '@/components/auth/login-schema';

export const useLoginHandler = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signUp } = useAuth();
  const { toast } = useToast();
  
  const handleLogin = async (data: LoginFormValues) => {
    setIsSubmitting(true);

    try {
      console.log('Attempting login with:', data.email);
      await login(data.email, data.password);
      toast({
        title: 'Login successful',
        description: 'Welcome to Client Health Tracker!',
      });
      
      // Navigation will be handled by the auth state listener
    } catch (error) {
      console.error('Login error:', error);
      // Toast notification is handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (type: UserRole) => {
    setIsSubmitting(true);
    
    try {
      let email = '';
      const password = 'password123'; // Demo password
      let fullName = '';
      let role = type;
      
      // Use Gmail domain to ensure email validation succeeds
      switch (type) {
        case 'admin':
          email = 'admin.demo@gmail.com';
          fullName = 'Admin User';
          break;
        case 'coach':
          email = 'coach.demo@gmail.com';
          fullName = 'Coach User';
          break;
        case 'client':
          email = 'client.demo@gmail.com';
          fullName = 'Client User';
          break;
      }
      
      console.log(`Attempting demo login as ${type} with email: ${email}`);
      
      try {
        // First try to login directly
        await login(email, password);
        console.log('Demo login successful');
      } catch (loginError) {
        console.log('Login failed, attempting to create demo account', loginError);
        
        // If login fails, try to sign up the demo user first
        await signUp(email, password, {
          full_name: fullName,
          role: role
        });
        
        console.log('Demo account created, now logging in');
        
        // Now try logging in again
        await login(email, password);
      }
      
      toast({
        title: 'Demo login successful',
        description: `You're logged in as ${type}!`,
      });
      
      // Navigation will be handled by the auth state listener
    } catch (error: any) {
      console.error('Demo login error:', error);
      toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during demo login.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleLogin,
    handleDemoLogin
  };
};
