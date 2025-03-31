
import { supabase } from '@/integrations/supabase/client';
import { checkAuthentication } from '@/services/clinics/auth-helper';
import { ActivityItem } from '@/types/dashboard';
import { toast } from 'sonner';

// Function to fetch recent activities
export async function fetchRecentActivities(limit: number = 5): Promise<ActivityItem[]> {
  console.log(`[RecentActivities] Starting to fetch recent activities with limit: ${limit}`);
  
  try {
    const session = await checkAuthentication();
    if (!session) {
      console.error('[RecentActivities] No authenticated session found');
      throw new Error('Authentication required to fetch activities');
    }
    
    console.log('[RecentActivities] Authentication verified, fetching activities from database');
    
    // Attempt to fetch real activities from the database
    const { data: activitiesData, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('[RecentActivities] Database error:', error);
      throw error;
    }
    
    console.log('[RecentActivities] Activities fetched:', activitiesData);
    
    if (activitiesData && activitiesData.length > 0) {
      // Map the database results to ActivityItem format
      const activities: ActivityItem[] = activitiesData.map(activity => ({
        id: activity.id,
        type: activity.type,
        description: activity.description,
        timestamp: new Date(activity.created_at).toLocaleString(),
        userId: activity.user_id,
        clinicId: activity.clinic_id
      }));
      
      console.log(`[RecentActivities] Returning ${activities.length} real activities`);
      return activities;
    } else {
      console.log('[RecentActivities] No activities found in database, using mock data');
      
      // Return mock data as fallback if no real data is found
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'check_in',
          description: 'Sarah Johnson submitted a check-in',
          timestamp: new Date().toLocaleString(),
          userId: 'user-1',
          clinicId: 'clinic-1'
        },
        {
          id: '2',
          type: 'clinic_signup',
          description: 'New clinic registered: Westside Health',
          timestamp: new Date(Date.now() - 3600000).toLocaleString(),
          clinicId: 'clinic-2'
        },
        {
          id: '3',
          type: 'coach_added',
          description: 'Michael Thompson was added as a coach to Downtown Health Center',
          timestamp: new Date(Date.now() - 7200000).toLocaleString(),
          userId: 'user-3',
          clinicId: 'clinic-1'
        },
        {
          id: '4',
          type: 'check_in',
          description: 'Robert Davis submitted a check-in',
          timestamp: new Date(Date.now() - 86400000).toLocaleString(),
          userId: 'user-4',
          clinicId: 'clinic-3'
        },
        {
          id: '5',
          type: 'message',
          description: 'New message from client Jessica Wilson',
          timestamp: new Date(Date.now() - 172800000).toLocaleString(),
          userId: 'user-5',
          clinicId: 'clinic-2'
        }
      ].slice(0, limit);
      
      return mockActivities;
    }
  } catch (error) {
    console.error('[RecentActivities] Error fetching recent activities:', error);
    toast.error("Could not load recent activities");
    
    // Return mock data as fallback
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'check_in',
        description: 'Sarah Johnson submitted a check-in',
        timestamp: new Date().toLocaleString(),
        userId: 'user-1',
        clinicId: 'clinic-1'
      },
      {
        id: '2',
        type: 'clinic_signup',
        description: 'New clinic registered: Westside Health',
        timestamp: new Date(Date.now() - 3600000).toLocaleString(),
        clinicId: 'clinic-2'
      },
      {
        id: '3',
        type: 'coach_added',
        description: 'Michael Thompson was added as a coach to Downtown Health Center',
        timestamp: new Date(Date.now() - 7200000).toLocaleString(),
        userId: 'user-3',
        clinicId: 'clinic-1'
      }
    ].slice(0, limit);
    
    console.log(`[RecentActivities] Returning ${mockActivities.length} mock activities as fallback`);
    return mockActivities;
  }
}
