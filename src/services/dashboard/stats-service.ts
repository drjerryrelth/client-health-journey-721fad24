
import { supabase } from '@/integrations/supabase/client';
import { checkAuthentication } from '@/services/clinics/auth-helper';
import { getCoachCount } from '@/services/coaches/admin-coach-service';
import { DashboardStats } from '@/types/dashboard';
import { toast } from 'sonner';

// Function to fetch dashboard statistics
export async function fetchDashboardStats(): Promise<DashboardStats> {
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
    
    // Make sure clinicsData is an array
    const clinics = Array.isArray(clinicsData) ? clinicsData : [];
    console.log('[DashboardStats] Clinics fetched:', clinics.length || 0);
    
    // Get coach count using our specialized service with direct database access
    let coachCount = 0;
    try {
      coachCount = await getCoachCount();
      console.log('[DashboardStats] Coach count:', coachCount);
    } catch (coachCountError) {
      console.error('[DashboardStats] Error fetching coach count:', coachCountError);
      // We'll continue with coachCount as 0 rather than failing completely
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
      // Continue execution - don't throw here
    }
    
    console.log('[DashboardStats] Activities count:', activitiesCount || 0);
    
    // Fetch clinic summary data with coach and client counts
    const clinicsSummary = [];
    
    if (clinics && clinics.length > 0) {
      for (const clinic of clinics) {
        // Get coach count for this clinic
        const { count: clinicCoachCount, error: clinicCoachError } = await supabase
          .from('coaches')
          .select('id', { count: 'exact', head: true })
          .eq('clinic_id', clinic.id);
          
        if (clinicCoachError) {
          console.error(`[DashboardStats] Error fetching coaches for clinic ${clinic.id}:`, clinicCoachError);
          // Continue to next clinic without throwing
          continue;
        }
        
        // Get client count for this clinic
        const { count: clinicClientCount, error: clinicClientError } = await supabase
          .from('clients')
          .select('id', { count: 'exact', head: true })
          .eq('clinic_id', clinic.id);
          
        if (clinicClientError) {
          console.error(`[DashboardStats] Error fetching clients for clinic ${clinic.id}:`, clinicClientError);
          // Continue to next clinic without throwing
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
    
    console.log('[DashboardStats] Clinics summary prepared:', clinicsSummary);
    
    // Return the complete dashboard stats object
    return {
      activeClinicCount: clinics?.length || 0,
      totalCoachCount: coachCount,
      weeklyActivitiesCount: activitiesCount || 0,
      clinicsSummary
    };
  } catch (error) {
    console.error('[DashboardStats] Error fetching dashboard stats:', error);
    throw error;
  }
}
