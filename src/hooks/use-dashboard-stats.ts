
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats } from '@/services/dashboard/stats-service';
import { fetchRecentActivities } from '@/services/dashboard/activity-service';
import { useAuth } from '@/context/auth';

export function useDashboardStats() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['dashboard-stats', user?.role, user?.clinicId],
    queryFn: () => fetchDashboardStats(),
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useRecentActivities(limit: number = 10) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['recent-activities', user?.role, user?.clinicId, limit],
    queryFn: () => fetchRecentActivities(limit),
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
