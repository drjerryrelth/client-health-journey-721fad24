import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Client } from '@/types';

export class ClientService {
  static async getClinicClients(clinicId: string): Promise<Client[]> {
    try {
      console.log('Fetching clients for clinic ID:', clinicId);
      
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
        .eq('clinic_id', clinicId)
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching clients:', error);
        toast.error('Failed to load clients');
        return [];
      }
      
      console.log(`Fetched ${data?.length || 0} clients for clinic ${clinicId}`);
      return data || [];
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
      console.log('Creating client:', newClient);
      
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
            clinicId: newClient.clinicId
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
            ...newClient,
            user_id: userId // Link the user ID
          }
        ])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating client:', error);
        toast.error('Failed to create client');
        
        // Delete the user from Supabase Auth if client creation fails
        if (userId) {
          await supabase.auth.admin.deleteUser(userId);
          console.log('Deleted user from Supabase Auth due to client creation failure');
        }
        
        return { data: null };
      }
      
      console.log('Client created successfully:', data);
      
      return { data, tempPassword }; // Return the temporary password
    } catch (error) {
      console.error('Error in createClient:', error);
      toast.error('An unexpected error occurred while creating client');
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
