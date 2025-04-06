
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
    retry: 3, // Increase retry count to help with intermittent errors
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff
    refetchOnWindowFocus: false, // Don't refetch when window gets focus
    refetchOnMount: true // Always refetch when component mounts
  });
}

// Hook to use recent activities
export function useRecentActivities(limit: number = 5) {
  return useQuery({
    queryKey: ['recent-activities', limit],
    queryFn: () => fetchRecentActivities(limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 3, // Increase retry count
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff
    refetchOnWindowFocus: false, // Don't refetch when window gets focus
    refetchOnMount: true // Always refetch when component mounts
  });
}
