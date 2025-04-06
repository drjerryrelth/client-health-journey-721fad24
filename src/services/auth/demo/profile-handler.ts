
import { supabase } from '@/integrations/supabase/client';
import { demoEmails } from './constants';
import { isDemoAdminEmail, isDemoClinicAdminEmail } from './utils';

// Helper function to ensure demo profile exists with correct role based on email
export async function ensureDemoProfileExists(userId: string, email: string) {
  console.log('Ensuring demo profile exists for user:', userId, 'email:', email);
  
  // Determine role based on email - critical for correct role assignment
  let role = 'client'; // default
  let fullName = 'Demo User';
  let clinicId = undefined; // Default no clinic
  
  // CRITICAL: Special case for demo admin - highest priority check
  if (isDemoAdminEmail(email)) {
    role = 'admin';
    fullName = 'Admin User';
    console.log('CRITICAL: This is the demo admin email - ensuring admin role is applied WITHOUT clinic ID');
    // Explicitly set clinicId to null for admin demo
    clinicId = null;
    
    // Special case admin profile handling
    try {
      // Check if admin profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (!existingProfile) {
        console.log('Admin demo profile not found, creating one with admin role');
        
        // Create admin profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            full_name: 'Admin User',
            email: email,
            role: 'admin',
            clinic_id: null
          });
          
        if (insertError) {
          console.error('Error creating admin demo profile:', insertError);
        } else {
          console.log('Admin demo profile created successfully');
        }
      } else {
        // CRITICAL: Ensure admin profile has the correct role and NO clinic_id
        if (existingProfile.role !== 'admin' || existingProfile.clinic_id !== null) {
          console.log('Updating admin demo profile to ensure correct role and no clinic ID');
          
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              role: 'admin', 
              clinic_id: null,
              full_name: 'Admin User'
            })
            .eq('id', userId);
            
          if (updateError) {
            console.error('Error updating admin demo profile:', updateError);
          } else {
            console.log('Admin demo profile updated successfully');
          }
        }
      }
      
      // For admin demo, always return 'admin' role
      return 'admin';
    } catch (error) {
      console.error('Error handling admin demo profile:', error);
      return 'admin'; // Return admin role even if there's an error
    }
  } 
  // CRITICAL: Special case for clinic admin demo email
  else if (isDemoClinicAdminEmail(email)) {
    role = 'clinic_admin';
    fullName = 'Clinic Admin User';
    clinicId = process.env.DEMO_CLINIC_ID || '65196bd4-f754-4c4e-9649-2bf478016701';
    console.log('CRITICAL: This is the demo clinic admin email - ensuring clinic_admin role with clinic ID:', clinicId);
    
    // Special case clinic admin profile handling
    try {
      // Check if clinic admin profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (!existingProfile) {
        console.log('Clinic admin demo profile not found, creating one with clinic_admin role');
        
        // Create clinic admin profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            full_name: 'Clinic Admin User',
            email: email,
            role: 'clinic_admin',
            clinic_id: clinicId
          });
          
        if (insertError) {
          console.error('Error creating clinic admin demo profile:', insertError);
        } else {
          console.log('Clinic admin demo profile created successfully');
        }
      } else {
        // CRITICAL: Ensure clinic admin profile has the correct role and clinic_id
        if (existingProfile.role !== 'clinic_admin' || existingProfile.clinic_id !== clinicId) {
          console.log('Updating clinic admin demo profile to ensure correct role and clinic ID');
          
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              role: 'clinic_admin', 
              clinic_id: clinicId,
              full_name: 'Clinic Admin User'
            })
            .eq('id', userId);
            
          if (updateError) {
            console.error('Error updating clinic admin demo profile:', updateError);
          } else {
            console.log('Clinic admin demo profile updated successfully');
          }
        }
      }
      
      // For clinic admin demo, always return 'clinic_admin' role
      return 'clinic_admin';
    } catch (error) {
      console.error('Error handling clinic admin demo profile:', error);
      return 'clinic_admin'; // Return clinic_admin role even if there's an error
    }
  } else if (email === demoEmails.coach) {
    role = 'coach';
    fullName = 'Coach User';
    clinicId = process.env.DEMO_CLINIC_ID || '65196bd4-f754-4c4e-9649-2bf478016701';
  } else if (email === demoEmails.client) {
    role = 'client';
    fullName = 'Client User';
    clinicId = process.env.DEMO_CLINIC_ID || '65196bd4-f754-4c4e-9649-2bf478016701';
  }
  
  // Handle non-admin demo profiles
  try {
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (fetchError || !profile) {
      console.log('Demo profile not found, creating one with role:', role);
      
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
    } else {
      // ALWAYS update existing profile to ensure role matches the email 
      // This is critical - we want to force the role to match the predefined demo emails
      console.log(`Updating profile role from ${profile.role} to ${role} to match demo email`);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          role: role, 
          full_name: fullName,
          clinic_id: clinicId
        })
        .eq('id', userId);
      
      if (updateError) {
        console.error('Error updating demo profile:', updateError);
        console.log('This may be due to RLS policies. The app will continue with in-memory profile data.');
      } else {
        console.log('Demo profile updated successfully with role:', role);
      }
    }
    
    // Return the role that should be used (even if database update failed)
    return role;
  } catch (error) {
    console.error('Error handling demo profile:', error);
    return role; // Return the determined role even if there was an error
  }
}

