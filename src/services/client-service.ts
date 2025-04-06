import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Client } from '@/types';

export class ClientService {
  static async getClinicClients(clinicId: string): Promise<Client[]> {
    try {
      console.log('Fetching clients for clinic ID:', clinicId);
      
      // First try with clinic_id (database column name)
      let { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('clinic_id', clinicId)
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching clients with clinic_id:', error);
        
        // If failed, try with clinicId (camelCase, might be used in some places)
        const alternativeResult = await supabase
          .from('clients')
          .select('*')
          .eq('clinicId', clinicId)
          .order('name', { ascending: true });
          
        if (!alternativeResult.error) {
          data = alternativeResult.data;
          console.log('Successfully fetched clients using clinicId instead of clinic_id');
        } else {
          console.error('Error fetching clients with clinicId as well:', alternativeResult.error);
          toast.error('Failed to load clients');
          return [];
        }
      }
      
      // Log the raw client data for debugging
      console.log('Raw client data from database:', data);
      
      // For each client, fetch coach info separately if needed
      const clientsWithCoachInfo = await Promise.all(
        (data || []).map(async (client) => {
          // Handle different naming conventions (coach_id vs coachId)
          const coachId = client.coach_id || client.coachId;
          
          if (coachId) {
            try {
              const { data: coachData, error: coachError } = await supabase
                .from('coaches')
                .select('id, name, email')
                .eq('id', coachId)
                .single();
                
              if (!coachError && coachData) {
                return { 
                  ...client, 
                  coach: coachData,
                  // Ensure consistent property naming
                  coachId: coachId
                };
              }
            } catch (coachFetchError) {
              console.error('Error fetching coach for client:', coachFetchError);
              // Continue without coach data
            }
          }
          
          // Ensure consistent property naming
          return { 
            ...client,
            coachId: coachId,
            // Convert database snake_case to camelCase if needed
            clinicId: client.clinic_id || client.clinicId,
            programId: client.program_id || client.programId,
            lastCheckIn: client.last_check_in || client.lastCheckIn
          };
        })
      );
      
      console.log(`Fetched ${clientsWithCoachInfo.length || 0} clients for clinic ${clinicId}`);
      return clientsWithCoachInfo;
    } catch (error) {
      console.error('Error in getClinicClients:', error);
      toast.error('An unexpected error occurred while loading clients');
      return [];
    }
  }
  
  static async getClientById(clientId: string): Promise<Client | null> {
    try {
      // Added safer query that doesn't join program directly to avoid relationship errors
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          coaches:coach_id (
            id,
            name,
            email
          )
        `)
        .eq('id', clientId)
        .single();
      
      if (error) {
        console.error('Error fetching client:', error);
        toast.error('Failed to load client details');
        return null;
      }
      
      // If there's a program_id, fetch the program separately to avoid join errors
      if (data.program_id) {
        try {
          const { data: programData, error: programError } = await supabase
            .from('programs')
            .select('*')
            .eq('id', data.program_id)
            .single();
            
          if (!programError && programData) {
            // Manually add the program data
            data.program = programData;
          }
        } catch (programErr) {
          console.error('Error fetching client program:', programErr);
          // Continue without program data
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error in getClientById:', error);
      toast.error('An unexpected error occurred while loading client details');
      return null;
    }
  }
  
  static async createClient(newClient: Omit<Client, 'id'>): Promise<{ data: Client | null; tempPassword?: string }> {
    try {
      console.log('Creating client with data:', newClient);
      
      // Generate a temporary password
      const tempPassword = Math.random().toString(36).slice(-8);
      
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newClient.email,
        password: tempPassword,
        options: {
          data: {
            full_name: newClient.name,
            role: 'client',
            clinic_id: newClient.clinicId // Use clinic_id format for consistent naming
          }
        }
      });
      
      if (authError) {
        console.error('Error creating user in Supabase Auth:', authError);
        toast.error('Failed to create client user account');
        return { data: null };
      }
      
      // Get the user ID from authData
      const userId = authData.user?.id;
      
      // Create client in the clients table
      const { data, error } = await supabase
        .from('clients')
        .insert([
          {
            name: newClient.name,
            email: newClient.email,
            phone: newClient.phone || null,
            program_id: newClient.programId || null,
            program_category: newClient.programCategory || null,
            start_date: newClient.startDate,
            notes: newClient.notes || null,
            clinic_id: newClient.clinicId,
            coach_id: newClient.coachId || null,
            user_id: userId, // Link the user ID
            initial_weight: newClient.initialWeight || null,
            weight_date: newClient.weightDate || null,
            goals: newClient.goals || null
          }
        ])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating client:', error);
        toast.error('Failed to create client: ' + error.message);
        
        // Delete the user from Supabase Auth if client creation fails
        if (userId) {
          try {
            await supabase.auth.admin.deleteUser(userId);
            console.log('Deleted user from Supabase Auth due to client creation failure');
          } catch (deleteError) {
            console.error('Error cleaning up auth user after failure:', deleteError);
          }
        }
        
        return { data: null };
      }
      
      console.log('Client created successfully:', data);
      
      return { data, tempPassword }; // Return the temporary password
    } catch (error) {
      console.error('Error in createClient:', error);
      if (error instanceof Error) {
        toast.error('An unexpected error occurred while creating client: ' + error.message);
      } else {
        toast.error('An unexpected error occurred while creating client');
      }
      return { data: null };
    }
  }
  
  static async updateClient(clientId: string, updates: Partial<Client>): Promise<{ data: Client | null }> {
    try {
      console.log('Updating client:', clientId, updates);
      
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', clientId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating client:', error);
        toast.error('Failed to update client');
        return { data: null };
      }
      
      console.log('Client updated successfully:', data);
      return { data };
    } catch (error) {
      console.error('Error in updateClient:', error);
      toast.error('An unexpected error occurred while updating client');
      return { data: null };
    }
  }
  
  static async deleteClient(clientId: string): Promise<boolean> {
    try {
      console.log('Deleting client:', clientId);
      
      // Get the client's user ID before deleting the client
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('user_id')
        .eq('id', clientId)
        .single();
      
      if (clientError) {
        console.error('Error fetching client user ID:', clientError);
        toast.error('Failed to delete client');
        return false;
      }
      
      const userId = clientData?.user_id;
      
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);
      
      if (error) {
        console.error('Error deleting client:', error);
        toast.error('Failed to delete client');
        return false;
      }
      
      console.log('Client deleted successfully');
      
      // Delete the user from Supabase Auth after deleting the client
      if (userId) {
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);
        if (authError) {
          console.error('Error deleting user from Supabase Auth:', authError);
          toast.error('Failed to delete client user account');
          return false;
        }
        console.log('Deleted user from Supabase Auth');
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteClient:', error);
      toast.error('An unexpected error occurred while deleting client');
      return false;
    }
  }
}
