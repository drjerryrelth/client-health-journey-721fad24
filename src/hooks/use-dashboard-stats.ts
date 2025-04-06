
import { useQuery } from '@tanstack/react-query';
import { DashboardStats, ActivityItem } from '@/types/dashboard';
import { useAuth } from '@/context/auth';
import { isSystemAdmin, isClinicAdmin, getUserClinicId } from '@/utils/role-based-access';

// Mock data function for dashboard stats based on user role
const fetchDashboardStatsForUser = async (user: any): Promise<DashboardStats> => {
  // In a real app, this would call the backend API with proper auth
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (isSystemAdmin(user)) {
    // System admin sees all clinics
    return {
      activeClinicCount: 3,
      totalCoachCount: 12,
      weeklyActivitiesCount: 156,
      clinicsSummary: [
        { id: '1', name: 'Wellness Center', coaches: 5, clients: 18, status: 'active' },
        { id: '2', name: 'Practice Naturals', coaches: 4, clients: 12, status: 'active' },
        { id: '3', name: 'Health Partners', coaches: 3, clients: 9, status: 'active' }
      ]
    };
  } else if (isClinicAdmin(user)) {
    // Clinic admin only sees their clinic
    const clinicName = user?.name?.replace(' User', '') || 'Your Clinic';
    return {
      activeClinicCount: 1,
      totalCoachCount: 4,
      weeklyActivitiesCount: 45,
      clinicsSummary: [
        { id: user?.clinicId || '1', name: clinicName, coaches: 4, clients: 12, status: 'active' }
      ]
    };
  }
  
  // Default empty state
  return {
    activeClinicCount: 0,
    totalCoachCount: 0,
    weeklyActivitiesCount: 0,
    clinicsSummary: []
  };
};

// Mock data function for activities based on user role
const fetchActivitiesForUser = async (user: any, limit: number = 5): Promise<ActivityItem[]> => {
  // In a real app, this would call the backend API with proper auth
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const systemAdminActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'clinic_signup',
      description: 'New clinic signed up: Wellness Center',
      timestamp: '2025-04-06T08:30:00Z',
      clinicId: '1'
    },
    {
      id: '2',
      type: 'coach_added',
      description: 'New coach added to Practice Naturals',
      timestamp: '2025-04-05T14:45:00Z',
      clinicId: '2'
    },
    {
      id: '3',
      type: 'check_in',
      description: 'Client completed weekly check-in',
      timestamp: '2025-04-05T10:15:00Z',
      clinicId: '3'
    },
    {
      id: '4',
      type: 'clinic_signup',
      description: 'New clinic signed up: Health Partners',
      timestamp: '2025-04-04T16:20:00Z',
      clinicId: '3'
    },
    {
      id: '5',
      type: 'message',
      description: 'Support message from Wellness Center',
      timestamp: '2025-04-04T11:05:00Z',
      clinicId: '1'
    }
  ];
  
  const clinicAdminActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'coach_added',
      description: 'New coach added to your clinic',
      timestamp: '2025-04-06T09:30:00Z',
      clinicId: user?.clinicId
    },
    {
      id: '2',
      type: 'check_in',
      description: 'Client Jerry completed weekly check-in',
      timestamp: '2025-04-05T14:15:00Z',
      clinicId: user?.clinicId
    },
    {
      id: '3',
      type: 'check_in',
      description: 'Client Sarah completed weekly check-in',
      timestamp: '2025-04-05T10:45:00Z',
      clinicId: user?.clinicId
    }
  ];
  
  if (isSystemAdmin(user)) {
    return systemAdminActivities.slice(0, limit);
  } else if (isClinicAdmin(user)) {
    return clinicAdminActivities.slice(0, limit);
  }
  
  return [];
};

// Hook for dashboard stats
export const useDashboardStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['dashboardStats', user?.id, user?.role],
    queryFn: () => fetchDashboardStatsForUser(user),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for recent activities
export const useRecentActivities = (limit: number = 5) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['recentActivities', user?.id, user?.role, limit],
    queryFn: () => fetchActivitiesForUser(user, limit),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
