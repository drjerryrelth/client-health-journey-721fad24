
import { supabase } from '@/integrations/supabase/client';
import { checkAuthentication } from '@/services/clinics/auth-helper';
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
      toast.error('Error fetching clinics: ' + clinicsError.message);
      return {
        activeClinicCount: 0,
        totalCoachCount: 0,
        weeklyActivitiesCount: 0,
        clinicsSummary: []
      };
    }
    
    // Make sure clinicsData is an array
    const clinics = Array.isArray(clinicsData) ? clinicsData : [];
    console.log('[DashboardStats] Clinics fetched:', clinics.length || 0);
    
    // Get coach count from the coaches table
    let coachCount = 0;
    try {
      const { count, error: countError } = await supabase
        .from('coaches')
        .select('*', { count: 'exact', head: true });
        
      if (!countError) {
        coachCount = count || 0;
      } else {
        console.error('[DashboardStats] Error fetching coach count:', countError);
      }
    } catch (countErr) {
      console.error('[DashboardStats] Error counting coaches:', countErr);
    }
    
    console.log('[DashboardStats] Coach count:', coachCount);
    
    // For weekly activities count, count recent check-ins
    let activitiesCount = 0;
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const { count, error: checkInsError } = await supabase
        .from('check_ins')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneWeekAgo.toISOString());
        
      if (!checkInsError) {
        activitiesCount = count || 0;
        console.log('[DashboardStats] Real check-ins count for last week:', activitiesCount);
      } else {
        console.error('[DashboardStats] Error counting check-ins:', checkInsError);
      }
      
      // Add clinic creations from the last week
      const { count: clinicsCreatedCount, error: clinicsCreatedError } = await supabase
        .from('clinics')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneWeekAgo.toISOString());
        
      if (!clinicsCreatedError) {
        activitiesCount += clinicsCreatedCount || 0;
        console.log('[DashboardStats] Added clinic creations for last week:', clinicsCreatedCount || 0);
      }
      
    } catch (err) {
      console.error('[DashboardStats] Error with activities count:', err);
    }
    
    // Prepare clinic summary data
    let clinicsSummary = [];
    
    if (clinics.length > 0) {
      // If we have real clinic data, fetch additional info for each
      const clinicPromises = clinics.slice(0, 5).map(async (clinic) => {
        try {
          // Get coach count for this clinic
          const { count: coachesCount } = await supabase
            .from('coaches')
            .select('*', { count: 'exact', head: true })
            .eq('clinic_id', clinic.id);
            
          // Get client count for this clinic
          const { count: clientsCount } = await supabase
            .from('clients')
            .select('*', { count: 'exact', head: true })
            .eq('clinic_id', clinic.id);
            
          return {
            id: clinic.id,
            name: clinic.name,
            coaches: coachesCount || 0,
            clients: clientsCount || 0,
            status: clinic.status
          };
        } catch (error) {
          console.error(`[DashboardStats] Error getting counts for clinic ${clinic.id}:`, error);
          return {
            id: clinic.id,
            name: clinic.name,
            coaches: 0,
            clients: 0,
            status: clinic.status
          };
        }
      });
      
      try {
        clinicsSummary = await Promise.all(clinicPromises);
        console.log('[DashboardStats] Built real clinics summary data:', clinicsSummary);
      } catch (summaryError) {
        console.error('[DashboardStats] Error building clinics summary:', summaryError);
        clinicsSummary = [];
      }
    }
    
    // Return the complete dashboard stats object with real data
    return {
      activeClinicCount: clinics.length || 0,
      totalCoachCount: coachCount,
      weeklyActivitiesCount: activitiesCount,
      clinicsSummary
    };
  } catch (error) {
    console.error('[DashboardStats] Error fetching dashboard stats:', error);
    toast.error("Failed to load dashboard statistics");
    
    // Return empty data structure
    return {
      activeClinicCount: 0,
      totalCoachCount: 0,
      weeklyActivitiesCount: 0,
      clinicsSummary: []
    };
  }
}
