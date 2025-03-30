
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats } from '@/services/dashboard/stats-service';
import { fetchRecentActivities } from '@/services/dashboard/activity-service';
import { DashboardStats, ActivityItem } from '@/types/dashboard';

// Re-export types for backward compatibility
export type { DashboardStats, ActivityItem };

// Hook to use dashboard stats
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2, // Retry twice, then fail
    refetchOnWindowFocus: false // Don't refetch when window gets focus
  });
}

// Hook to use recent activities
export function useRecentActivities(limit: number = 5) {
  return useQuery({
    queryKey: ['recent-activities', limit],
    queryFn: () => fetchRecentActivities(limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 2, // Retry twice, then fail
    refetchOnWindowFocus: false // Don't refetch when window gets focus
  });
}
