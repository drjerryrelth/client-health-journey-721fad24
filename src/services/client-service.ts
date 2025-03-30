
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types';
import { toast } from 'sonner';

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
      toast.error('Failed to fetch client list. Please check your connection.');
      return mockClients; // Return mock data as fallback
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
      toast.error('Failed to fetch client details. Please try again later.');
      
      // Return mock client as fallback
      return mockClients.find(c => c.id === clientId) || null;
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

// Mock data for fallback when API calls fail
const mockClients: Client[] = [
  {
    id: '1',
    userId: 'user-1',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-123-4567',
    startDate: '2023-01-15',
    lastCheckIn: '2023-05-10',
    notes: 'Regular client with good progress',
    clinicId: 'clinic-1'
  },
  {
    id: '2',
    userId: 'user-2',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    phone: '555-987-6543',
    programId: 'program-1',
    startDate: '2023-02-20',
    lastCheckIn: '2023-05-12',
    notes: 'Following keto program',
    clinicId: 'clinic-1'
  }
];

export default ClientService;
