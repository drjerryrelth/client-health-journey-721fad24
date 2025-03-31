
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
    
    console.log('[RecentActivities] Authentication verified, using mock data');
    
    // Return consistent mock data until database issues are resolved
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
    ];
    
    // Limit to the requested number and return
    const limitedActivities = mockActivities.slice(0, limit);
    console.log(`[RecentActivities] Returning ${limitedActivities.length} mock activities`);
    return limitedActivities;
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
