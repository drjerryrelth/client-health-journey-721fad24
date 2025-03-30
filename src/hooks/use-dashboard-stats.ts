
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { checkAuthentication } from '@/services/clinics/auth-helper';
import { toast } from 'sonner';
import { getCoachCount } from '@/services/coaches/admin-coach-service';

// Types for the dashboard statistics
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

// Types for activity items
export interface ActivityItem {
  id: string;
  type: 'check_in' | 'clinic_signup' | 'coach_added' | 'message' | string;
  description: string;
  timestamp: string;
  userId?: string;
  clinicId?: string;
}

// Function to fetch dashboard statistics
async function fetchDashboardStats(): Promise<DashboardStats> {
  console.log('[DashboardStats] Starting to fetch dashboard stats');
  
  try {
    // Verify authentication first
    const session = await checkAuthentication();
    if (!session) {
      console.error('[DashboardStats] No authenticated session found');
      throw new Error('Authentication required to fetch dashboard statistics');
    }
    
    console.log('[DashboardStats] Authentication verified, fetching data');
    
    // Fetch active clinics count and data
    const { data: clinicsData, error: clinicsError } = await supabase
      .from('clinics')
      .select('id, name, status')
      .eq('status', 'active');
      
    if (clinicsError) {
      console.error('[DashboardStats] Error fetching clinics:', clinicsError);
      throw clinicsError;
    }
    
    console.log('[DashboardStats] Clinics fetched:', clinicsData?.length || 0);
    
    // Get coach count using our specialized service with direct database access
    let coachCount = 0;
    try {
      coachCount = await getCoachCount();
      console.log('[DashboardStats] Coach count:', coachCount);
    } catch (coachCountError) {
      console.error('[DashboardStats] Error fetching coach count:', coachCountError);
      // Continue execution - don't throw here to allow other stats to load
    }
    
    // Calculate the date 7 days ago
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastWeekString = lastWeek.toISOString();
    
    // Fetch weekly activities count (check-ins from the last 7 days)
    const { count: activitiesCount, error: activitiesError } = await supabase
      .from('check_ins')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', lastWeekString);
      
    if (activitiesError) {
      console.error('[DashboardStats] Error fetching activities count:', activitiesError);
      // Continue execution - don't throw
    }
    
    console.log('[DashboardStats] Activities count:', activitiesCount || 0);
    
    // Fetch clinic summary data with coach and client counts
    const clinicsSummary = [];
    
    if (clinicsData && clinicsData.length > 0) {
      for (const clinic of clinicsData) {
        // Get coach count for this clinic
        const { count: clinicCoachCount, error: clinicCoachError } = await supabase
          .from('coaches')
          .select('id', { count: 'exact', head: true })
          .eq('clinic_id', clinic.id);
          
        if (clinicCoachError) {
          console.error(`[DashboardStats] Error fetching coaches for clinic ${clinic.id}:`, clinicCoachError);
          // Continue to next clinic
          continue;
        }
        
        // Get client count for this clinic
        const { count: clinicClientCount, error: clinicClientError } = await supabase
          .from('clients')
          .select('id', { count: 'exact', head: true })
          .eq('clinic_id', clinic.id);
          
        if (clinicClientError) {
          console.error(`[DashboardStats] Error fetching clients for clinic ${clinic.id}:`, clinicClientError);
          // Continue to next clinic
          continue;
        }
        
        clinicsSummary.push({
          id: clinic.id,
          name: clinic.name,
          coaches: clinicCoachCount || 0,
          clients: clinicClientCount || 0,
          status: clinic.status
        });
      }
    }
    
    console.log('[DashboardStats] Clinics summary:', clinicsSummary);
    
    return {
      activeClinicCount: clinicsData?.length || 0,
      totalCoachCount: coachCount,
      weeklyActivitiesCount: activitiesCount || 0,
      clinicsSummary
    };
  } catch (error) {
    console.error('[DashboardStats] Error fetching dashboard stats:', error);
    throw error;
  }
}

// Function to fetch recent activities
async function fetchRecentActivities(limit: number = 5): Promise<ActivityItem[]> {
  console.log(`[RecentActivities] Starting to fetch recent activities with limit: ${limit}`);
  
  try {
    const session = await checkAuthentication();
    if (!session) {
      console.error('[RecentActivities] No authenticated session found');
      throw new Error('Authentication required to fetch activities');
    }
    
    console.log('[RecentActivities] Authentication verified, fetching data');
    
    // Fetch recent check-ins as activities
    const { data: checkInsData, error: checkInsError } = await supabase
      .from('check_ins')
      .select('id, client_id, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (checkInsError) {
      console.error('[RecentActivities] Error fetching check-ins:', checkInsError);
      throw checkInsError;
    }
    
    // Fetch client names for the check-ins
    const activities: ActivityItem[] = [];
    
    if (checkInsData && checkInsData.length > 0) {
      for (const checkIn of checkInsData) {
        // Get client name
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('name, clinic_id')
          .eq('id', checkIn.client_id)
          .single();
          
        if (clientError) {
          console.error(`[RecentActivities] Error fetching client for check-in ${checkIn.id}:`, clientError);
          continue;
        }
        
        if (clientData) {
          const timestamp = new Date(checkIn.created_at);
          
          activities.push({
            id: checkIn.id,
            type: 'check_in',
            description: `${clientData.name} submitted a check-in`,
            timestamp: timestamp.toLocaleString(),
            clinicId: clientData.clinic_id
          });
        }
      }
    }
    
    // Fetch recent coaches added as activities
    const { data: coachesData, error: coachesError } = await supabase
      .from('coaches')
      .select('id, name, clinic_id, created_at')
      .order('created_at', { ascending: false })
      .limit(Math.floor(limit / 2));  // Use half of the limit for coaches
      
    if (coachesError) {
      console.error('[RecentActivities] Error fetching coaches:', coachesError);
    } else if (coachesData) {
      for (const coach of coachesData) {
        // Get clinic name
        const { data: clinicData, error: clinicError } = await supabase
          .from('clinics')
          .select('name')
          .eq('id', coach.clinic_id)
          .single();
          
        const timestamp = new Date(coach.created_at);
        
        activities.push({
          id: coach.id,
          type: 'coach_added',
          description: `${coach.name} was added as a coach${clinicData ? ` to ${clinicData.name}` : ''}`,
          timestamp: timestamp.toLocaleString(),
          clinicId: coach.clinic_id
        });
      }
    }
    
    // Sort all activities by timestamp (newest first)
    activities.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    
    // Limit to the requested number
    const limitedActivities = activities.slice(0, limit);
    console.log(`[RecentActivities] Returning ${limitedActivities.length} activities`);
    return limitedActivities;
    
  } catch (error) {
    console.error('[RecentActivities] Error fetching recent activities:', error);
    throw error;
  }
}

// Hook to use dashboard stats
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3 // Increase retries
  });
}

// Hook to use recent activities
export function useRecentActivities(limit: number = 5) {
  return useQuery({
    queryKey: ['recent-activities', limit],
    queryFn: () => fetchRecentActivities(limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 3 // Increase retries
  });
}
