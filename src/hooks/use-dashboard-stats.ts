import { useQuery } from '@tanstack/react-query';
import { DashboardStats, ActivityItem } from '@/types/dashboard';
import { useAuth } from '@/context/auth';
import { useClinicFilter } from '@/components/coaches/list/useClinicFilter';
import { fetchRecentActivities } from '@/services/dashboard/activity-service';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Mock data function for dashboard stats based on user role
const fetchDashboardStatsForUser = async (user: any): Promise<DashboardStats> => {
  try {
    console.log('Dashboard stats for user:', user?.role, user?.clinicId);
    
    // IMPORTANT: Force strict role detectio  n - use the raw user.role value
    const isClinicAdminUser = user?.role === 'clinic_admin';
    const isSystemAdminUser = user?.role === 'admin' || user?.role === 'super_admin';
    
    console.log('Role detection results:', {
      isClinicAdmin: isClinicAdminUser,
      isSystemAdmin: isSystemAdminUser,
      role: user?.role,
      clinicId: user?.clinicId
    });

    if (isSystemAdminUser) {
      // System admin sees all clinics
      const { data: clinicsData, error: clinicsError } = await supabase
        .from('clinics')
        .select(`
          id,
          name,
          status,
          coaches:coaches(count),
          clients:clients(count)
        `)
        .eq('status', 'active');

      if (clinicsError) throw clinicsError;

      // Get all activities from the last 7 days
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      
      // Get check-ins
      const { data: checkInsData, error: checkInsError } = await supabase
        .from('check_ins')
        .select('id')
        .gte('created_at', oneWeekAgo);

      if (checkInsError) throw checkInsError;

      // Get coach assignments
      const { data: coachAssignmentsData, error: coachAssignmentsError } = await supabase
        .from('coach_assignments')
        .select('id')
        .gte('created_at', oneWeekAgo);

      if (coachAssignmentsError) throw coachAssignmentsError;

      // Get new coaches
      const { data: newCoachesData, error: newCoachesError } = await supabase
        .from('coaches')
        .select('id')
        .gte('created_at', oneWeekAgo);

      if (newCoachesError) throw newCoachesError;

      // Calculate total activities
      const weeklyActivitiesCount = 
        (checkInsData?.length || 0) + 
        (coachAssignmentsData?.length || 0) + 
        (newCoachesData?.length || 0);

      return {
        activeClinicCount: clinicsData?.length || 0,
        totalCoachCount: clinicsData?.reduce((sum, clinic) => sum + (clinic.coaches?.[0]?.count || 0), 0) || 0,
        weeklyActivitiesCount,
        clinicsSummary: clinicsData?.map(clinic => ({
          id: clinic.id,
          name: clinic.name,
          coaches: clinic.coaches?.[0]?.count || 0,
          clients: clinic.clients?.[0]?.count || 0,
          status: clinic.status
        })) || []
      };
    } else if (isClinicAdminUser) {
      // Clinic admin only sees their clinic
      const { data: clinicData, error: clinicError } = await supabase
        .from('clinics')
        .select(`
          id,
          name,
          status,
          coaches:coaches(count),
          clients:clients(count)
        `)
        .eq('id', user?.clinicId)
        .single();
      
      console.log('Clinic data:', clinicData);

      if (clinicError) throw clinicError;

      // Get all activities from the last 7 days for this clinic
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      
      // Get check-ins
      const { data: checkInsData, error: checkInsError } = await supabase
        .from('check_ins')
        .select('id')
        .eq('clinic_id', user?.clinicId)
        .gte('created_at', oneWeekAgo);

      if (checkInsError) throw checkInsError;

      // Get new coaches
      const { data: newCoachesData, error: newCoachesError } = await supabase
        .from('coaches')
        .select('id')
        .eq('clinic_id', user?.clinicId)
        .gte('created_at', oneWeekAgo);

      if (newCoachesError) throw newCoachesError;

      // Calculate total activities
      const weeklyActivitiesCount = 
        (checkInsData?.length || 0) + 
        (newCoachesData?.length || 0);

      return {
        activeClinicCount: 1,
        totalCoachCount: clinicData?.coaches?.[0]?.count || 0,
        weeklyActivitiesCount,
        clinicsSummary: [{
          id: clinicData?.id || user?.clinicId,
          name: clinicData?.name || 'Your Clinic',
          coaches: clinicData?.coaches?.[0]?.count || 0,
          clients: clinicData?.clients?.[0]?.count || 0,
          status: clinicData?.status || 'active'
        }]
      };
    }
    
    // Default empty state
    return {
      activeClinicCount: 0,
      totalCoachCount: 0,
      weeklyActivitiesCount: 0,
      clinicsSummary: []
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    toast.error('Failed to load dashboard statistics');
    return {
      activeClinicCount: 0,
      totalCoachCount: 0,
      weeklyActivitiesCount: 0,
      clinicsSummary: []
    };
  }
};

// Mock data function for activities based on user role
const fetchActivitiesForUser = async (user: any, limit: number = 5): Promise<ActivityItem[]> => {
  // Mock API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // IMPORTANT: Force strict role detection - use the raw user.role value
  const isClinicAdminUser = user?.role === 'clinic_admin';
  const isSystemAdminUser = user?.role === 'admin' || user?.role === 'super_admin';
  
  console.log('Activity data for user role:', user?.role, 'clinic ID:', user?.clinicId);
  
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
  
  if (isSystemAdminUser) {
    return systemAdminActivities.slice(0, limit);
  } else if (isClinicAdminUser) {
    return clinicAdminActivities.slice(0, limit);
  }
  
  return [];
};

// Hook for dashboard stats
export const useDashboardStats = () => {
  const { user } = useAuth();
  const { isClinicAdmin } = useClinicFilter();
  
  // Enhanced logging for debugging
  console.log('useDashboardStats hook - user role:', user?.role);
  console.log('useDashboardStats hook - isClinicAdmin:', isClinicAdmin);
  console.log('useDashboardStats hook - clinicId:', user?.clinicId);
  
  return useQuery({
    queryKey: ['dashboardStats', user?.id, user?.role, user?.clinicId],
    queryFn: () => fetchDashboardStatsForUser(user),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for recent activities
export const useRecentActivities = (limit: number = 5) => {
  const { user } = useAuth();
  const { isClinicAdmin } = useClinicFilter();
  
  // Enhanced logging for debugging
  console.log('useRecentActivities hook - user role:', user?.role);
  console.log('useRecentActivities hook - isClinicAdmin:', isClinicAdmin);
  
  return useQuery({
    queryKey: ['recentActivities', user?.id, user?.role, user?.clinicId, limit],
    queryFn: () => fetchRecentActivities(limit),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
