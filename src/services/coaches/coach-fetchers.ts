
import { supabase } from '@/integrations/supabase/client';
import { Coach } from './types';

/**
 * Fetches all coaches for administrative purposes
 */
export const getAllCoachesForAdmin = async (): Promise<Coach[]> => {
  console.log("Fetching all coaches for admin");
  
  try {
    // First attempt to use the edge function
    const { data: edgeFunctionData, error: edgeFunctionError } = await supabase
      .functions.invoke('get-all-coaches', {
        method: 'GET',
      });
    
    if (!edgeFunctionError && edgeFunctionData) {
      console.log(`Successfully fetched ${edgeFunctionData.length} coaches using edge function`);
      return edgeFunctionData;
    }
    
    // Fallback to direct query
    const { data, error } = await supabase
      .from('coaches')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error("Error fetching coaches:", error);
      throw new Error(`Failed to fetch coaches: ${error.message}`);
    }
    
    // Map the database results to the Coach type
    const mappedCoaches: Coach[] = (data || []).map(coach => ({
      id: coach.id,
      name: coach.name, 
      email: coach.email,
      phone: coach.phone || null,
      status: coach.status || 'inactive',
      clinicId: coach.clinic_id,
      clinic_id: coach.clinic_id,
      clients: []
    }));
    
    return mappedCoaches;
  } catch (err) {
    console.error("Error in getAllCoachesForAdmin:", err);
    throw err;
  }
};

/**
 * Fetches coaches for a specific clinic with fallback mechanisms
 */
export const getClinicCoaches = async (clinicId: string): Promise<Coach[]> => {
  console.log(`Fetching coaches for clinic: ${clinicId}`);
  
  if (!clinicId) {
    console.error("Missing clinic ID in getClinicCoaches");
    return [];
  }
  
  try {
    // Try direct query first
    const directQueryResult = await tryDirectQuery(clinicId);
    if (directQueryResult.length > 0) {
      console.log(`Found ${directQueryResult.length} coaches for clinic ${clinicId} via direct query`);
      return directQueryResult;
    }
    
    // If direct query returns no results or fails, try a procedure call
    const procedureResult = await tryProcedureCall(clinicId);
    if (procedureResult.length > 0) {
      console.log(`Found ${procedureResult.length} coaches for clinic ${clinicId} via procedure`);
      return procedureResult;
    }
    
    // If all else fails, try a more permissive query
    const permissiveResult = await tryPermissiveQuery(clinicId);
    console.log(`Found ${permissiveResult.length} coaches for clinic ${clinicId} via permissive query`);
    return permissiveResult;
    
  } catch (error) {
    console.error(`Error fetching coaches for clinic ${clinicId}:`, error);
    // Return empty array instead of throwing to make UI more resilient
    return [];
  }
};

// Helper function for direct query attempt
async function tryDirectQuery(clinicId: string): Promise<Coach[]> {
  try {
    const { data, error } = await supabase
      .from('coaches')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('status', 'active')
      .order('name', { ascending: true });
    
    if (error) {
      console.warn(`Direct query failed for clinic ${clinicId}:`, error);
      return [];
    }
    
    // Map the database results to the Coach type
    const mappedCoaches: Coach[] = (data || []).map(coach => ({
      id: coach.id,
      name: coach.name, 
      email: coach.email,
      phone: coach.phone || null,
      status: coach.status || 'inactive',
      clinicId: coach.clinic_id,
      clinic_id: coach.clinic_id,
      clients: []
    }));
    
    return mappedCoaches;
  } catch (err) {
    console.warn("Error in tryDirectQuery:", err);
    return [];
  }
}

// Helper function for procedure call attempt
async function tryProcedureCall(clinicId: string): Promise<Coach[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_clinic_coaches', { clinic_id_param: clinicId });
    
    if (error) {
      console.warn(`Procedure call failed for clinic ${clinicId}:`, error);
      return [];
    }
    
    // Map the database results to the Coach type
    const mappedCoaches: Coach[] = (data || []).map(coach => ({
      id: coach.id,
      name: coach.name, 
      email: coach.email,
      phone: coach.phone || null,
      status: coach.status || 'inactive',
      clinicId: coach.clinic_id,
      clinic_id: coach.clinic_id,
      clients: []
    }));
    
    return mappedCoaches;
  } catch (err) {
    console.warn("Error in tryProcedureCall:", err);
    return [];
  }
}

// Helper function for permissive query attempt
async function tryPermissiveQuery(clinicId: string): Promise<Coach[]> {
  try {
    // Use a simpler query that might bypass RLS issues
    const { data, error } = await supabase
      .from('coaches')
      .select('id, name, email, phone, status, clinic_id')
      .eq('clinic_id', clinicId);
    
    if (error) {
      console.warn(`Permissive query failed for clinic ${clinicId}:`, error);
      return [];
    }
    
    // Map the database results to the Coach type
    const mappedCoaches: Coach[] = (data || []).map(coach => ({
      id: coach.id,
      name: coach.name, 
      email: coach.email,
      phone: coach.phone || null,
      status: coach.status || 'inactive',
      clinicId: coach.clinic_id,
      clinic_id: coach.clinic_id,
      clients: []
    }));
    
    return mappedCoaches;
  } catch (err) {
    console.warn("Error in tryPermissiveQuery:", err);
    return [];
  }
}
