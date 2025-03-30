
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
      // Since the coaches table doesn't exist in the current Supabase schema,
      // we're using mock data
      return getMockCoaches().filter(coach => coach.clinicId === clinicId);
      
      /* 
      // This code would be used once the coaches table is set up in Supabase
      // Note: We'll need to create the coaches table with appropriate columns first
      const { data, error } = await supabase
        .from('coaches')
        .select('*, clients(id)')
        .eq('clinic_id', clinicId)
        .order('name');

      if (error) throw error;
      
      // Transform and return the coaches data
      return data.map(coach => ({
        id: coach.id,
        name: coach.name,
        email: coach.email,
        phone: coach.phone,
        status: coach.status,
        clinicId: coach.clinic_id,
        clients: coach.clients ? coach.clients.length : 0
      }));
      */
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
      // Mock implementation since we don't have the actual tables yet
      console.log(`Mock reassignment: Coach ${coachId}'s clients reassigned to coach ${newCoachId}`);
      toast.success('Clients reassigned and coach removed successfully');
      return true;
      
      /* 
      // This code would be used once the coaches table is set up in Supabase
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

      return true;
      */
    } catch (error) {
      console.error('Error removing coach and reassigning clients:', error);
      toast.error('Failed to remove coach and reassign clients.');
      return false;
    }
  },
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
