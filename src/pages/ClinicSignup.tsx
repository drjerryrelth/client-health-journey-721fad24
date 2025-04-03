
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ClinicSignupForm } from '@/components/clinic-signup';
import { ClinicSignupFormValues, CoachFormData } from '@/components/clinic-signup/types';
import { isDemoClinicEmail, handleDemoClinicSignup } from '@/services/auth/demo';
import SignupDemoNotice from '@/components/auth/signup/SignupDemoNotice';

const ClinicSignup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ClinicSignupFormValues, additionalCoaches: CoachFormData[]) => {
    setIsSubmitting(true);
    const createAccount = values.email !== '';
    
    try {
      // Check if this is a demo clinic signup
      const isDemoClinic = isDemoClinicEmail(values.email);
      
      // For demo clinics, redirect to the demo-specific handler
      if (isDemoClinic && createAccount) {
        console.log("Processing as demo clinic signup");
        try {
          await handleDemoClinicSignup(
            values.email,
            values.password,
            values.clinicName,
            values.primaryContact
          );
          
          toast({
            title: "Demo clinic created successfully",
            description: "Your demo clinic has been created. You can now log in with your credentials.",
          });
          
          sonnerToast.success("Demo clinic created! You can now log in.");
          navigate('/login');
          return;
        } catch (demoError: any) {
          console.error("Demo clinic creation error:", demoError);
          toast({
            title: "Demo clinic creation failed",
            description: demoError.message || "An error occurred during demo clinic creation",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      console.log("Creating clinic with data:", {
        name: values.clinicName,
        email: values.clinicEmail,
        phone: values.clinicPhone,
        subscription_tier: values.selectedPlan
      });
      
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
          subscription_tier: values.selectedPlan,
          status: 'active'
        })
        .select('id')
        .single();

      if (clinicError) {
        console.error("Error creating clinic:", clinicError);
        throw new Error(`Failed to create clinic: ${clinicError.message}`);
      }
      
      console.log("Clinic created successfully with ID:", clinicData.id);
      const clinicId = clinicData.id;
      
      // If the clinic has add-ons selected, store that information separately
      // We could create a separate table for this, but for now we'll just log it
      if (values.addOns && values.addOns.length > 0) {
        console.log(`Clinic ${clinicId} has selected add-ons:`, values.addOns);
        // In a real implementation, we would store this in a separate table
        // For example:
        // const { error: addOnsError } = await supabase
        //   .from('clinic_add_ons')
        //   .insert(values.addOns.map(addOnId => ({
        //     clinic_id: clinicId,
        //     add_on_id: addOnId
        //   })));
        // 
        // if (addOnsError) console.error("Error storing add-ons:", addOnsError);
      }
      
      let userId = null;
      
      if (createAccount) {
        console.log("Creating user account for:", values.email);
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

        if (signUpError) {
          console.error("Error signing up:", signUpError);
          throw new Error(`Failed to create account: ${signUpError.message}`);
        }
        
        console.log("User created successfully");
        userId = userData.user?.id;
        
        if (userId) {
          console.log("Updating user profile for ID:", userId);
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
          } else {
            console.log("Profile updated successfully");
          }
        }
      }
      
      console.log("Creating primary coach record");
      const { error: primaryCoachError } = await supabase
        .from('coaches')
        .insert({
          name: values.primaryContact,
          email: values.email || values.clinicEmail,
          phone: values.clinicPhone,
          status: 'active',
          clinic_id: clinicId
        });
        
      if (primaryCoachError) {
        console.error("Error creating primary coach:", primaryCoachError);
        throw new Error(`Failed to create primary coach: ${primaryCoachError.message}`);
      }
      console.log("Primary coach created successfully");
      
      if (additionalCoaches.length > 0) {
        console.log("Adding additional coaches:", additionalCoaches.length);
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
        } else {
          console.log("Additional coaches created successfully");
        }
      }
      
      toast({
        title: "Clinic created successfully",
        description: createAccount
          ? "Your clinic has been created and an account has been set up. Please check your email to confirm your account."
          : "Your clinic has been created. You can now log in with your credentials.",
      });
      
      // Also use sonner toast for more visibility
      sonnerToast.success(
        createAccount
          ? "Clinic created! Please check your email to confirm your account."
          : "Clinic created successfully!"
      );
      
      navigate('/login');
      
    } catch (error: any) {
      console.error("Error during signup:", error);
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive"
      });
      
      // Also use sonner toast for more visibility
      sonnerToast.error(error.message || "Signup failed. Please try again.");
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
          <div className="px-6 pt-4">
            <SignupDemoNotice />
          </div>
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
