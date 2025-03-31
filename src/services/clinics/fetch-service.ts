
import { supabase } from '@/integrations/supabase/client';
import { Clinic } from './types';
import { mapDbToClinic } from './mappers';

export const fetchClinic = async (clinicId: string): Promise<Clinic | null> => {
  try {
    const { data, error } = await supabase
      .from('clinics')
      .select('*')
      .eq('id', clinicId)
      .single();

    if (error) throw error;
    return mapDbToClinic(data);
  } catch (error) {
    console.error('Error fetching clinic:', error);
    return null;
  }
};

export const fetchClinics = async (): Promise<Clinic[]> => {
  try {
    const { data, error } = await supabase
      .from('clinics')
      .select('*')
      .order('name');

    if (error) throw error;
    return data.map(mapDbToClinic);
  } catch (error) {
    console.error('Error fetching clinics:', error);
    return [];
  }
};
