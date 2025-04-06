
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';

export interface CoachCheckIn {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  weight?: number;
  mood?: number;
  energy?: number;
  notes?: string;
  reviewed: boolean;
}

export function useCoachCheckIns(limit = 50) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['coach-checkins', user?.id, limit],
    queryFn: async (): Promise<CoachCheckIn[]> => {
      try {
        if (!user?.id) {
          throw new Error('User not authenticated');
        }
        
        console.log('Fetching check-ins for coach ID:', user.id);
        
        // First get all clients assigned to this coach
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('id, name')
          .eq('coach_id', user.id);
          
        if (clientsError) throw clientsError;
        
        if (!clientsData || clientsData.length === 0) {
          return [];
        }
        
        // Create client ID to name mapping
        const clientMap = Object.fromEntries(
          clientsData.map(client => [client.id, client.name])
        );
        
        // Get client IDs
        const clientIds = clientsData.map(client => client.id);
        
        // Fetch check-ins for these clients
        const { data: checkInsData, error: checkInsError } = await supabase
          .from('check_ins')
          .select('*')
          .in('client_id', clientIds)
          .order('date', { ascending: false })
          .limit(limit);
          
        if (checkInsError) throw checkInsError;
        
        // Map the data to our interface
        return (checkInsData || []).map(checkIn => ({
          id: checkIn.id,
          clientId: checkIn.client_id,
          clientName: clientMap[checkIn.client_id] || 'Unknown Client',
          date: checkIn.date,
          weight: checkIn.weight,
          mood: checkIn.mood_score,
          energy: checkIn.energy_score,
          notes: checkIn.notes,
          reviewed: !!checkIn.reviewed_at
        }));
      } catch (error) {
        console.error('Error fetching coach check-ins:', error);
        toast.error('Failed to load check-in data');
        return [];
      }
    },
    enabled: !!user?.id
  });
}
