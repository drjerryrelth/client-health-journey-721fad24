
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
      
      // List of demo emails
      const demoEmails = ['drrelth@contourlight.com', 'support@practicenaturals.cm', 'drjerryrelth@gmail.com'];
      
      if (email && demoEmails.includes(email)) {
        console.log('Demo account detected, creating fallback profile data');
        
        // Determine role based on email
        let userRole: UserRole;
        let userName: string;
        
        if (email === 'drrelth@contourlight.com') {
          userRole = 'admin';
          userName = 'Admin User';
        } else if (email === 'support@practicenaturals.cm') {
          userRole = 'coach';
          userName = 'Coach User';
        } else if (email === 'drjerryrelth@gmail.com') {
          userRole = 'client';
          userName = 'Client User';
        } else {
          // Default fallback
          userRole = 'admin';
          userName = 'Demo User';
        }
        
        // Create a fallback profile object
        const demoProfile: UserData = {
          id: userId,
          name: userName,
          email: email,
          role: userRole,
        };
        
        // Try to insert the profile into the database
        await supabase
          .from('profiles')
          .upsert({
            id: userId,
            full_name: userName,
            email: email,
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
