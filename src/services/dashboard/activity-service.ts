
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
        // We'll continue processing other activity types
      } else if (checkInsData && checkInsData.length > 0) {
        for (const checkIn of checkInsData) {
          try {
            // Get client name
            const { data: clientData, error: clientError } = await supabase
              .from('clients')
              .select('name, clinic_id')
              .eq('id', checkIn.client_id)
              .maybeSingle();
              
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
          } catch (clientFetchError) {
            console.error(`[RecentActivities] Unexpected error with check-in ${checkIn.id}:`, clientFetchError);
          }
        }
      }
    } catch (checkInsProcessError) {
      console.error('[RecentActivities] Error processing check-ins:', checkInsProcessError);
    }
    
    // Fetch recent coaches added as activities
    try {
      const { data: coachesData, error: coachesError } = await supabase
        .from('coaches')
        .select('id, name, clinic_id, created_at')
        .order('created_at', { ascending: false })
        .limit(Math.floor(limit / 2));  // Use half of the limit for coaches
        
      if (coachesError) {
        console.error('[RecentActivities] Error fetching coaches:', coachesError);
      } else if (coachesData && coachesData.length > 0) {
        for (const coach of coachesData) {
          try {
            // Get clinic name
            const { data: clinicData, error: clinicError } = await supabase
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
    // Instead of throwing and causing the entire request to fail,
    // we'll return an empty array with a warning
    toast.error("Could not load recent activities");
    return [];
  }
}
