
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Clinic } from './types';
import { mapClinicToDbClinic, mapDbClinicToClinic } from './mappers';
import { checkAuthentication } from './auth-helper';

// Add a new clinic
export async function addClinic(clinic: {
  name: string;
  email?: string | null;
  phone?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  primaryContact?: string | null;
  billingContactName?: string | null;
  billingEmail?: string | null;
  billingPhone?: string | null;
  billingAddress?: string | null;
  billingCity?: string | null;
  billingState?: string | null;
  billingZip?: string | null;
  paymentMethod?: string | null;
  subscriptionTier?: string | null;
  subscriptionStatus?: string | null;
}): Promise<Clinic | null> {
  try {
    console.log('Adding clinic:', clinic);
    
    // Check if user is logged in
    const session = await checkAuthentication();
    if (!session) {
      console.log('Authentication failed, cannot add clinic');
      return null;
    }

    console.log('User authenticated, proceeding with clinic creation');
    
    const dbClinic = mapClinicToDbClinic(clinic);
    const { data, error } = await supabase
      .from('clinics')
      .insert(dbClinic)
      .select()
      .single();

    if (error) {
      console.error('Error details from Supabase:', error);
      throw error;
    }
    
    console.log('Clinic added successfully:', data);
    toast.success('Clinic added successfully!');
    return mapDbClinicToClinic(data);
  } catch (error) {
    console.error('Error adding clinic:', error);
    toast.error('Failed to add clinic.');
    return null;
  }
}

// Update a clinic
export async function updateClinic(id: string, updates: Partial<Omit<Clinic, 'id' | 'createdAt'>>): Promise<Clinic | null> {
  try {
    // Check if user is logged in
    const session = await checkAuthentication();
    if (!session) {
      console.log('Authentication failed, cannot update clinic');
      return null;
    }

    console.log('User authenticated, proceeding with clinic update');
    const dbUpdates = mapClinicToDbClinic(updates);
    
    const { data, error } = await supabase
      .from('clinics')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating clinic:', error);
      throw error;
    }
    
    console.log('Clinic updated successfully:', data);
    toast.success('Clinic updated successfully!');
    return mapDbClinicToClinic(data);
  } catch (error) {
    console.error('Error updating clinic:', error);
    toast.error('Failed to update clinic.');
    return null;
  }
}

// Delete a clinic
export async function deleteClinic(id: string): Promise<boolean> {
  try {
    // Check if user is logged in
    const session = await checkAuthentication();
    if (!session) {
      console.log('Authentication failed, cannot delete clinic');
      return false;
    }
    
    console.log('User authenticated, proceeding with clinic deletion');
    const { error } = await supabase
      .from('clinics')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting clinic:', error);
      throw error;
    }
    
    console.log('Clinic deleted successfully');
    toast.success('Clinic deleted successfully!');
    return true;
  } catch (error) {
    console.error('Error deleting clinic:', error);
    toast.error('Failed to delete clinic.');
    return false;
  }
}
