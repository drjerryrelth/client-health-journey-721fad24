
import { supabase } from '@/integrations/supabase/client';
import { checkAuthentication } from '@/services/clinics/auth-helper';
import { ActivityItem } from '@/types/dashboard';
import { toast } from 'sonner';

export async function fetchRecentActivities(limit: number = 10): Promise<ActivityItem[]> {
  try {
    // Verify authentication first
    const session = await checkAuthentication();
    if (!session) {
      console.error('[ActivityService] No authenticated session found');
      throw new Error('Authentication required to fetch activities');
    }
    
    // Get the user's role and clinicId for permission checks
    const { data: userData } = await supabase
      .from('profiles')
      .select('role, clinic_id')
      .eq('id', session.user.id)
      .single();
    
    const userRole = userData?.role;
    const userClinicId = userData?.clinic_id;
    
    console.log('[ActivityService] User role:', userRole, 'clinicId:', userClinicId);
    
    // Different query based on user role
    let query = supabase.from('activities').select('*');
    
    // Clinic admins should only see their clinic's activities
    if (userRole === 'clinic_admin' && userClinicId) {
      query = query.eq('clinic_id', userClinicId);
    }
    
    // Order by newest first and limit results
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      throw error;
    }
    
    // If no activities found, return empty array
    if (!data || data.length === 0) {
      return [];
    }
    
    // Format activities for display
    return data.map(activity => ({
      id: activity.id,
      type: activity.type || 'general',
      description: activity.description || 'Activity logged',
      timestamp: new Date(activity.created_at).toLocaleString(),
      userId: activity.user_id,
      clinicId: activity.clinic_id
    }));
  } catch (error) {
    console.error('[ActivityService] Error fetching activities:', error);
    
    // Only show toast for non-empty state errors
    if (error instanceof Error && error.message !== 'No activities found') {
      toast.error('Failed to load activities');
    }
    
    return [];
  }
}
