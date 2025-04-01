
import { supabase } from '@/integrations/supabase/client';
import { Clinic } from './types';
import { mapClinicToDb, mapDbToClinic } from './mappers';
import { toast } from 'sonner';

export const addClinic = async (clinic: Partial<Clinic>): Promise<Clinic | null> => {
  try {
    // Use RPC function to bypass RLS for admin users
    const { data, error } = await supabase
      .rpc('admin_add_clinic', {
        clinic_data: mapClinicToDb(clinic)
      });

    if (error) {
      console.error('RPC admin_add_clinic error:', error);
      
      // Fallback to direct insert (for backward compatibility)
      const { data: insertData, error: insertError } = await supabase
        .from('clinics')
        .insert(mapClinicToDb(clinic))
        .select()
        .single();

      if (insertError) {
        console.error('Error adding clinic:', insertError);
        throw insertError;
      }

      return mapDbToClinic(insertData);
    }

    // If RPC succeeded, return the mapped clinic data
    if (data) {
      // After successful clinic creation, create a coach for this clinic
      try {
        const newClinicData = mapDbToClinic(data);
        
        if (newClinicData && newClinicData.id) {
          const coachResult = await createCoachAccountForClinic(newClinicData);
          
          // If we have a temporary password, add it to the clinic object
          if (coachResult && coachResult.success && coachResult.tempPassword) {
            return {
              ...newClinicData,
              tempPassword: coachResult.tempPassword
            };
          }
          
          return newClinicData;
        }
        
        return mapDbToClinic(data);
      } catch (coachError) {
        console.error('Error creating coach for new clinic:', coachError);
        // Continue returning the clinic even if coach creation failed
        return mapDbToClinic(data);
      }
    }

    return null;
  } catch (error) {
    console.error('Error adding clinic:', error);
    throw error;
  }
};

// Helper function to create a coach account with auth credentials for a newly created clinic
const createCoachAccountForClinic = async (clinic: Clinic) => {
  if (!clinic.primaryContact || !clinic.email) {
    console.warn('Cannot create coach: missing primary contact or email information');
    return null;
  }

  try {
    // Generate a random temporary password
    const tempPassword = generateTemporaryPassword();
    
    // Create auth user for coach using the clinic's email
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: clinic.email,
      password: tempPassword,
      options: {
        data: {
          full_name: clinic.primaryContact,
          role: 'coach',
          clinic_id: clinic.id
        },
        // Skip email confirmation for admin-created accounts
        emailRedirectTo: `${window.location.origin}/login`
      }
    });

    if (authError) {
      console.error('Error creating auth account for clinic coach:', authError);
      throw authError;
    }

    console.log(`Auth account created for clinic ${clinic.name}`);
    
    // Create coach entry in the coaches table
    const { error } = await supabase.rpc(
      'add_coach',
      {
        coach_name: clinic.primaryContact || 'Clinic Manager',
        coach_email: clinic.email || '',
        coach_phone: clinic.phone || null,
        coach_status: 'active',
        coach_clinic_id: clinic.id
      }
    );

    if (error) {
      console.error('Error creating coach entry for clinic:', error);
      return null;
    }

    console.log(`Coach created for clinic ${clinic.name} with temporary password`);
    
    // Return the temporary password to display to admin
    return {
      success: true,
      tempPassword
    };
  } catch (error) {
    console.error('Error in createCoachAccountForClinic:', error);
    return null;
  }
};

// Helper function to generate a random secure temporary password
const generateTemporaryPassword = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*-_+=';
  let result = '';
  // Generate a 12-character password
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Helper function to create a coach for a newly created clinic - old version kept for backward compatibility
const createCoachForClinic = async (clinic: Clinic) => {
  if (!clinic.primaryContact || !clinic.email) {
    console.warn('Cannot create coach: missing primary contact or email information');
    return null;
  }

  try {
    const { error } = await supabase.rpc(
      'add_coach',
      {
        coach_name: clinic.primaryContact || 'Clinic Manager',
        coach_email: clinic.email || '',
        coach_phone: clinic.phone || null,
        coach_status: 'active',
        coach_clinic_id: clinic.id
      }
    );

    if (error) {
      console.error('Error creating coach for clinic:', error);
      return null;
    }

    console.log(`Coach created for clinic ${clinic.name}`);
    return true;
  } catch (error) {
    console.error('Error in createCoachForClinic:', error);
    return null;
  }
};

export const createClinic = async (clinic: Partial<Clinic>): Promise<{ data: Clinic | null, error: any, tempPassword?: string }> => {
  try {
    // Try to use addClinic which attempts RPC first then falls back to direct insert
    const newClinic = await addClinic(clinic);
    
    // Check if we have a temporary password to return
    const tempPassword = newClinic?.tempPassword;
    
    return { 
      data: newClinic, 
      error: null, 
      tempPassword 
    };
  } catch (error) {
    console.error('Error creating clinic:', error);
    return { data: null, error };
  }
};

export const updateClinic = async (clinicId: string, updates: Partial<Clinic>): Promise<{ data: Clinic | null, error: any }> => {
  try {
    const { data, error } = await supabase
      .from('clinics')
      .update(mapClinicToDb(updates))
      .eq('id', clinicId)
      .select()
      .single();

    if (error) throw error;
    return { data: mapDbToClinic(data), error: null };
  } catch (error) {
    console.error('Error updating clinic:', error);
    return { data: null, error };
  }
};

export const deleteClinic = async (clinicId: string): Promise<{ success: boolean, error: any }> => {
  try {
    const { error } = await supabase
      .from('clinics')
      .delete()
      .eq('id', clinicId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting clinic:', error);
    return { success: false, error };
  }
};

export const updateClinicBranding = async (
  clinicId: string, 
  logo: string | null, 
  primaryColor: string | null, 
  secondaryColor: string | null
): Promise<{ success: boolean, error: any }> => {
  try {
    const { error } = await supabase
      .from('clinics')
      .update({
        logo,
        primary_color: primaryColor,
        secondary_color: secondaryColor
      })
      .eq('id', clinicId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating clinic branding:', error);
    return { success: false, error };
  }
};
