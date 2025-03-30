
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DashboardStats {
  activeClinicCount: number;
  totalCoachCount: number;
  weeklyActivitiesCount: number;
  clinicsSummary: {
    id: string;
    name: string;
    coaches: number;
    clients: number;
    status: string;
  }[];
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  icon?: React.ReactNode;
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async (): Promise<DashboardStats> => {
      try {
        // 1. Get active clinics count
        const { data: clinics, error: clinicsError } = await supabase
          .from('clinics')
          .select('*')
          .eq('status', 'active');

        if (clinicsError) throw clinicsError;

        // 2. Get total coaches count
        const { data: coaches, error: coachesError } = await supabase
          .from('coaches')
          .select('*')
          .eq('status', 'active');

        if (coachesError) throw coachesError;

        // 3. Get weekly activities (check-ins within last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const oneWeekAgoStr = oneWeekAgo.toISOString().split('T')[0]; // YYYY-MM-DD

        const { data: recentCheckIns, error: checkInsError } = await supabase
          .from('check_ins')
          .select('*')
          .gte('date', oneWeekAgoStr);

        if (checkInsError) throw checkInsError;

        // 4. Get client count per clinic
        const clinicSummaries = await Promise.all(
          clinics.map(async (clinic) => {
            // Get coaches for this clinic
            const { data: clinicCoaches, error: clinicCoachesError } = await supabase
              .from('coaches')
              .select('id')
              .eq('clinic_id', clinic.id);

            if (clinicCoachesError) throw clinicCoachesError;

            // Get clients for this clinic
            const { data: clinicClients, error: clinicClientsError } = await supabase
              .from('clients')
              .select('id')
              .eq('clinic_id', clinic.id);

            if (clinicClientsError) throw clinicClientsError;

            return {
              id: clinic.id,
              name: clinic.name,
              coaches: clinicCoaches?.length || 0,
              clients: clinicClients?.length || 0,
              status: clinic.status
            };
          })
        );

        return {
          activeClinicCount: clinics.length,
          totalCoachCount: coaches.length,
          weeklyActivitiesCount: recentCheckIns.length,
          clinicsSummary: clinicSummaries,
        };
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast.error('Failed to fetch dashboard statistics');
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useRecentActivities = (limit: number = 10) => {
  return useQuery({
    queryKey: ['recentActivities', limit],
    queryFn: async (): Promise<ActivityItem[]> => {
      try {
        // Get recent check-ins
        const { data: checkIns, error: checkInsError } = await supabase
          .from('check_ins')
          .select('*, clients(name, clinic_id)')
          .order('created_at', { ascending: false })
          .limit(Math.ceil(limit / 2));

        if (checkInsError) throw checkInsError;

        // Get recent clinic creations
        const { data: clinics, error: clinicsError } = await supabase
          .from('clinics')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(Math.ceil(limit / 4));

        if (clinicsError) throw clinicsError;

        // Get recent coach additions
        const { data: coaches, error: coachesError } = await supabase
          .from('coaches')
          .select('*, clinics(name)')
          .order('created_at', { ascending: false })
          .limit(Math.ceil(limit / 4));

        if (coachesError) throw coachesError;

        // Format check-ins as activities
        const checkInActivities = checkIns.map(checkIn => {
          const clientName = checkIn.clients?.name || 'Unknown Client';
          
          return {
            id: `check-in-${checkIn.id}`,
            type: 'check_in',
            description: `New check-in received from ${clientName}`,
            timestamp: formatTimeAgo(checkIn.created_at),
          };
        });

        // Format clinic creations as activities
        const clinicActivities = clinics.map(clinic => {
          return {
            id: `clinic-${clinic.id}`,
            type: 'clinic_signup',
            description: `New clinic signed up: ${clinic.name}`,
            timestamp: formatTimeAgo(clinic.created_at),
          };
        });

        // Format coach additions as activities
        const coachActivities = coaches.map(coach => {
          const clinicName = coach.clinics?.name || 'Unknown Clinic';
          
          return {
            id: `coach-${coach.id}`,
            type: 'coach_added',
            description: `Coach ${coach.name} was added to ${clinicName}`,
            timestamp: formatTimeAgo(coach.created_at),
          };
        });

        // Combine and sort all activities by approximate timestamp
        const allActivities = [
          ...checkInActivities,
          ...clinicActivities,
          ...coachActivities
        ]
        // Sort by approximate timestamp (recent first)
        .sort((a, b) => {
          // Extract numeric values from timestamps for comparison
          const timeA = extractTimeValue(a.timestamp);
          const timeB = extractTimeValue(b.timestamp);
          return timeA - timeB;
        })
        .slice(0, limit);

        return allActivities;
      } catch (error) {
        console.error('Error fetching recent activities:', error);
        toast.error('Failed to fetch recent activities');
        throw error;
      }
    },
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

// Helper functions for timestamp formatting
function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }
}

function extractTimeValue(timeAgo: string): number {
  if (timeAgo === 'just now') return 0;
  
  const match = timeAgo.match(/(\d+)/);
  if (!match) return Number.MAX_SAFE_INTEGER;
  
  const value = parseInt(match[1]);
  
  if (timeAgo.includes('minute')) return value;
  if (timeAgo.includes('hour')) return value * 60;
  if (timeAgo.includes('day')) return value * 60 * 24;
  if (timeAgo.includes('week')) return value * 60 * 24 * 7;
  
  return Number.MAX_SAFE_INTEGER;
}
