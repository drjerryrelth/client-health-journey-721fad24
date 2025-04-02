
import { useState } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types';
import { LoginFormValues } from '@/components/auth/login-schema';
import { demoEmails, isDemoAccountExists } from '@/services/auth/demo';

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

  const handleDemoLogin = async (type: UserRole, email: string) => {
    console.log(`Demo login clicked for ${type} with email ${email}`);
    setIsSubmitting(true);
    
    // Admin demo account special handling
    if (type === 'admin') {
      email = demoEmails.admin; // Always use the correct admin email from constants
      console.log(`Using admin demo account: ${email}`);
    }
    
    // No need to fix coach email - we're now using the correct email from constants
    
    try {
      const password = 'password123'; // Demo password
      let fullName = '';
      let role = type;
      
      // Set the full name based on role type
      switch (type) {
        case 'admin':
          fullName = 'Admin User';
          break;
        case 'coach':
          fullName = 'Coach User';
          break;
        case 'client':
          fullName = 'Client User';
          break;
        case 'super_admin':
          fullName = 'Super Admin User';
          break;
        case 'clinic_admin':
          role = 'admin'; // For clinic_admin, we still use 'admin' role but with a clinicId
          fullName = 'Clinic Admin User';
          break;
      }
      
      console.log(`Attempting demo login as ${type} with email: ${email}`);
      
      try {
        // Check if the account already exists to avoid rate limit errors
        const accountExists = await isDemoAccountExists(email);
        
        if (accountExists) {
          console.log('Demo account already exists, attempting direct login');
          await login(email, password);
          console.log('Demo login successful');
          toast({
            title: 'Demo login successful',
            description: `You're logged in as ${type}!`,
          });
          setIsSubmitting(false);
          return;
        }
        
        // First try to login directly - if the account exists but wasn't detected
        await login(email, password);
        console.log('Demo login successful');
      } catch (loginError: any) {
        console.log('Login failed, attempting to create demo account', loginError);
        
        // Special handling for email not confirmed errors
        if (loginError.message?.includes('Email not confirmed')) {
          toast({
            title: 'Email confirmation required',
            description: 'For demo accounts, please check the Supabase User Management section to confirm the email manually or disable email confirmation in the settings.',
            variant: 'destructive',
          });
          
          setIsSubmitting(false);
          return;
        }
        
        try {
          // Try to sign up the demo user
          console.log('Creating demo account for:', email);
          await signUp(email, password, {
            full_name: fullName,
            role: role
          });
          
          console.log('Demo account created, now logging in');
          
          // Now try logging in again
          await login(email, password);
        } catch (signupError: any) {
          // If the signup fails because the user already exists, try logging in again
          if (signupError.message?.includes('already registered')) {
            console.log('User already exists, trying login again with different handling');
            await login(email, password);
          } else if (signupError.message?.includes('after 59 seconds') || 
                    signupError.message?.includes('rate limit') ||
                    signupError.message?.includes('security purposes')) {
            console.error('Rate limit error during demo signup:', signupError);
            toast({
              title: 'Demo account setup paused',
              description: 'Please wait a minute before trying again, or try logging in with a different demo account.',
              variant: 'destructive',
            });
            setIsSubmitting(false);
            return;
          } else {
            throw signupError;
          }
        }
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
