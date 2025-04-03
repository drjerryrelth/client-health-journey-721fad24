
import { supabase } from '@/integrations/supabase/client';
import { UserData } from '@/types/auth';
import { isDemoAdminEmail } from '@/constants/demo-accounts';

// Transform profile data from database into UserData format
export const transformProfileData = (profile: any): UserData => {
  return {
    id: profile.id,
    name: profile.full_name,
    email: profile.email,
    role: profile.role,
    clinicId: profile.clinic_id,
  };
};

// Handle special case for admin demo accounts
export const handleAdminDemoAccount = async (profile: any): Promise<UserData> => {
  console.log('This is the admin demo email - enforcing admin role');
  
  // Create profile with admin role, regardless of what's in the database
  const adminProfile: UserData = {
    id: profile.id,
    name: profile.full_name || 'Admin User',
    email: profile.email,
    role: 'admin',
    clinicId: undefined, // Admins don't have a specific clinic
  };
  
  return adminProfile;
};

// Create a fallback profile for users not found in database
export const createFallbackProfile = async (
  userId: string, 
  email: string
): Promise<UserData> => {
  console.log('Creating fallback profile');
  
  // Check if this is the demo admin email
  const isAdminDemoEmail = isDemoAdminEmail(email);
  
  const role = isAdminDemoEmail ? 'admin' : 'client';
  const fullName = isAdminDemoEmail ? 'Admin User' : email.split('@')[0];
  
  // Create profile object
  const fallbackProfile: UserData = {
    id: userId,
    name: fullName,
    email: email,
    role: role,
    clinicId: undefined,
  };
  
  try {
    // Create the profile in the database
    const { error: insertError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: fullName,
        email: email,
        role: role,
      });
    
    if (insertError) {
      console.warn('Could not save fallback profile to database:', insertError.message);
    } else {
      console.log('Fallback profile created in database successfully');
    }
  } catch (insertErr) {
    console.error('Error during fallback profile insertion:', insertErr);
  }
  
  return fallbackProfile;
};

// Create a profile for clinic users
export const createClinicUserProfile = async (
  userId: string, 
  email: string, 
  clinicData: any
): Promise<UserData> => {
  const isAdminDemoEmail = isDemoAdminEmail(email);
  
  // If this is the admin demo email, do NOT associate with a clinic
  if (isAdminDemoEmail) {
    console.log('This is the admin demo email - creating admin profile WITHOUT clinic association');
    return {
      id: userId,
      name: 'Admin User',
      email: email,
      role: 'admin',
      clinicId: undefined,
    };
  }
  
  // IMPORTANT: Use 'clinic_admin' role instead of 'admin' for clinic owners
  // If the clinic's email matches the user's email, they are the clinic owner/admin
  const isClinicOwner = clinicData.email === email;
  const role = isClinicOwner ? "clinic_admin" : "coach"; 
  const fullName = clinicData.name || (isClinicOwner ? "Clinic Owner" : "Coach");
  
  console.log(`Creating profile for clinic user with role: ${role} (isClinicOwner: ${isClinicOwner})`);
  
  // Create profile object
  const clinicProfile: UserData = {
    id: userId,
    name: fullName,
    email: email,
    role: role,
    clinicId: clinicData.id,
  };
  
  try {
    // Create the profile in the database
    const { error: insertError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: fullName,
        email: email,
        role: role,
        clinic_id: clinicData.id,
      });
    
    if (insertError) {
      console.warn('Could not save clinic profile to database:', insertError.message);
    } else {
      console.log('Clinic profile created in database successfully');
    }
  } catch (insertErr) {
    console.error('Error during clinic profile insertion:', insertErr);
  }
  
  return clinicProfile;
};
