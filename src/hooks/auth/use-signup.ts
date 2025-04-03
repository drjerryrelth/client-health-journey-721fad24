
import { useState } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { SignupFormValues } from '@/components/auth/signup-schema';
import { supabase } from '@/integrations/supabase/client';
import { isDemoClinicEmail, handleDemoClinicSignup } from '@/services/auth/demo';

export const useSignup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleSignup = async (data: SignupFormValues) => {
    setIsSubmitting(true);

    try {
      console.log('Attempting clinic signup with:', data.email);
      
      // Check if this is a demo clinic signup
      const isDemoClinic = isDemoClinicEmail(data.email);
      
      if (isDemoClinic) {
        console.log('Processing as demo clinic signup');
        
        // Handle demo clinic signup
        const success = await handleDemoClinicSignup(
          data.email, 
          data.password,
          data.clinicName,
          data.primaryContact
        );
        
        if (success) {
          toast({
            title: 'Demo clinic created successfully',
            description: 'Your demo clinic has been created. You can now log in with your credentials.',
          });
        } else {
          throw new Error('Failed to create demo clinic');
        }
      } else {
        // Standard signup flow for regular clinics
        try {
          await signUp(data.email, data.password, {
            full_name: data.primaryContact,
            role: 'coach' // Default role for clinic primary contact is coach
          });
          
          // Then create a clinic record
          const { error: clinicError } = await supabase
            .from('clinics')
            .insert({
              name: data.clinicName,
              email: data.email,
              primary_contact: data.primaryContact,
              status: 'active'
            });
            
          if (clinicError) throw clinicError;
          
          toast({
            title: 'Clinic registration successful',
            description: 'Your clinic account has been created. Please check your email to confirm.',
          });
        } catch (signUpError: any) {
          throw signUpError;
        }
      }
      
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
