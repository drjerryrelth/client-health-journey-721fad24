
import { supabase } from '@/integrations/supabase/client';
import { generateStrongPassword } from '@/utils/password-utils';
import { toast } from 'sonner';

export interface CoachAccountResult {
  success: boolean;
  message: string;
  tempPassword?: string;
  error?: any;
}

/**
 * Creates a coach account for a new clinic
 * This function creates both the auth user and the coach record
 */
export const createCoachAccountForClinic = async (clinic: any): Promise<CoachAccountResult> => {
  try {
    if (!clinic || !clinic.id || !clinic.email) {
      console.error('Invalid clinic data provided:', clinic);
      return {
        success: false,
        message: 'Invalid clinic data provided'
      };
    }
    
    console.log('Creating coach account for clinic:', clinic.name);
    
    // Generate a secure temporary password
    const tempPassword = generateStrongPassword();
    
    // First create the auth user with role 'clinic_admin'
    // This is CRITICAL - the user MUST be created with role 'clinic_admin'
    const { data: userData, error: userError } = await supabase.auth.signUp({
      email: clinic.email,
      password: tempPassword,
      options: {
        data: {
          full_name: clinic.primaryContact || clinic.name,
          role: 'clinic_admin', // CRITICAL: Must be clinic_admin
          clinic_id: clinic.id
        }
      }
    });
    
    if (userError) {
      console.error('Error creating user account:', userError);
      return {
        success: false,
        message: `Failed to create user account: ${userError.message}`,
        error: userError
      };
    }
    
    if (!userData.user) {
      console.error('No user returned from auth creation');
      return {
        success: false,
        message: 'No user returned from auth creation'
      };
    }
    
    console.log('Auth user created successfully with id:', userData.user.id);
    
    // Now create a coach record using the coach email matching the clinic owner
    const { data: coachData, error: coachError } = await supabase
      .from('coaches')
      .insert({
        name: clinic.primaryContact || clinic.name,
        email: clinic.email,
        phone: clinic.phone || null,
        status: 'active',
        clinic_id: clinic.id
      })
      .select()
      .single();
      
    if (coachError) {
      console.error('Error creating coach record:', coachError);
      toast.error('Coach record creation failed. Please create manually.');
      // We don't want to fail the entire process if just the coach record fails
      return {
        success: true,
        message: 'User created but coach record failed. Please create manually.',
        tempPassword,
        error: coachError
      };
    }
    
    console.log('Coach record created successfully:', coachData?.id);
    
    // Now update the profile record to ensure it has the clinic_id and the correct role
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userData.user.id,
          email: clinic.email,
          full_name: clinic.primaryContact || clinic.name,
          role: 'clinic_admin', // CRITICAL: Must match the auth user role
          clinic_id: clinic.id
        });
        
      if (profileError) {
        console.error('Error updating profile:', profileError);
        // Don't fail if just the profile update fails
      } else {
        console.log('Profile updated successfully');
      }
    } catch (profileError) {
      console.error('Exception updating profile:', profileError);
    }
    
    return {
      success: true,
      message: 'Coach account created successfully',
      tempPassword
    };
  } catch (error) {
    console.error('Error in createCoachAccountForClinic:', error);
    return {
      success: false,
      message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      error
    };
  }
};
