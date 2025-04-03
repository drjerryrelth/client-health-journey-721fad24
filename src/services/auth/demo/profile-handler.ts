
import { supabase } from '@/integrations/supabase/client';
import { demoEmails } from './constants';

// Helper function to ensure demo profile exists with correct role based on email
export async function ensureDemoProfileExists(userId: string, email: string) {
  console.log('Ensuring demo profile exists for user:', userId);
  
  // Determine role based on email - critical for correct role assignment
  let role = 'client'; // default
  let fullName = 'Demo User';
  let clinicId = undefined; // Default no clinic
  
  if (email === demoEmails.admin) {
    role = 'admin';
    fullName = 'Admin User';
    console.log('This is the demo admin email - ensuring admin role is applied WITHOUT clinic ID');
    // Explicitly set clinicId to null for admin demo
    clinicId = null;
  } else if (email === demoEmails.coach) {
    role = 'coach';
    fullName = 'Coach User';
    clinicId = process.env.DEMO_CLINIC_ID || '65196bd4-f754-4c4e-9649-2bf478016701';
  } else if (email === demoEmails.client) {
    role = 'client';
    fullName = 'Client User';
    clinicId = process.env.DEMO_CLINIC_ID || '65196bd4-f754-4c4e-9649-2bf478016701';
  }
  
  try {
    // Check if profile exists first
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (fetchError || !profile) {
      console.log('Demo profile not found, creating one with role:', role);
      
      try {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            full_name: fullName,
            email: email,
            role: role,
            clinic_id: clinicId,
          });
        
        if (insertError) {
          console.error('Error creating demo profile:', insertError);
          console.log('This may be due to RLS policies. The app will continue with in-memory profile data.');
        } else {
          console.log('Demo profile created successfully with role:', role);
        }
      } catch (err) {
        console.error('Unexpected error creating profile:', err);
      }
    } else {
      // ALWAYS update existing profile to ensure role matches the email 
      // This is critical - we want to force the role to match the predefined demo emails
      console.log(`Updating profile role from ${profile.role} to ${role} to match demo email`);
      
      try {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            role: role, 
            full_name: fullName,
            clinic_id: clinicId // Important: ensure admin demo has no clinic_id
          })
          .eq('id', userId);
        
        if (updateError) {
          console.error('Error updating demo profile:', updateError);
          console.log('This may be due to RLS policies. The app will continue with in-memory profile data.');
        } else {
          console.log('Demo profile updated successfully with role:', role);
        }
      } catch (err) {
        console.error('Unexpected error updating profile:', err);
      }
    }
    
    // Return the role that should be used (even if database update failed)
    return role;
  } catch (error) {
    console.error('Error handling demo profile:', error);
    return role; // Return the determined role even if there was an error
  }
}
