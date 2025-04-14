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
        
      if (!clinicError && clinicData) {
        return createClinicUserProfile(userId, email, clinicData);
      }
      
      // If no clinic found, create a fallback profile
      return createFallbackProfile(userId, email);
    }
    
    // Transform the profile data
    const transformedProfile = transformProfileData(profile);
    
    // If this is a coach, fetch their coach ID
    let coach_id: string | undefined;
    if (transformedProfile.role === 'coach') {
      const { data: coachData, error: coachError } = await supabase
        .from('coaches')
        .select('id')
        .eq('email', email)
        .single();
        
      if (!coachError && coachData) {
        coach_id = coachData.id;
      }
    }
    
    // Handle admin demo account if needed
    if (isAdminDemoEmail) {
      return handleAdminDemoAccount(transformedProfile);
    }
    
    return {
      ...transformedProfile,
      coach_id
    };
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
}
