
import { useState } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types';
import { demoEmails } from '@/services/auth/demo';
import { useNavigate } from 'react-router-dom';
import { isDemoCoachEmail, isDemoClientEmail, isDemoAdminEmail, isDemoClinicAdminEmail } from '@/services/auth/demo/utils';
import { cleanupAuthState } from './use-login-handler';

export const useDemoLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDemoLogin = async (type: UserRole, email: string) => {
    console.log(`Demo login clicked for ${type} with email ${email}`);
    setIsSubmitting(true);
    
    // Validate demo email based on requested role type
    let validatedEmail = email;
    
    // Admin demo account special handling
    if (type === 'admin' && !isDemoAdminEmail(email)) {
      validatedEmail = demoEmails.admin; // Always use the correct admin email from constants
      console.log(`Using admin demo account: ${validatedEmail}`);
    }
    
    // Clinic admin demo account special handling
    if (type === 'clinic_admin' && !isDemoClinicAdminEmail(email)) {
      validatedEmail = demoEmails.clinicAdmin; // Use the primary clinic admin email
      console.log(`Using clinic admin demo account: ${validatedEmail}`);
    }
    
    // Coach demo account special handling
    if (type === 'coach' && !isDemoCoachEmail(email)) {
      validatedEmail = demoEmails.coach; // Use the primary coach email if not already using a coach demo email
      console.log(`Using coach demo account: ${validatedEmail}`);
    }
    
    // Client demo account special handling
    if (type === 'client' && !isDemoClientEmail(email)) {
      validatedEmail = demoEmails.client; // Use the primary client email if not already using a client demo email
      console.log(`Using client demo account: ${validatedEmail}`);
    }
    
    try {
      const password = 'password123'; // Demo password

      // Clean up any existing auth state to avoid conflict
      cleanupAuthState();
      
      console.log(`Attempting demo login as ${type} with email: ${validatedEmail}`);
      
      await login(validatedEmail, password);
      
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
