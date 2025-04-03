
import { supabase } from '@/integrations/supabase/client';
import { Client, mapDbClientToClient, mapClientToDbClient } from '@/types';
import { ClientRow } from '@/types/database';
import { toast } from 'sonner';
import { createClient, updateClient, deleteClient } from './clients/mutations';

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
      
      return (data as ClientRow[]).map(mapDbClientToClient);
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
      
      return mapDbClientToClient(data as ClientRow);
    } catch (error) {
      console.error('Error fetching client details:', error);
      toast.error('Failed to fetch client details. Please try again later.');
      
      // Return mock client as fallback
      return mockClients.find(c => c.id === clientId) || null;
    }
  },
  
  // Create a new client
  createClient,
  
  // Update an existing client
  updateClient,
  
  // Delete a client
  deleteClient
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
