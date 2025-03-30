
import { supabase } from '@/integrations/supabase/client';
import { UserData } from '@/types/auth';

export async function fetchUserProfile(userId: string): Promise<UserData | null> {
  console.log('Fetching user profile for ID:', userId);
  
  try {
    // Attempt to get the user profile from the profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      
      // Check if this is a demo login and handle specially
      const { data: userData } = await supabase.auth.getUser();
      const email = userData?.user?.email;
      
      if (email === 'drrelth@contourlight.com') {
        console.log('Demo account detected, creating fallback profile data');
        
        // For demo accounts, create a fallback profile
        const userRole = userData?.user?.user_metadata?.role || 'admin';
        const userName = userData?.user?.user_metadata?.full_name || 'Demo User';
        
        // Create a fallback profile object
        const demoProfile: UserData = {
          id: userId,
          name: userName,
          email: 'drrelth@contourlight.com',
          role: userRole as any, // Cast to match UserRole type
        };
        
        // Try to insert the profile into the database
        await supabase
          .from('profiles')
          .upsert({
            id: userId,
            full_name: userName,
            email: 'drrelth@contourlight.com',
            role: userRole,
          });
        
        return demoProfile;
      }
      
      return null;
    }
    
    if (!profile) {
      console.log('No profile found for user ID:', userId);
      return null;
    }
    
    // Transform the profile data to match UserData structure
    const userData: UserData = {
      id: profile.id,
      name: profile.full_name,
      email: profile.email,
      role: profile.role,
      clinicId: profile.clinic_id,
    };
    
    console.log('User profile fetched successfully:', userData);
    return userData;
  } catch (error) {
    console.error('Unexpected error in fetchUserProfile:', error);
    return null;
  }
}
