
import { supabase } from '@/integrations/supabase/client';

// Helper function to ensure demo profile exists with correct role based on email
export async function ensureDemoProfileExists(userId: string, email: string) {
  console.log('Ensuring demo profile exists for user:', userId);
  
  // Determine role based on email - critical for correct role assignment
  let role = 'client'; // default
  let fullName = 'Demo User';
  
  const demoEmails = {
    admin: 'drrelth@contourlight.com',
    coach: 'support@practicenaturals.com',
    client: 'drjerryrelth@gmail.com'
  };
  
  if (email === demoEmails.admin) {
    role = 'admin';
    fullName = 'Admin User';
    console.log('This is an admin email - ensuring admin role is applied');
  } else if (email === demoEmails.coach) {
    role = 'coach';
    fullName = 'Coach User';
  } else if (email === demoEmails.client) {
    role = 'client';
    fullName = 'Client User';
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
          .update({ role: role, full_name: fullName })
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
  } catch (error) {
    console.error('Error handling demo profile:', error);
  }
}

// Function to bypass email confirmation for demo accounts
export async function autoConfirmDemoEmail(email: string, password: string) {
  const isDemoAccount = email === 'drrelth@contourlight.com';
  
  if (!isDemoAccount) {
    return false;
  }
  
  try {
    // For demo accounts, we'll try a direct sign-in with the admin key
    // This would need a custom server endpoint in a real app
    console.log('Attempting special demo account login flow');
    
    // For now, we'll just create a fake successful response
    // In a real app, we'd need a server-side function to handle this
    return true;
  } catch (error) {
    console.error('Auto-confirm failed:', error);
    return false;
  }
}

// Export the demoEmails object for use in other files
export const demoEmails = {
  admin: 'drrelth@contourlight.com',
  coach: 'support@practicenaturals.com',
  client: 'drjerryrelth@gmail.com'
};
