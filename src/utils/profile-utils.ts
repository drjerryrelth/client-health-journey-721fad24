import { supabase } from '@/integrations/supabase/client';
import { UserData } from '@/types/auth';
import { UserRole } from '@/types';
import { demoEmails, isDemoAdminEmail } from '@/constants/demo-accounts';

// Transform database profile into UserData object
export const transformProfileData = (profile: any): UserData => {
  // Validate the role from the database
  let userRole: UserRole;
  if (profile.role === 'admin' || profile.role === 'coach' || profile.role === 'client' || profile.role === 'super_admin') {
    userRole = profile.role as UserRole;
  } else {
    // Default to coach if the role is not valid
    userRole = 'coach';
    console.warn(`Invalid role "${profile.role}" found in database, defaulting to coach`);
  }
  
  // Return the formatted user data
  return {
    id: profile.id,
    name: profile.full_name,
    email: profile.email,
    role: userRole,
    clinicId: profile.clinic_id,
  };
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
  
  // Determine role (admin for demo admin email, coach otherwise)
  const role = isAdminDemoEmail ? "admin" : "coach";
  const fullName = clinicData.name || "Clinic User";
  
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
      console.log('Clinic user profile created in database successfully');
    }
  } catch (insertErr) {
    console.error('Error during clinic profile insertion:', insertErr);
  }
  
  return clinicProfile;
};

// Create a fallback profile for demo users or new users
export const createFallbackProfile = async (
  userId: string,
  email: string
): Promise<UserData> => {
  // Determine role based on email for demo accounts
  let userRole: UserRole;
  let userName: string;
  let clinicId = undefined;
  
  if (email === demoEmails.admin) {
    userRole = 'admin';
    userName = 'Admin User';
    console.log('Creating admin profile for demo email without clinic ID');
  } else if (email === demoEmails.coach) {
    userRole = 'coach';
    userName = 'Coach User';
  } else if (email === demoEmails.client) {
    userRole = 'client';
    userName = 'Client User';
  } else {
    // Default fallback for non-demo accounts
    userRole = 'coach';
    userName = 'New Coach';
  }
  
  // Create a fallback profile object
  const profile: UserData = {
    id: userId,
    name: userName,
    email: email,
    role: userRole,
    clinicId: clinicId,
  };
  
  try {
    // Try to insert the profile into the database
    const { error: insertError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: userName,
        email: email,
        role: userRole,
        clinic_id: clinicId,
      });
    
    if (insertError) {
      console.warn('Could not save profile to database:', insertError.message);
    } else {
      console.log('Profile created in database successfully');
    }
  } catch (insertErr) {
    console.error('Error during profile insertion:', insertErr);
  }
  
  return profile;
};

// Handle special case for admin demo account
export const handleAdminDemoAccount = async (
  profile: any
): Promise<UserData> => {
  console.log(`Found existing profile for admin demo account. Current role: ${profile.role}`);
  
  // Create admin profile object WITHOUT clinic association
  const adminProfile: UserData = {
    id: profile.id,
    name: profile.full_name || 'Admin User',
    email: profile.email,
    role: 'admin', // Force admin role
    clinicId: undefined, // Explicitly remove any clinic association
  };
  
  // Attempt to update the database as well
  try {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        role: 'admin', 
        full_name: 'Admin User',
        clinic_id: null  // Set clinic_id to null in the database
      })
      .eq('id', profile.id);
      
    if (updateError) {
      console.warn('Could not update admin profile role in database:', updateError.message);
      console.log('Continuing with admin role in memory');
    } else {
      console.log('Admin profile role updated successfully in database');
    }
  } catch (updateErr) {
    console.error('Error updating admin profile:', updateErr);
  }
  
  return adminProfile;
};
