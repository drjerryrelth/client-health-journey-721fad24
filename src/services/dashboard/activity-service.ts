
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
    
    console.log('[RecentActivities] Authentication verified, fetching data');
    
    // For now, return mock data until database issues are resolved
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
    
    /* Commenting out real implementation until database issues are fixed
    const activities: ActivityItem[] = [];
    
    // Fetch recent check-ins as activities
    try {
      const { data: checkInsData, error: checkInsError } = await supabase
        .from('check_ins')
        .select('id, client_id, created_at')
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (checkInsError) {
        console.error('[RecentActivities] Error fetching check-ins:', checkInsError);
      } else if (checkInsData && checkInsData.length > 0) {
        for (const checkIn of checkInsData) {
          try {
            // Get client name
            const { data: clientData } = await supabase
              .from('clients')
              .select('name, clinic_id')
              .eq('id', checkIn.client_id)
              .maybeSingle();
              
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
          } catch (clientFetchError) {
            console.error(`[RecentActivities] Error with check-in ${checkIn.id}:`, clientFetchError);
            // Continue with next check-in
          }
        }
      }
    } catch (checkInsProcessError) {
      console.error('[RecentActivities] Error processing check-ins:', checkInsProcessError);
    }
    
    // If we couldn't get check-ins, try to get coach activities as fallback
    if (activities.length === 0) {
      try {
        const { data: coachesData, error: coachesError } = await supabase
          .from('coaches')
          .select('id, name, clinic_id, created_at')
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (!coachesError && coachesData && coachesData.length > 0) {
          for (const coach of coachesData) {
            try {
              // Get clinic name
              const { data: clinicData } = await supabase
                .from('clinics')
                .select('name')
                .eq('id', coach.clinic_id)
                .maybeSingle();
                
              const timestamp = new Date(coach.created_at);
              
              activities.push({
                id: coach.id,
                type: 'coach_added',
                description: `${coach.name} was added as a coach${clinicData ? ` to ${clinicData.name}` : ''}`,
                timestamp: timestamp.toLocaleString(),
                clinicId: coach.clinic_id
              });
            } catch (clinicFetchError) {
              console.error(`[RecentActivities] Error fetching clinic for coach ${coach.id}:`, clinicFetchError);
              
              // Still add the activity, just without the clinic name
              const timestamp = new Date(coach.created_at);
              activities.push({
                id: coach.id,
                type: 'coach_added',
                description: `${coach.name} was added as a coach`,
                timestamp: timestamp.toLocaleString(),
                clinicId: coach.clinic_id
              });
            }
          }
        }
      } catch (coachesProcessError) {
        console.error('[RecentActivities] Error processing coaches:', coachesProcessError);
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
    */
    
  } catch (error) {
    console.error('[RecentActivities] Error fetching recent activities:', error);
    toast.error("Could not load recent activities");
    
    // Return mock data instead of empty array
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
