
import supabase from '@/lib/supabase';
import { Client } from '@/types';

export const ClientService = {
  // Fetch all clients for a specific clinic
  async getClinicClients(clinicId: string): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('clinic_id', clinicId)
        .order('name');

      if (error) throw error;
      
      return data as Client[];
    } catch (error) {
      console.error('Error fetching clinic clients:', error);
      throw error;
    }
  },
  
  // Fetch a specific client by ID
  async getClientById(clientId: string): Promise<Client | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (error) throw error;
      
      return data as Client;
    } catch (error) {
      console.error('Error fetching client details:', error);
      throw error;
    }
  },
  
  // Create a new client
  async createClient(client: Omit<Client, 'id'>): Promise<Client> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([client])
        .select()
        .single();

      if (error) throw error;
      
      return data as Client;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },
  
  // Update an existing client
  async updateClient(clientId: string, updates: Partial<Client>): Promise<Client> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', clientId)
        .select()
        .single();

      if (error) throw error;
      
      return data as Client;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },
  
  // Delete a client
  async deleteClient(clientId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }
};

export default ClientService;
