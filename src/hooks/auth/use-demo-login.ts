
import { useState } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types';
import { demoEmails } from '@/services/auth/demo';

export const useDemoLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleDemoLogin = async (type: UserRole, email: string) => {
    console.log(`Demo login clicked for ${type} with email ${email}`);
    setIsSubmitting(true);
    
    try {
      const password = 'password123'; // Standard demo password
      
      console.log(`Attempting demo login with email: ${email}`);
      
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: 'Demo login successful',
          description: `You're logged in as ${type}!`,
        });
      }
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
    handleDemoLogin
  };
};
