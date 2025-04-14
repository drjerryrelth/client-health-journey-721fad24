import { supabase } from '@/integrations/supabase/client';
import { checkAuthentication } from '@/services/clinics/auth-helper';
import { ActivityItem } from '@/types/dashboard';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth';

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
    
    // Get user data from session
    const { data: { user } } = await supabase.auth.getUser();
    const isClinicAdmin = user?.user_metadata?.role === 'clinic_admin';
    const clinicId = user?.user_metadata?.clinic_id;
    
    console.log('[RecentActivities] User role:', user?.user_metadata?.role, 'Clinic ID:', clinicId);
    
    // Create an array to store our activities from multiple sources
    const activities: ActivityItem[] = [];
    
    // 1. Get recent check-ins as activities
    try {
      let checkInsQuery = supabase
        .from('check_ins')
        .select('id, created_at, client_id, clients(name, clinic_id)')
        .order('created_at', { ascending: false })
        .limit(limit);

      // If clinic admin, only show check-ins from their clinic
      if (isClinicAdmin && clinicId) {
        checkInsQuery = checkInsQuery.eq('clients.clinic_id', clinicId);
      }

      const { data: checkInsData, error: checkInsError } = await checkInsQuery;
        
      if (!checkInsError && checkInsData) {
        for (const checkIn of checkInsData) {
          // Handle clients data safely - it might be an object, not an array
          const clientName = typeof checkIn.clients === 'object' ? 
            (checkIn.clients as { name?: string })?.name || 'A client' : 
            'A client';
            
          activities.push({
            id: checkIn.id,
            type: 'check_in',
            description: `${clientName} submitted a check-in`,
            timestamp: new Date(checkIn.created_at).toLocaleString(),
            userId: checkIn.client_id,
            clinicId: (checkIn.clients as { clinic_id?: string })?.clinic_id
          });
        }
        console.log(`[RecentActivities] Added ${checkInsData.length} check-ins as activities`);
      } else if (checkInsError) {
        console.error('[RecentActivities] Error fetching check-ins:', checkInsError);
      }
    } catch (error) {
      console.error('[RecentActivities] Error processing check-ins:', error);
    }
    
    // 2. Get clinics as activities (only for system admins)
    if (!isClinicAdmin) {
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
        } else if (clinicsError) {
          console.error('[RecentActivities] Error fetching clinics:', clinicsError);
        }
      } catch (error) {
        console.error('[RecentActivities] Error processing clinics:', error);
      }
    }
    
    // 3. Get coaches as activities
    try {
      let coachesQuery = supabase
        .from('coaches')
        .select('id, name, created_at, clinic_id, clinics(name)')
        .order('created_at', { ascending: false })
        .limit(limit);

      // If clinic admin, only show coaches from their clinic
      if (isClinicAdmin && clinicId) {
        coachesQuery = coachesQuery.eq('clinic_id', clinicId);
      }

      const { data: coachesData, error: coachesError } = await coachesQuery;
        
      if (!coachesError && coachesData) {
        for (const coach of coachesData) {
          // Handle clinics data safely - it might be an object, not an array
          const clinicName = typeof coach.clinics === 'object' ? 
            (coach.clinics as { name?: string })?.name || 'a clinic' : 
            'a clinic';
            
          activities.push({
            id: coach.id,
            type: 'coach_added',
            description: `New coach added: ${coach.name} to ${clinicName}`,
            timestamp: new Date(coach.created_at).toLocaleString(),
            clinicId: coach.clinic_id
          });
        }
        console.log(`[RecentActivities] Added ${coachesData.length} coaches as activities`);
      } else if (coachesError) {
        console.error('[RecentActivities] Error fetching coaches:', coachesError);
      }
    } catch (error) {
      console.error('[RecentActivities] Error processing coaches:', error);
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
