
import { useState } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { SignupFormValues } from '@/components/auth/signup-schema';
import { supabase } from '@/integrations/supabase/client';

export const useSignup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleSignup = async (data: SignupFormValues) => {
    setIsSubmitting(true);

    try {
      console.log('Attempting clinic signup with:', data.email);
      
      // First create the auth user
      const { data: authData, error: signUpError } = await signUp(data.email, data.password, {
        full_name: data.primaryContact,
        role: 'coach' // Default role for clinic primary contact is coach
      });
      
      if (signUpError) throw signUpError;
      
      if (authData?.user?.id) {
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
      }
      
      toast({
        title: 'Clinic registration successful',
        description: 'Your clinic account has been created. Please check your email to confirm.',
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
