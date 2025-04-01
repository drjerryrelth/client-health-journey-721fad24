
import { supabase } from '@/integrations/supabase/client';
import { UserData } from '@/types/auth';
import { UserRole } from '@/types';

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
    
    // List of demo emails for special handling
    const demoEmails = {
      admin: 'drrelth@contourlight.com',
      coach: 'support@practicenaturals.com',
      client: 'drjerryrelth@gmail.com'
    };
    
    // Special check first - if this is a demo admin, ensure we return admin role
    if (email === demoEmails.admin) {
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
      
      // Check if this user is associated with a clinic as an owner/admin
      const { data: clinicData, error: clinicError } = await supabase
        .from('clinics')
        .select('id, name, email')
        .eq('email', email)
        .single();
      
      if (clinicError) {
        console.log('Not a clinic user, checking demo accounts:', clinicError.message);
      } else if (clinicData) {
        console.log('User is associated with clinic:', clinicData);
        
        // Create a profile for clinic users with coach role
        const clinicProfile: UserData = {
          id: userId,
          name: clinicData.name || "Clinic User",
          email: email,
          role: "coach", // Assign coach role for clinic users
          clinicId: clinicData.id,
        };
        
        try {
          // Create the profile in the database
          const { error: insertError } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              full_name: clinicData.name || "Clinic User",
              email: email,
              role: "coach", // Set role as coach
              clinic_id: clinicData.id,
            });
          
          if (insertError) {
            console.warn('Could not save clinic profile to database:', insertError.message);
          } else {
            console.log('Clinic user profile created in database successfully');
          }
        } catch (insertErr) {
          console.error('Error during clinic profile insertion:', insertErr);
        }
        
        return clinicProfile;
      }
      
      // Determine role based on email for demo accounts
      let userRole: UserRole;
      let userName: string;
      
      if (email === demoEmails.admin) {
        userRole = 'admin';
        userName = 'Admin User';
        console.log('Creating admin profile for demo email');
      } else if (email === demoEmails.coach) {
        userRole = 'coach';
        userName = 'Coach User';
      } else if (email === demoEmails.client) {
        userRole = 'client';
        userName = 'Client User';
      } else {
        // Default fallback - changed from 'admin' to 'coach'
        userRole = 'coach';
        userName = 'New Coach';
      }
      
      // Create a fallback profile object
      const demoProfile: UserData = {
        id: userId,
        name: userName,
        email: email,
        role: userRole,
      };
      
      try {
        // Try to insert the profile into the database - this may fail if RLS blocks it
        const { error: insertError } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            full_name: userName,
            email: email,
            role: userRole,
          });
        
        if (insertError) {
          console.warn('Could not save profile to database:', insertError.message);
          // Continue with in-memory profile regardless of database error
        } else {
          console.log('Profile created in database successfully');
        }
      } catch (insertErr) {
        console.error('Error during profile insertion:', insertErr);
      }
      
      return demoProfile;
    }
    
    if (!profile) {
      console.log('No profile found for user ID:', userId);
      return null;
    }
    
    // Special case - handle admin demo email explicitly, overriding any stored role
    if (email === demoEmails.admin && profile.role !== 'admin') {
      console.log(`Force updating admin demo account role from ${profile.role} to admin`);
      
      try {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', userId);
          
        if (updateError) {
          console.warn('Could not update admin profile role:', updateError.message);
        }
        
        // Return admin role regardless of database update success
        const adminProfile: UserData = {
          id: profile.id,
          name: profile.full_name,
          email: profile.email,
          role: 'admin',
          clinicId: profile.clinic_id,
        };
        
        return adminProfile;
      } catch (updateErr) {
        console.error('Error during admin profile update:', updateErr);
      }
    }
    
    // Validate the role from the database
    let userRole: UserRole;
    if (email === demoEmails.admin) {
      // For demo admin, ALWAYS use admin role regardless of what's in the database
      userRole = 'admin';
    } else if (profile.role === 'admin' || profile.role === 'coach' || profile.role === 'client' || profile.role === 'super_admin') {
      userRole = profile.role as UserRole;
    } else {
      // Default to coach if the role from the database is not valid
      userRole = 'coach';
      console.warn(`Invalid role "${profile.role}" found in database, defaulting to coach`);
    }
    
    // Transform the profile data to match UserData structure
    const profileData: UserData = {
      id: profile.id,
      name: profile.full_name,
      email: profile.email,
      role: userRole,
      clinicId: profile.clinic_id,
    };
    
    console.log('User profile fetched successfully:', profileData);
    return profileData;
  } catch (error) {
    console.error('Unexpected error in fetchUserProfile:', error);
    return null;
  }
}
