
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ClinicSignupForm } from '@/components/clinic-signup';
import { ClinicSignupFormValues, CoachFormData } from '@/components/clinic-signup/types';

const ClinicSignup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ClinicSignupFormValues, additionalCoaches: CoachFormData[]) => {
    setIsSubmitting(true);
    const createAccount = values.email !== '';
    
    try {
      const { data: clinicData, error: clinicError } = await supabase
        .from('clinics')
        .insert({
          name: values.clinicName,
          email: values.clinicEmail,
          phone: values.clinicPhone,
          street_address: values.streetAddress,
          city: values.city,
          state: values.state,
          zip: values.zipCode,
          primary_contact: values.primaryContact,
          status: 'active'
        })
        .select('id')
        .single();

      if (clinicError) throw new Error(`Failed to create clinic: ${clinicError.message}`);
      
      const clinicId = clinicData.id;
      
      let userId = null;
      
      if (createAccount) {
        const { data: userData, error: signUpError } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              full_name: values.primaryContact,
              role: 'coach',
              clinic_id: clinicId
            }
          }
        });

        if (signUpError) throw new Error(`Failed to create account: ${signUpError.message}`);
        userId = userData.user?.id;
        
        if (userId) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              full_name: values.primaryContact,
              email: values.email,
              role: 'coach',
              clinic_id: clinicId
            });
            
          if (profileError) {
            console.error("Error updating profile:", profileError);
          }
        }
      }
      
      const { error: primaryCoachError } = await supabase
        .from('coaches')
        .insert({
          name: values.primaryContact,
          email: values.email || values.clinicEmail,
          phone: values.clinicPhone,
          status: 'active',
          clinic_id: clinicId
        });
        
      if (primaryCoachError) throw new Error(`Failed to create primary coach: ${primaryCoachError.message}`);
      
      if (additionalCoaches.length > 0) {
        const coachRecords = additionalCoaches.map(coach => ({
          name: coach.name,
          email: coach.email,
          phone: coach.phone,
          status: 'active',
          clinic_id: clinicId
        }));
        
        const { error: additionalCoachesError } = await supabase
          .from('coaches')
          .insert(coachRecords);
          
        if (additionalCoachesError) {
          console.warn(`Some additional coaches may not have been created: ${additionalCoachesError.message}`);
          toast({
            title: "Warning",
            description: "Some additional coaches may not have been created",
            variant: "destructive"
          });
        }
      }
      
      toast({
        title: "Clinic created successfully",
        description: createAccount
          ? "Your clinic has been created and an account has been set up. Please check your email to confirm your account."
          : "Your clinic has been created. You can now log in with your credentials.",
      });
      
      navigate('/login');
      
    } catch (error: any) {
      console.error("Error during signup:", error);
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" className="mr-2" onClick={() => navigate('/')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to home
          </Button>
        </div>
        
        <Card className="w-full">
          <ClinicSignupForm
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </Card>
      </div>
    </div>
  );
};

export default ClinicSignup;
