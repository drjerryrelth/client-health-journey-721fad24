import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { checkAuthentication } from '@/services/clinics/auth-helper';

// Define coach-specific dashboard stats
export interface CoachDashboardStats {
  activeClients: number;
  pendingCheckIns: number;
  activePrograms: number;
  completedPrograms: number;
}

// Define coach-specific activity item
export interface CoachActivityItem {
  id: string;
  type: 'check_in' | 'client_added' | 'program_assigned' | string;
  description: string;
  timestamp: string;
  clientId?: string;
}

// Hook to fetch coach-specific dashboard stats
export function useCoachDashboardStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['coach-dashboard-stats', user?.id],
    queryFn: async (): Promise<CoachDashboardStats> => {
      try {
        const session = await checkAuthentication();
        if (!session) {
          throw new Error('Authentication required to fetch dashboard statistics');
        }

        console.log('[CoachDashboard] Fetching coach stats for user ID:', user?.id);
        
        // Get active clients count for this coach
        const { count: activeClientsCount, error: clientsError } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true })
          .eq('coach_id', user?.coach_id);
          
        if (clientsError) {
          throw clientsError;
        }
        
        // Get pending check-ins (clients that haven't checked in within the last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const { data: clientsData, error: clientsListError } = await supabase
          .from('clients')
          .select('id, last_check_in')
          .eq('coach_id', user?.coach_id);
          
        if (clientsListError) {
          throw clientsListError;
        }
        
        // Count clients with missing or old check-ins
        const pendingCheckIns = clientsData.filter(client => {
          if (!client.last_check_in) return true;
          const lastCheckIn = new Date(client.last_check_in);
          return lastCheckIn < oneWeekAgo;
        }).length;
        
        // Get active programs count (programs with assigned clients)
        const { data: programsData, error: programsError } = await supabase
          .from('clients')
          .select('program_id')
          .eq('coach_id', user?.coach_id)
          .not('program_id', 'is', null);
          
        if (programsError) {
          throw programsError;
        }
        
        // Count unique active programs
        const uniqueActivePrograms = new Set(
          programsData.map(client => client.program_id)
        ).size;
        
        // We'll set completed programs to 0 for now, but could implement a more complex query if needed
        const completedPrograms = 0;
        
        return {
          activeClients: activeClientsCount || 0,
          pendingCheckIns,
          activePrograms: uniqueActivePrograms,
          completedPrograms
        };
      } catch (error) {
        console.error('[CoachDashboard] Error fetching dashboard stats:', error);
        toast.error("Failed to load dashboard statistics");
        
        // Return default values
        return {
          activeClients: 0,
          pendingCheckIns: 0,
          activePrograms: 0,
          completedPrograms: 0
        };
      }
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: false
  });
}

// Hook to fetch coach-specific recent activities
export function useCoachRecentActivities(limit: number = 5) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['coach-recent-activities', user?.id, limit],
    queryFn: async (): Promise<CoachActivityItem[]> => {
      try {
        const session = await checkAuthentication();
        if (!session) {
          throw new Error('Authentication required to fetch activities');
        }

        console.log('[CoachDashboard] Fetching coach activities for user ID:', user?.id);
        
        // Create an array to store activities from multiple sources
        const activities: CoachActivityItem[] = [];
        
        // Get coach's clients
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('id, name')
          .eq('coach_id', user?.id);
          
        if (clientsError) {
          throw clientsError;
        }
        
        if (!clientsData || clientsData.length === 0) {
          return [];
        }
        
        // Get client IDs
        const clientIds = clientsData.map(client => client.id);
        
        // 1. Get check-ins for coach's clients
        const { data: checkInsData, error: checkInsError } = await supabase
          .from('check_ins')
          .select('id, created_at, client_id')
          .in('client_id', clientIds)
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (!checkInsError && checkInsData) {
          // Create a map of client IDs to names for lookup
          const clientNameMap = Object.fromEntries(
            clientsData.map(client => [client.id, client.name])
          );
          
          for (const checkIn of checkInsData) {
            activities.push({
              id: checkIn.id,
              type: 'check_in',
              description: `${clientNameMap[checkIn.client_id] || 'A client'} submitted a check-in`,
              timestamp: new Date(checkIn.created_at).toISOString(),
              clientId: checkIn.client_id
            });
          }
        }
        
        // Sort activities by timestamp (newest first)
        activities.sort((a, b) => {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
        
        // Return activities (limited to requested amount)
        return activities.slice(0, limit);
      } catch (error) {
        console.error('[CoachDashboard] Error fetching recent activities:', error);
        toast.error("Failed to load recent activities");
        return [];
      }
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: false
  });
}

// Hook to fetch historical check-in and weight data
export function useCoachHistoricalData() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['coach-historical-data', user?.id],
    queryFn: async () => {
      try {
        const session = await checkAuthentication();
        if (!session) {
          throw new Error('Authentication required to fetch historical data');
        }

        // Get the last 6 months of data
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // First, get all clients for this coach
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('id')
          .eq('coach_id', user?.id);

        if (clientsError) {
          throw clientsError;
        }

        if (!clientsData || clientsData.length === 0) {
          return [];
        }

        // Get client IDs
        const clientIds = clientsData.map(client => client.id);

        // Then get check-ins for these clients
        const { data: checkInsData, error: checkInsError } = await supabase
          .from('check_ins')
          .select(`
            id,
            created_at,
            client_id,
            weight
          `)
          .in('client_id', clientIds)
          .gte('created_at', sixMonthsAgo.toISOString())
          .order('created_at', { ascending: true });

        if (checkInsError) {
          throw checkInsError;
        }

        // Group data by month
        const monthlyData = new Map<string, { checkIns: number; totalWeight: number; count: number }>();
        
        checkInsData.forEach(checkIn => {
          const date = new Date(checkIn.created_at);
          const monthKey = date.toLocaleString('default', { month: 'short' });
          
          if (!monthlyData.has(monthKey)) {
            monthlyData.set(monthKey, { checkIns: 0, totalWeight: 0, count: 0 });
          }
          
          const monthData = monthlyData.get(monthKey)!;
          monthData.checkIns++;
          if (checkIn.weight) {
            monthData.totalWeight += checkIn.weight;
            monthData.count++;
          }
        });

        // Convert to array format for the chart
        const chartData = Array.from(monthlyData.entries()).map(([month, data]) => ({
          month,
          checkIns: data.checkIns,
          avgWeight: data.count > 0 ? Math.round(data.totalWeight / data.count) : 0
        }));

        return chartData;
      } catch (error) {
        console.error('[CoachDashboard] Error fetching historical data:', error);
        toast.error("Failed to load historical data");
        return [];
      }
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: false
  });
}
