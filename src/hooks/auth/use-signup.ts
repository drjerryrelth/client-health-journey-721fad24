
import { useState } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { SignupFormValues } from '@/components/auth/signup-schema';

export const useSignup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleSignup = async (data: SignupFormValues) => {
    setIsSubmitting(true);

    try {
      console.log('Attempting signup with:', data.email);
      await signUp(data.email, data.password, {
        full_name: data.fullName,
        role: 'client' // Default role for new signups
      });
      
      toast({
        title: 'Signup successful',
        description: 'Your account has been created. Please check your email to confirm.',
      });
      
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup failed',
        description: error.message || 'An error occurred during signup',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSignup
  };
};
