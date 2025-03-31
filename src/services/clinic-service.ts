
import { supabase } from '@/integrations/supabase/client';

export interface Clinic {
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
  // Branding
  logo: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
}

// Map database fields to frontend fields
const mapDbToClinic = (dbClinic: any): Clinic => {
  return {
    id: dbClinic.id,
    name: dbClinic.name,
    email: dbClinic.email,
    phone: dbClinic.phone,
    status: dbClinic.status || 'inactive',
    createdAt: dbClinic.created_at,
    streetAddress: dbClinic.street_address,
    city: dbClinic.city,
    state: dbClinic.state,
    zip: dbClinic.zip,
    primaryContact: dbClinic.primary_contact,
    billingContactName: dbClinic.billing_contact_name,
    billingEmail: dbClinic.billing_email,
    billingPhone: dbClinic.billing_phone,
    billingAddress: dbClinic.billing_address,
    billingCity: dbClinic.billing_city,
    billingState: dbClinic.billing_state,
    billingZip: dbClinic.billing_zip,
    paymentMethod: dbClinic.payment_method,
    subscriptionTier: dbClinic.subscription_tier,
    subscriptionStatus: dbClinic.subscription_status,
    logo: dbClinic.logo,
    primaryColor: dbClinic.primary_color,
    secondaryColor: dbClinic.secondary_color,
  };
};

// Map frontend fields to database fields
const mapClinicToDb = (clinic: Partial<Clinic>) => {
  return {
    name: clinic.name,
    email: clinic.email,
    phone: clinic.phone,
    status: clinic.status,
    street_address: clinic.streetAddress,
    city: clinic.city,
    state: clinic.state,
    zip: clinic.zip,
    primary_contact: clinic.primaryContact,
    billing_contact_name: clinic.billingContactName,
    billing_email: clinic.billingEmail,
    billing_phone: clinic.billingPhone,
    billing_address: clinic.billingAddress,
    billing_city: clinic.billingCity,
    billing_state: clinic.billingState,
    billing_zip: clinic.billingZip,
    payment_method: clinic.paymentMethod,
    subscription_tier: clinic.subscriptionTier,
    subscription_status: clinic.subscriptionStatus,
    logo: clinic.logo,
    primary_color: clinic.primaryColor,
    secondary_color: clinic.secondaryColor,
  };
};

const ClinicService = {
  getClinic: async (clinicId: string): Promise<Clinic | null> => {
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', clinicId)
        .single();

      if (error) throw error;
      return mapDbToClinic(data);
    } catch (error) {
      console.error('Error fetching clinic:', error);
      return null;
    }
  },

  getClinics: async (): Promise<Clinic[]> => {
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .order('name');

      if (error) throw error;
      return data.map(mapDbToClinic);
    } catch (error) {
      console.error('Error fetching clinics:', error);
      return [];
    }
  },

  // Add the addClinic method to match what's being used in AddClinicDialog
  addClinic: async (clinic: Partial<Clinic>): Promise<Clinic | null> => {
    try {
      const { data, error } = await supabase
        .from('clinics')
        .insert(mapClinicToDb(clinic))
        .select()
        .single();

      if (error) throw error;
      return mapDbToClinic(data);
    } catch (error) {
      console.error('Error adding clinic:', error);
      return null;
    }
  },

  createClinic: async (clinic: Partial<Clinic>): Promise<{ data: Clinic | null, error: any }> => {
    try {
      const { data, error } = await supabase
        .from('clinics')
        .insert(mapClinicToDb(clinic))
        .select()
        .single();

      if (error) throw error;
      return { data: mapDbToClinic(data), error: null };
    } catch (error) {
      console.error('Error creating clinic:', error);
      return { data: null, error };
    }
  },

  updateClinic: async (clinicId: string, updates: Partial<Clinic>): Promise<{ data: Clinic | null, error: any }> => {
    try {
      const { data, error } = await supabase
        .from('clinics')
        .update(mapClinicToDb(updates))
        .eq('id', clinicId)
        .select()
        .single();

      if (error) throw error;
      return { data: mapDbToClinic(data), error: null };
    } catch (error) {
      console.error('Error updating clinic:', error);
      return { data: null, error };
    }
  },

  deleteClinic: async (clinicId: string): Promise<{ success: boolean, error: any }> => {
    try {
      const { error } = await supabase
        .from('clinics')
        .delete()
        .eq('id', clinicId);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting clinic:', error);
      return { success: false, error };
    }
  },

  updateClinicBranding: async (clinicId: string, logo: string | null, primaryColor: string | null, secondaryColor: string | null): Promise<{ success: boolean, error: any }> => {
    try {
      const { error } = await supabase
        .from('clinics')
        .update({
          logo,
          primary_color: primaryColor,
          secondary_color: secondaryColor
        })
        .eq('id', clinicId);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Error updating clinic branding:', error);
      return { success: false, error };
    }
  }
};

// Export as both default and named export to support both import styles
export { ClinicService };
export default ClinicService;
