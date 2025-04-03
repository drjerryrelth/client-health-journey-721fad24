
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
  
  // Important: For clinic owners/admins, always use 'admin' role, not 'coach'
  const role = "admin"; // Changed from conditional to always admin for clinic owners
  const fullName = clinicData.name || "Clinic Admin";
  
  console.log(`Creating profile for clinic user with role: ${role}`);
  
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
      console.log('Clinic admin profile created in database successfully');
    }
  } catch (insertErr) {
    console.error('Error during clinic profile insertion:', insertErr);
  }
  
  return clinicProfile;
};
