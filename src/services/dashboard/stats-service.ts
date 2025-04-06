import { supabase } from '@/integrations/supabase/client';
import { checkAuthentication } from '@/services/clinics/auth-helper';
import { DashboardStats } from '@/types/dashboard';
import { toast } from 'sonner';
import { getCoachCount } from '@/services/coaches/admin-coach-service';
import { CoachService } from '@/services/coaches';
import { isDemoAdminEmail, isDemoClinicAdminEmail } from '@/services/auth/demo/utils';

// Function to fetch dashboard statistics with role-based security filtering
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
    
    // PRIORITY 1: Check if this is a demo admin first (highest priority check)
    const userEmail = session.user.email;
    if (userEmail && isDemoAdminEmail(userEmail)) {
      console.log('[DashboardStats] Demo admin email detected, fetching system-wide statistics');
      return await fetchSystemAdminStats();
    }
    
    // PRIORITY 1.5: Check if this is a demo clinic admin
    if (userEmail && isDemoClinicAdminEmail(userEmail)) {
      console.log('[DashboardStats] Demo clinic admin email detected, fetching clinic-specific statistics');
      const clinicId = process.env.DEMO_CLINIC_ID || '65196bd4-f754-4c4e-9649-2bf478016701';
      return await fetchClinicAdminStats(clinicId);
    }
    
    // PRIORITY 2: Get the user's role and clinicId for permission checks
    const { data: userData } = await supabase
      .from('profiles')
      .select('role, clinic_id, email')
      .eq('id', session.user.id)
      .single();
    
    const userRole = userData?.role;
    const userClinicId = userData?.clinic_id;
    
    console.log('[DashboardStats] User role:', userRole, 'clinicId:', userClinicId, 'email:', userEmail);
    
    // PRIORITY 3: Different logic based on user role
    if (userRole === 'admin' || userRole === 'super_admin') {
      // SYSTEM ADMIN: Fetch all clinics data
      console.log('[DashboardStats] System admin detected, fetching global statistics');
      return await fetchSystemAdminStats();
    } 
    else if (userRole === 'clinic_admin' && userClinicId) {
      // CLINIC ADMIN: Only fetch data for their specific clinic
      console.log('[DashboardStats] Clinic admin detected, fetching limited statistics for clinic:', userClinicId);
      return await fetchClinicAdminStats(userClinicId);
    } 
    else {
      // PRIORITY 4: Final fallback for demo users
      if (userEmail && isDemoAdminEmail(userEmail)) {
        console.log('[DashboardStats] Fallback to demo admin detection, fetching system-wide statistics');
        return await fetchSystemAdminStats();
      }
      
      if (userEmail && isDemoClinicAdminEmail(userEmail)) {
        console.log('[DashboardStats] Fallback to demo clinic admin detection, fetching clinic-specific statistics');
        const clinicId = process.env.DEMO_CLINIC_ID || '65196bd4-f754-4c4e-9649-2bf478016701';
        return await fetchClinicAdminStats(clinicId);
      }
      
      // Invalid or unauthorized role
      console.error('[DashboardStats] User does not have valid role for dashboard access:', userRole);
      throw new Error('Unauthorized access to dashboard statistics');
    }
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

// Helper function to fetch clinic admin stats
async function fetchClinicAdminStats(clinicId: string): Promise<DashboardStats> {
  // Get this specific clinic data
  const { data: clinicData, error: clinicError } = await supabase
    .from('clinics')
    .select('id, name, status')
    .eq('id', clinicId)
    .eq('status', 'active')
    .single();
    
  if (clinicError) {
    console.error('[DashboardStats] Error fetching clinic:', clinicError);
    toast.error('Error fetching clinic: ' + clinicError.message);
    return {
      activeClinicCount: 0,
      totalCoachCount: 0,
      weeklyActivitiesCount: 0,
      clinicsSummary: []
    };
  }
  
  // Get coach count for this specific clinic
  const clinicCoaches = await CoachService.getClinicCoaches(clinicId);
  const coachCount = clinicCoaches ? clinicCoaches.length : 0;
  
  // Get weekly activity count for this clinic only
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  // Count check-ins for this clinic's clients
  const { data: clinicClients } = await supabase
    .from('clients')
    .select('id')
    .eq('clinic_id', clinicId);
    
  const clientIds = clinicClients ? clinicClients.map(client => client.id) : [];
  
  let activitiesCount = 0;
  if (clientIds.length > 0) {
    const { count: checkInsCount } = await supabase
      .from('check_ins')
      .select('*', { count: 'exact', head: true })
      .in('client_id', clientIds)
      .gte('created_at', oneWeekAgo.toISOString());
      
    activitiesCount = checkInsCount || 0;
  }
  
  // Get client count for this clinic
  const { count: clientsCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('clinic_id', clinicId);
  
  // Return clinic-specific dashboard stats
  return {
    activeClinicCount: 1, // Just this clinic
    totalCoachCount: coachCount,
    weeklyActivitiesCount: activitiesCount,
    clinicsSummary: [{
      id: clinicData.id,
      name: clinicData.name,
      coaches: coachCount,
      clients: clientsCount || 0,
      status: clinicData.status
    }]
  };
}

// Helper function to fetch system admin stats
async function fetchSystemAdminStats(): Promise<DashboardStats> {
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
  
  // Get total coach count
  let coachCount = 0;
  try {
    coachCount = await getCoachCount();
    console.log('[DashboardStats] Coach count from admin service:', coachCount);
  } catch (countErr) {
    console.error('[DashboardStats] Error counting coaches with admin service:', countErr);
    // Alternative approach to count coaches if the service fails
    try {
      const { count } = await supabase
        .from('coaches')
        .select('*', { count: 'exact', head: true });
      coachCount = count || 0;
    } catch (fallbackErr) {
      console.error('[DashboardStats] Fallback coach count failed:', fallbackErr);
    }
  }
  
  // Count weekly activities across all clinics
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
  
  // Prepare clinic summary data - limited to 5 clinics for dashboard display
  let clinicsSummary = [];
  
  if (clinics.length > 0) {
    // Get additional info for each clinic (limited to first 5)
    const clinicPromises = clinics.slice(0, 5).map(async (clinic) => {
      try {
        // Get coach count for this clinic
        const clinicCoaches = await CoachService.getClinicCoaches(clinic.id);
        const coachesCount = clinicCoaches ? clinicCoaches.length : 0;
          
        // Get client count for this clinic
        const { count: clientsCount } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true })
          .eq('clinic_id', clinic.id);
          
        return {
          id: clinic.id,
          name: clinic.name,
          coaches: coachesCount,
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
    } catch (summaryError) {
      console.error('[DashboardStats] Error building clinics summary:', summaryError);
      clinicsSummary = [];
    }
  }
  
  // Return full system-wide stats for admin
  return {
    activeClinicCount: clinics.length || 0,
    totalCoachCount: coachCount,
    weeklyActivitiesCount: activitiesCount,
    clinicsSummary
  };
}
