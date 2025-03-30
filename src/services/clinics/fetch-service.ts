
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Clinic } from './types';
import { getMockClinics } from './mock-data';
import { mapDbClinicToClinic } from './mappers';
import { checkAuthentication } from './auth-helper';

// Fetch all clinics
export async function getClinics(): Promise<Clinic[]> {
  try {
    // First check if user is authenticated
    const session = await checkAuthentication();
    if (!session) {
      console.log('User not authenticated, returning mock data');
      return getMockClinics(); // Fallback to mock data
    }

    console.log('Fetching clinics from database');
    const { data, error } = await supabase
      .from('clinics')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error details from Supabase:', error);
      throw error;
    }
    
    return data.map(mapDbClinicToClinic);
  } catch (error) {
    console.error('Error fetching clinics:', error);
    toast.error('Failed to fetch clinics.');
    // Return mock data as fallback
    return getMockClinics();
  }
}

// Get a single clinic by ID
export async function getClinic(id: string): Promise<Clinic | null> {
  try {
    // First check if user is authenticated
    const session = await checkAuthentication();
    if (!session) {
      console.log('User not authenticated, cannot fetch clinic details');
      return null;
    }
    
    console.log('Fetching clinic with ID:', id);
    const { data, error } = await supabase
      .from('clinics')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching clinic:', error);
      throw error;
    }
    
    return mapDbClinicToClinic(data);
  } catch (error) {
    console.error('Error fetching clinic:', error);
    toast.error('Failed to fetch clinic details.');
    return null;
  }
}
