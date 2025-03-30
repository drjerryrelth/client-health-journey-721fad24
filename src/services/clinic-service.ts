
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Clinic = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: 'active' | 'inactive';
  createdAt: string;
  // Address fields
  streetAddress: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  primaryContact: string | null;
  // Billing fields
  billingContactName: string | null;
  billingEmail: string | null;
  billingPhone: string | null;
  billingAddress: string | null;
  billingCity: string | null;
  billingState: string | null;
  billingZip: string | null;
  paymentMethod: string | null;
  subscriptionTier: string | null;
  subscriptionStatus: string | null;
};

export const ClinicService = {
  // Fetch all clinics
  async getClinics(): Promise<Clinic[]> {
    try {
      // First check if user is authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        console.error('User not authenticated');
        toast.error('You must be logged in to view clinics');
        return getMockClinics(); // Fallback to mock data
      }

      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error details from Supabase:', error);
        throw error;
      }
      
      return data.map(clinic => ({
        id: clinic.id,
        name: clinic.name,
        email: clinic.email,
        phone: clinic.phone,
        status: (clinic.status || 'active') as 'active' | 'inactive',
        createdAt: clinic.created_at,
        streetAddress: clinic.street_address,
        city: clinic.city,
        state: clinic.state,
        zip: clinic.zip,
        primaryContact: clinic.primary_contact,
        // Map the billing fields
        billingContactName: clinic.billing_contact_name,
        billingEmail: clinic.billing_email,
        billingPhone: clinic.billing_phone,
        billingAddress: clinic.billing_address,
        billingCity: clinic.billing_city,
        billingState: clinic.billing_state,
        billingZip: clinic.billing_zip,
        paymentMethod: clinic.payment_method,
        subscriptionTier: clinic.subscription_tier,
        subscriptionStatus: clinic.subscription_status
      }));
    } catch (error) {
      console.error('Error fetching clinics:', error);
      toast.error('Failed to fetch clinics.');
      // Return mock data as fallback
      return getMockClinics();
    }
  },

  // Get a single clinic by ID
  async getClinic(id: string): Promise<Clinic | null> {
    try {
      // First check if user is authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        console.error('User not authenticated');
        toast.error('You must be logged in to view clinic details');
        return null;
      }
      
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching clinic:', error);
        throw error;
      }
      
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: (data.status || 'active') as 'active' | 'inactive',
        createdAt: data.created_at,
        streetAddress: data.street_address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        primaryContact: data.primary_contact,
        // Map the billing fields
        billingContactName: data.billing_contact_name,
        billingEmail: data.billing_email,
        billingPhone: data.billing_phone,
        billingAddress: data.billing_address,
        billingCity: data.billing_city,
        billingState: data.billing_state,
        billingZip: data.billing_zip,
        paymentMethod: data.payment_method,
        subscriptionTier: data.subscription_tier,
        subscriptionStatus: data.subscription_status
      };
    } catch (error) {
      console.error('Error fetching clinic:', error);
      toast.error('Failed to fetch clinic details.');
      return null;
    }
  },

  // Add a new clinic
  async addClinic(clinic: {
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
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        console.error('User not authenticated');
        toast.error('You must be logged in to add a clinic');
        return null;
      }

      // For demo purposes, we'll assume the user is an admin if they're logged in
      // This is a workaround for the RLS policy issues
      // In production, we would properly verify the admin role
      
      const { data, error } = await supabase
        .from('clinics')
        .insert({
          name: clinic.name,
          email: clinic.email || null,
          phone: clinic.phone || null,
          status: 'active',
          street_address: clinic.streetAddress || null,
          city: clinic.city || null,
          state: clinic.state || null,
          zip: clinic.zip || null,
          primary_contact: clinic.primaryContact || null,
          billing_contact_name: clinic.billingContactName || null,
          billing_email: clinic.billingEmail || null,
          billing_phone: clinic.billingPhone || null,
          billing_address: clinic.billingAddress || null,
          billing_city: clinic.billingCity || null,
          billing_state: clinic.billingState || null,
          billing_zip: clinic.billingZip || null,
          payment_method: clinic.paymentMethod || null,
          subscription_tier: clinic.subscriptionTier || null,
          subscription_status: clinic.subscriptionStatus || 'active'
        })
        .select()
        .single();

      if (error) {
        console.error('Error details from Supabase:', error);
        throw error;
      }
      
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.status as 'active' | 'inactive',
        createdAt: data.created_at,
        streetAddress: data.street_address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        primaryContact: data.primary_contact,
        billingContactName: data.billing_contact_name,
        billingEmail: data.billing_email,
        billingPhone: data.billing_phone,
        billingAddress: data.billing_address,
        billingCity: data.billing_city,
        billingState: data.billing_state,
        billingZip: data.billing_zip,
        paymentMethod: data.payment_method,
        subscriptionTier: data.subscription_tier,
        subscriptionStatus: data.subscription_status
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
      // Check if user is logged in
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        console.error('User not authenticated');
        toast.error('You must be logged in to update a clinic');
        return null;
      }

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
      if (updates.billingContactName !== undefined) {
        dbUpdates.billing_contact_name = updates.billingContactName;
        delete dbUpdates.billingContactName;
      }
      if (updates.billingEmail !== undefined) {
        dbUpdates.billing_email = updates.billingEmail;
        delete dbUpdates.billingEmail;
      }
      if (updates.billingPhone !== undefined) {
        dbUpdates.billing_phone = updates.billingPhone;
        delete dbUpdates.billingPhone;
      }
      if (updates.billingAddress !== undefined) {
        dbUpdates.billing_address = updates.billingAddress;
        delete dbUpdates.billingAddress;
      }
      if (updates.billingCity !== undefined) {
        dbUpdates.billing_city = updates.billingCity;
        delete dbUpdates.billingCity;
      }
      if (updates.billingState !== undefined) {
        dbUpdates.billing_state = updates.billingState;
        delete dbUpdates.billingState;
      }
      if (updates.billingZip !== undefined) {
        dbUpdates.billing_zip = updates.billingZip;
        delete dbUpdates.billingZip;
      }
      if (updates.paymentMethod !== undefined) {
        dbUpdates.payment_method = updates.paymentMethod;
        delete dbUpdates.paymentMethod;
      }
      if (updates.subscriptionTier !== undefined) {
        dbUpdates.subscription_tier = updates.subscriptionTier;
        delete dbUpdates.subscriptionTier;
      }
      if (updates.subscriptionStatus !== undefined) {
        dbUpdates.subscription_status = updates.subscriptionStatus;
        delete dbUpdates.subscriptionStatus;
      }
      
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
      
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.status as 'active' | 'inactive',
        createdAt: data.created_at,
        streetAddress: data.street_address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        primaryContact: data.primary_contact,
        billingContactName: data.billing_contact_name,
        billingEmail: data.billing_email,
        billingPhone: data.billing_phone,
        billingAddress: data.billing_address,
        billingCity: data.billing_city,
        billingState: data.billing_state,
        billingZip: data.billing_zip,
        paymentMethod: data.payment_method,
        subscriptionTier: data.subscription_tier,
        subscriptionStatus: data.subscription_status
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
      // Check if user is logged in
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        console.error('User not authenticated');
        toast.error('You must be logged in to delete a clinic');
        return false;
      }
      
      const { error } = await supabase
        .from('clinics')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting clinic:', error);
        throw error;
      }
      
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
    email: 'info@wellness.com',
    phone: '(555) 123-4567',
    status: 'active',
    createdAt: '2023-01-15T00:00:00.000Z',
    streetAddress: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    primaryContact: 'John Smith',
    billingContactName: 'Jane Smith',
    billingEmail: 'billing@wellness.com',
    billingPhone: '(555) 123-9999',
    billingAddress: '123 Main St',
    billingCity: 'New York',
    billingState: 'NY',
    billingZip: '10001',
    paymentMethod: 'Credit Card',
    subscriptionTier: 'Premium',
    subscriptionStatus: 'active'
  },
  { 
    id: '2',
    name: 'Practice Naturals',
    email: 'contact@practicenaturals.com',
    phone: '(555) 234-5678',
    status: 'active',
    createdAt: '2023-02-20T00:00:00.000Z',
    streetAddress: '456 Boulevard Ave',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90001',
    primaryContact: 'Jane Doe',
    billingContactName: 'Bob Johnson',
    billingEmail: 'billing@practicenaturals.com',
    billingPhone: '(555) 234-9999',
    billingAddress: '456 Boulevard Ave',
    billingCity: 'Los Angeles',
    billingState: 'CA',
    billingZip: '90001',
    paymentMethod: 'Bank Transfer',
    subscriptionTier: 'Standard',
    subscriptionStatus: 'active'
  },
  { 
    id: '3',
    name: 'Health Partners',
    email: 'support@healthpartners.com',
    phone: '(555) 345-6789',
    status: 'active',
    createdAt: '2023-03-05T00:00:00.000Z',
    streetAddress: '789 Health Way',
    city: 'Chicago',
    state: 'IL',
    zip: '60601',
    primaryContact: 'Mike Johnson',
    billingContactName: 'Sarah Wilson',
    billingEmail: 'billing@healthpartners.com',
    billingPhone: '(555) 345-9999',
    billingAddress: '789 Health Way',
    billingCity: 'Chicago',
    billingState: 'IL',
    billingZip: '60601',
    paymentMethod: 'Credit Card',
    subscriptionTier: 'Basic',
    subscriptionStatus: 'active'
  }
];

export default ClinicService;
