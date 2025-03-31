
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
          await createCoachForClinic(newClinicData);
        }
        
        return newClinicData;
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

// Helper function to create a coach for a newly created clinic
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

export const createClinic = async (clinic: Partial<Clinic>): Promise<{ data: Clinic | null, error: any }> => {
  try {
    // Try to use addClinic which attempts RPC first then falls back to direct insert
    const newClinic = await addClinic(clinic);
    return { data: newClinic, error: null };
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
