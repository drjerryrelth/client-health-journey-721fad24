import { supabase } from '@/integrations/supabase/client';
import { UserData } from '@/types/auth';
import { isDemoAdminEmail } from '@/services/auth/demo/utils';
import { 
  transformProfileData, 
  createClinicUserProfile, 
  createFallbackProfile,
  handleAdminDemoAccount 
} from '@/utils/profile-utils';

export async function fetchUserProfile(userId: string): Promise<UserData | null> {
  console.log('Fetching user profile for ID:', userId);
  
  try {
    // First, get the user's email from auth
    const { data: authUserData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Error getting auth user:', authError);
      return null;
    }
    
    const email = authUserData?.user?.email;
    
    if (!email) {
      console.error('Could not retrieve user email');
      return null;
    }
    
    // Special check first - if this is a demo admin, we'll need to enforce admin role later
    const isAdminDemoEmail = isDemoAdminEmail(email);
    if (isAdminDemoEmail) {
      console.log('This is the demo admin email - forcing admin role');
    }
    
    // Attempt to get the user profile from the profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.log('Profile not found in database, checking if this is a clinic registration');
      
      // Check if this user is associated with a clinic
      const { data: clinicData, error: clinicError } = await supabase
        .from('clinics')
        .select('id, name, email')
        .eq('email', email)
        .single();
      
      if (clinicError) {
        console.log('Not a clinic user, checking demo accounts:', clinicError.message);
      } else if (clinicData) {
        console.log('User is associated with clinic:', clinicData);
        
        // Check if this is the clinic owner (clinic email matches user email)
        const isClinicOwner = clinicData.email === email;
        console.log(`Is clinic owner? ${isClinicOwner} (${clinicData.email} vs ${email})`);
        
        // Create appropriate profile
        return await createClinicUserProfile(userId, email, clinicData);
      }
      
      // Create a fallback profile
      return await createFallbackProfile(userId, email);
    }
    
    if (!profile) {
      console.log('No profile found for user ID:', userId);
      return null;
    }
    
    // Special case - handle admin demo email explicitly, overriding any stored role
    if (isAdminDemoEmail) {
      return await handleAdminDemoAccount(profile);
    }
    
    // For regular users, transform the profile data
    return transformProfileData(profile);
    
  } catch (error) {
    console.error('Unexpected error in fetchUserProfile:', error);
    return null;
  }
}
