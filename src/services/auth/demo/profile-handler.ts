
import { supabase } from '@/integrations/supabase/client';
import { demoEmails } from './constants';
import { isDemoAdminEmail } from './utils';

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
