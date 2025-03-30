
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Clinic = {
  id: string;
  name: string;
  location: string;
  email: string | null;
  phone: string | null;
  status: 'active' | 'inactive';
  createdAt: string;
  // New fields
  streetAddress: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  primaryContact: string | null;
};

export const ClinicService = {
  // Fetch all clinics
  async getClinics(): Promise<Clinic[]> {
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .order('name');

      if (error) throw error;
      
      return data.map(clinic => ({
        id: clinic.id,
        name: clinic.name,
        location: clinic.location || '',
        email: clinic.email,
        phone: clinic.phone,
        status: (clinic.status || 'active') as 'active' | 'inactive',
        createdAt: clinic.created_at,
        streetAddress: clinic.street_address,
        city: clinic.city,
        state: clinic.state,
        zip: clinic.zip,
        primaryContact: clinic.primary_contact
      }));
    } catch (error) {
      console.error('Error fetching clinics:', error);
      toast.error('Failed to fetch clinics.');
      // Return mock data as fallback
      return getMockClinics();
    }
  },

  // Add a new clinic
  async addClinic(clinic: {
    name: string;
    location: string;
    email?: string;
    phone?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    zip?: string;
    primaryContact?: string;
  }): Promise<Clinic | null> {
    try {
      const { data, error } = await supabase
        .from('clinics')
        .insert({
          name: clinic.name,
          location: clinic.location,
          email: clinic.email || null,
          phone: clinic.phone || null,
          status: 'active',
          street_address: clinic.streetAddress || null,
          city: clinic.city || null,
          state: clinic.state || null,
          zip: clinic.zip || null,
          primary_contact: clinic.primaryContact || null
        })
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        location: data.location || '',
        email: data.email,
        phone: data.phone,
        status: data.status as 'active' | 'inactive',
        createdAt: data.created_at,
        streetAddress: data.street_address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        primaryContact: data.primary_contact
      };
    } catch (error) {
      console.error('Error adding clinic:', error);
      toast.error('Failed to add clinic.');
      return null;
    }
  },
  
  // Update a clinic
  async updateClinic(id: string, updates: Partial<Omit<Clinic, 'id' | 'createdAt'>>): Promise<Clinic | null> {
    try {
      const dbUpdates: any = { ...updates };
      
      // Convert camelCase properties to snake_case for the database
      if (updates.streetAddress !== undefined) {
        dbUpdates.street_address = updates.streetAddress;
        delete dbUpdates.streetAddress;
      }
      if (updates.primaryContact !== undefined) {
        dbUpdates.primary_contact = updates.primaryContact;
        delete dbUpdates.primaryContact;
      }
      
      const { data, error } = await supabase
        .from('clinics')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        location: data.location || '',
        email: data.email,
        phone: data.phone,
        status: data.status as 'active' | 'inactive',
        createdAt: data.created_at,
        streetAddress: data.street_address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        primaryContact: data.primary_contact
      };
    } catch (error) {
      console.error('Error updating clinic:', error);
      toast.error('Failed to update clinic.');
      return null;
    }
  },
  
  // Delete a clinic
  async deleteClinic(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('clinics')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting clinic:', error);
      toast.error('Failed to delete clinic.');
      return false;
    }
  }
};

// Mock data for fallback when API calls fail
export const getMockClinics = (): Clinic[] => [
  { 
    id: '1',
    name: 'Wellness Center',
    location: 'New York, NY',
    email: 'info@wellness.com',
    phone: '(555) 123-4567',
    status: 'active',
    createdAt: '2023-01-15T00:00:00.000Z',
    streetAddress: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    primaryContact: 'John Smith'
  },
  { 
    id: '2',
    name: 'Practice Naturals',
    location: 'Los Angeles, CA',
    email: 'contact@practicenaturals.com',
    phone: '(555) 234-5678',
    status: 'active',
    createdAt: '2023-02-20T00:00:00.000Z',
    streetAddress: '456 Boulevard Ave',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90001',
    primaryContact: 'Jane Doe'
  },
  { 
    id: '3',
    name: 'Health Partners',
    location: 'Chicago, IL',
    email: 'support@healthpartners.com',
    phone: '(555) 345-6789',
    status: 'active',
    createdAt: '2023-03-05T00:00:00.000Z',
    streetAddress: '789 Health Way',
    city: 'Chicago',
    state: 'IL',
    zip: '60601',
    primaryContact: 'Mike Johnson'
  }
];

export default ClinicService;
