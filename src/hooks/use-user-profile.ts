
import { supabase } from '@/integrations/supabase/client';
import { UserData } from '@/types/auth';
import { UserRole } from '@/types';

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
        const userMetadata = userData?.user?.user_metadata;
        const userRoleFromMetadata = userMetadata?.role || 'admin';
        
        // Validate and ensure the role is a valid UserRole type
        let userRole: UserRole;
        if (userRoleFromMetadata === 'admin' || userRoleFromMetadata === 'coach' || userRoleFromMetadata === 'client') {
          userRole = userRoleFromMetadata as UserRole;
        } else {
          // Default to admin if the role is not valid
          userRole = 'admin';
        }
        
        const userName = userMetadata?.full_name || 'Demo User';
        
        // Create a fallback profile object
        const demoProfile: UserData = {
          id: userId,
          name: userName,
          email: 'drrelth@contourlight.com',
          role: userRole, // Now properly typed
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
    
    // Validate the role from the database
    let userRole: UserRole;
    if (profile.role === 'admin' || profile.role === 'coach' || profile.role === 'client') {
      userRole = profile.role as UserRole;
    } else {
      // Default to admin if the role from the database is not valid
      userRole = 'admin';
      console.warn(`Invalid role "${profile.role}" found in database, defaulting to admin`);
    }
    
    // Transform the profile data to match UserData structure
    const userData: UserData = {
      id: profile.id,
      name: profile.full_name,
      email: profile.email,
      role: userRole, // Now properly typed
      clinicId: profile.clinic_id,
    };
    
    console.log('User profile fetched successfully:', userData);
    return userData;
  } catch (error) {
    console.error('Unexpected error in fetchUserProfile:', error);
    return null;
  }
}
