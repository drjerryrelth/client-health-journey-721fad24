
import { useState } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types';
import { demoEmails } from '@/services/auth/demo';
import { useNavigate } from 'react-router-dom';
import { isDemoCoachEmail } from '@/services/auth/demo/utils';

export const useDemoLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDemoLogin = async (type: UserRole, email: string) => {
    console.log(`Demo login clicked for ${type} with email ${email}`);
    setIsSubmitting(true);
    
    // Admin demo account special handling
    if (type === 'admin') {
      email = demoEmails.admin; // Always use the correct admin email from constants
      console.log(`Using admin demo account: ${email}`);
    }
    
    // Coach demo account special handling
    if (type === 'coach' && !isDemoCoachEmail(email)) {
      email = demoEmails.coach; // Use the primary coach email if not already using a coach demo email
      console.log(`Using coach demo account: ${email}`);
    }
    
    try {
      const password = 'password123'; // Demo password
      
      console.log(`Attempting demo login as ${type} with email: ${email}`);
      
      await login(email, password);
      
      toast({
        title: 'Demo login successful',
        description: `You're logged in as ${type}!`,
      });
      
      // Navigation will happen automatically through auth context
            
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
