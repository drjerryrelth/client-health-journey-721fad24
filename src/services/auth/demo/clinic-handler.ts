
import { supabase } from '@/integrations/supabase/client';
import { DEMO_CLINIC_ID } from './constants';
import { toast } from 'sonner';

/**
 * Handles the demo clinic signup process.
 * This is called when a demo clinic email is used to sign up.
 */
export const handleDemoClinicSignup = async (email: string, userId: string) => {
  console.log('Handling demo clinic signup for:', email);
  
  try {
    // First, check if the demo clinic exists
    const exists = await isDemoClinicAccountExists();
    
    if (!exists) {
      // Create demo clinic if it doesn't exist
      const { data, error } = await supabase
        .from('clinics')
        .insert([
          {
            id: DEMO_CLINIC_ID,
            name: 'Demo Clinic',
            email: 'demo@example.com',
            phone: '555-123-4567',
            status: 'active',
            primary_color: '#4f46e5',
            secondary_color: '#10b981'
          }
        ])
        .select()
        .single();
        
      if (error) {
        console.error('Error creating demo clinic:', error);
        toast.error('Error creating demo clinic');
        return false;
      }
      
      console.log('Created demo clinic:', data);
    }
    
    // Update user profile with clinic_admin role and link to the demo clinic
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .update({
        role: 'clinic_admin',
        clinic_id: DEMO_CLINIC_ID
      })
      .eq('id', userId)
      .select()
      .single();
      
    if (profileError) {
      console.error('Error updating profile for demo clinic admin:', profileError);
      toast.error('Error setting up demo clinic admin access');
      return false;
    }
    
    console.log('Updated profile for demo clinic admin:', profileData);
    return true;
  } catch (error) {
    console.error('Error in handleDemoClinicSignup:', error);
    toast.error('Error setting up demo clinic');
    return false;
  }
};

/**
 * Checks if the demo clinic account already exists in the database
 */
export const isDemoClinicAccountExists = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('clinics')
      .select('id')
      .eq('id', DEMO_CLINIC_ID)
      .single();
      
    if (error) {
      // If error is not found, the clinic doesn't exist
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking if demo clinic exists:', error);
    return false;
  }
};
