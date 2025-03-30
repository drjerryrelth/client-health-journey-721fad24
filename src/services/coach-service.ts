
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { checkAuthentication } from './clinics/auth-helper';

export type Coach = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: 'active' | 'inactive';
  clinicId: string;
  clients: number;
};

export const CoachService = {
  // Fetch all coaches for a specific clinic
  async getClinicCoaches(clinicId: string): Promise<Coach[]> {
    try {
      console.log('Fetching coaches for clinic:', clinicId);
      
      const { data, error } = await supabase
        .from('coaches')
        .select(`
          id, 
          name, 
          email, 
          phone, 
          status, 
          clinic_id,
          clients:clients(id)
        `)
        .eq('clinic_id', clinicId)
        .order('name');

      if (error) {
        console.error('Error fetching coaches:', error);
        throw error;
      }
      
      console.log('Fetched coaches data:', data);
      
      // Transform and return the coaches data
      return (data || []).map(coach => ({
        id: coach.id,
        name: coach.name,
        email: coach.email,
        phone: coach.phone,
        status: coach.status as 'active' | 'inactive', // Cast to union type
        clinicId: coach.clinic_id,
        clients: Array.isArray(coach.clients) ? coach.clients.length : 0
      }));
    } catch (error) {
      console.error('Error fetching clinic coaches:', error);
      toast.error('Failed to fetch coaches. Using mock data as fallback.');
      // Return mock data as fallback
      return getMockCoaches().filter(coach => coach.clinicId === clinicId);
    }
  },

  // Delete a coach and reassign their clients
  async removeCoachAndReassignClients(coachId: string, newCoachId: string): Promise<boolean> {
    try {
      // First reassign all clients
      const { error: reassignError } = await supabase
        .from('clients')
        .update({ coach_id: newCoachId })
        .eq('coach_id', coachId);

      if (reassignError) throw reassignError;

      // Then delete the coach
      const { error: deleteError } = await supabase
        .from('coaches')
        .delete()
        .eq('id', coachId);

      if (deleteError) throw deleteError;

      toast.success('Clients reassigned and coach removed successfully');
      return true;
    } catch (error) {
      console.error('Error removing coach and reassigning clients:', error);
      toast.error('Failed to remove coach and reassign clients.');
      return false;
    }
  },
  
  // Add a new coach
  async addCoach(coach: Omit<Coach, 'id' | 'clients'>): Promise<Coach | null> {
    try {
      console.log('Adding coach with data:', coach);
      
      // Check if user is authenticated using the helper
      const session = await checkAuthentication();
      if (!session) {
        console.error('User is not authenticated');
        toast.error('You must be logged in to add a coach');
        return null;
      }
      
      const { data, error } = await supabase
        .from('coaches')
        .insert({
          name: coach.name,
          email: coach.email,
          phone: coach.phone,
          status: coach.status,
          clinic_id: coach.clinicId
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding coach:', error);
        toast.error(`Failed to add coach: ${error.message}`);
        throw error;
      }
      
      if (!data) {
        console.error('No data returned from coach creation');
        toast.error('Failed to add coach: No data returned from server');
        return null;
      }
      
      console.log('Added coach successfully:', data);
      toast.success('Coach added successfully!');
      
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.status as 'active' | 'inactive',
        clinicId: data.clinic_id,
        clients: 0
      };
    } catch (error) {
      console.error('Error adding coach:', error);
      if (error instanceof Error) {
        toast.error(`Failed to add coach: ${error.message}`);
      } else {
        toast.error('Failed to add coach due to an unknown error');
      }
      return null;
    }
  },
  
  // Update a coach
  async updateCoach(id: string, coach: Partial<Omit<Coach, 'id' | 'clients'>>): Promise<Coach | null> {
    try {
      // Check if user is authenticated using the helper
      const session = await checkAuthentication();
      if (!session) {
        console.error('User is not authenticated');
        toast.error('You must be logged in to update a coach');
        return null;
      }
      
      const updates: any = {};
      if (coach.name) updates.name = coach.name;
      if (coach.email) updates.email = coach.email;
      if (coach.phone !== undefined) updates.phone = coach.phone;
      if (coach.status) updates.status = coach.status;
      if (coach.clinicId) updates.clinic_id = coach.clinicId;
      
      const { data, error } = await supabase
        .from('coaches')
        .update(updates)
        .eq('id', id)
        .select(`
          id, 
          name, 
          email, 
          phone, 
          status, 
          clinic_id,
          clients:clients(id)
        `)
        .single();

      if (error) {
        console.error('Error updating coach:', error);
        toast.error(`Failed to update coach: ${error.message}`);
        throw error;
      }
      
      if (!data) {
        console.error('No data returned from coach update');
        toast.error('Failed to update coach: No data returned from server');
        return null;
      }
      
      console.log('Updated coach successfully:', data);
      toast.success('Coach updated successfully!');
      
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.status as 'active' | 'inactive',
        clinicId: data.clinic_id,
        clients: Array.isArray(data.clients) ? data.clients.length : 0
      };
    } catch (error) {
      console.error('Error updating coach:', error);
      if (error instanceof Error) {
        toast.error(`Failed to update coach: ${error.message}`);
      } else {
        toast.error('Failed to update coach due to an unknown error');
      }
      return null;
    }
  }
};

// Mock data for fallback when API calls fail
export const getMockCoaches = (): Coach[] => [
  {
    id: '1',
    name: 'Lisa Johnson',
    email: 'lisa@healthtracker.com',
    phone: '(555) 123-4567',
    status: 'active',
    clinicId: '1',
    clients: 8
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@healthtracker.com',
    phone: '(555) 234-5678',
    status: 'active',
    clinicId: '1',
    clients: 6
  },
  {
    id: '3',
    name: 'Sarah Williams',
    email: 'sarah@healthtracker.com',
    phone: '(555) 345-6789',
    status: 'inactive',
    clinicId: '2',
    clients: 4
  },
  {
    id: '4',
    name: 'David Martinez',
    email: 'david@healthtracker.com',
    phone: '(555) 456-7890',
    status: 'active',
    clinicId: '2',
    clients: 7
  },
  {
    id: '5',
    name: 'Jennifer Lee',
    email: 'jennifer@healthtracker.com',
    phone: '(555) 567-8901',
    status: 'active',
    clinicId: '3',
    clients: 9
  }
];

export default CoachService;
