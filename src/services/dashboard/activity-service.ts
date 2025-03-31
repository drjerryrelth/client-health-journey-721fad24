
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
    
    console.log('[RecentActivities] Authentication verified');
    
    // Create an array to store our activities from multiple sources
    const activities: ActivityItem[] = [];
    
    // 1. Get recent check-ins as activities
    try {
      const { data: checkInsData, error: checkInsError } = await supabase
        .from('check_ins')
        .select('id, created_at, client_id, clients(name)')
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (!checkInsError && checkInsData) {
        for (const checkIn of checkInsData) {
          activities.push({
            id: checkIn.id,
            type: 'check_in',
            description: `${checkIn.clients?.name || 'A client'} submitted a check-in`,
            timestamp: new Date(checkIn.created_at).toLocaleString(),
            userId: checkIn.client_id
          });
        }
        console.log(`[RecentActivities] Added ${checkInsData.length} check-ins as activities`);
      } else {
        console.error('[RecentActivities] Error fetching check-ins:', checkInsError);
      }
    } catch (error) {
      console.error('[RecentActivities] Error processing check-ins:', error);
    }
    
    // 2. Get recently added coaches as activities
    try {
      const { data: coachesData, error: coachesError } = await supabase
        .from('coaches')
        .select('id, name, created_at, clinic_id, clinics(name)')
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (!coachesError && coachesData) {
        for (const coach of coachesData) {
          activities.push({
            id: coach.id,
            type: 'coach_added',
            description: `${coach.name} was added as a coach to ${coach.clinics?.name || 'a clinic'}`,
            timestamp: new Date(coach.created_at).toLocaleString(),
            clinicId: coach.clinic_id
          });
        }
        console.log(`[RecentActivities] Added ${coachesData.length} coaches as activities`);
      } else {
        console.error('[RecentActivities] Error fetching coaches:', coachesError);
      }
    } catch (error) {
      console.error('[RecentActivities] Error processing coaches:', error);
    }
    
    // 3. Get recently created clinics as activities
    try {
      const { data: clinicsData, error: clinicsError } = await supabase
        .from('clinics')
        .select('id, name, created_at')
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (!clinicsError && clinicsData) {
        for (const clinic of clinicsData) {
          activities.push({
            id: clinic.id,
            type: 'clinic_signup',
            description: `New clinic registered: ${clinic.name}`,
            timestamp: new Date(clinic.created_at).toLocaleString(),
            clinicId: clinic.id
          });
        }
        console.log(`[RecentActivities] Added ${clinicsData.length} clinics as activities`);
      } else {
        console.error('[RecentActivities] Error fetching clinics:', clinicsError);
      }
    } catch (error) {
      console.error('[RecentActivities] Error processing clinics:', error);
    }
    
    // Sort all activities by timestamp (newest first)
    activities.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return dateB.getTime() - dateA.getTime();
    });
    
    // Return activities (limited to requested amount)
    const limitedActivities = activities.slice(0, limit);
    console.log(`[RecentActivities] Returning ${limitedActivities.length} activities`);
    
    return limitedActivities;
  } catch (error) {
    console.error('[RecentActivities] Error fetching recent activities:', error);
    toast.error("Could not load recent activities");
    return [];
  }
}
