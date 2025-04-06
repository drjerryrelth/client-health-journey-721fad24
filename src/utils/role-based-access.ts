
import { UserData } from '@/types/auth';

/**
 * Utility for role-based access control and data filtering
 * This ensures strict separation between system admins and clinic admins
 */

/**
 * Check if the user is a system admin (admin or super_admin)
 */
export const isSystemAdmin = (user?: UserData | null): boolean => {
  if (!user) return false;
  return user.role === 'admin' || user.role === 'super_admin';
};

/**
 * Check if the user is a clinic admin
 */
export const isClinicAdmin = (user?: UserData | null): boolean => {
  if (!user) return false;
  return user.role === 'clinic_admin';
};

/**
 * Get the clinic ID that the user has access to, if any
 * For clinic admins, this is their assigned clinic
 * For system admins, this is null (they can access all clinics)
 * For other roles, this depends on context
 */
export const getUserClinicId = (user?: UserData | null): string | null => {
  if (!user) return null;
  
  // Only clinic admins, coaches, and clients have a specific clinic ID
  if (user.role === 'clinic_admin' || user.role === 'coach' || user.role === 'client') {
    return user.clinicId || null;
  }
  
  return null;
};

/**
 * Filter data by clinic ID based on user role
 * - System admins see all data
 * - Clinic admins only see data for their clinic
 * - Other roles see filtered data based on specific permissions
 */
export function filterDataByClinic<T extends { clinicId: string }>(
  data: T[], 
  user?: UserData | null
): T[] {
  if (!user) return [];
  
  // System admins can see all data
  if (isSystemAdmin(user)) {
    console.log('System admin detected, showing all clinic data');
    return data;
  }
  
  // Clinic admins can only see their clinic's data
  if (isClinicAdmin(user)) {
    const userClinicId = getUserClinicId(user);
    console.log(`Clinic admin detected, filtering data to clinic ${userClinicId}`);
    
    if (!userClinicId) {
      console.warn('Clinic admin has no clinic ID assigned, returning empty dataset');
      return [];
    }
    
    return data.filter(item => item.clinicId === userClinicId);
  }
  
  // Default: empty array for unknown roles
  console.log('User is neither system admin nor clinic admin, returning empty dataset');
  return [];
}
