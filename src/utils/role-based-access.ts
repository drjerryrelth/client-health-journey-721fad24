import { UserData } from '@/types/auth';
import { UserRole } from '@/types';

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

/**
 * Role-based access control utilities
 */

// Role hierarchy (higher roles have access to lower roles' resources)
const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 5,
  admin: 4,
  clinic_admin: 3,
  coach: 2,
  client: 1
};

/**
 * Check if a user has a specific role or higher
 */
export const hasRoleOrHigher = (user: UserData | null, requiredRole: UserRole): boolean => {
  if (!user) return false;
  return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[requiredRole];
};

/**
 * Check if a user has access to a specific clinic's resources
 */
export const hasClinicAccess = (user: UserData | null, clinicId: string): boolean => {
  if (!user) return false;
  
  // System admins have access to all clinics
  if (user.role === 'super_admin' || user.role === 'admin') {
    return true;
  }
  
  // Clinic admins, coaches, and clients only have access to their clinic
  return user.clinicId === clinicId;
};

/**
 * Filter data by clinic access
 */
export const filterByClinicAccess = <T extends { clinicId: string }>(
  data: T[],
  user: UserData | null
): T[] => {
  if (!user) return [];
  
  // System admins see all data
  if (user.role === 'super_admin' || user.role === 'admin') {
    return data;
  }
  
  // Others only see their clinic's data
  return data.filter(item => item.clinicId === user.clinicId);
};

/**
 * Check if a user can access program templates
 */
export const canAccessProgramTemplates = (user: UserData | null): boolean => {
  if (!user) return false;
  
  // System admins and clinic admins can access templates
  return user.role === 'super_admin' || 
         user.role === 'admin' || 
         user.role === 'clinic_admin';
};

/**
 * Check if a user can manage a specific resource
 */
export const canManageResource = (
  user: UserData | null,
  resource: { clinicId?: string; createdBy?: string }
): boolean => {
  if (!user) return false;
  
  // System admins can manage everything
  if (user.role === 'super_admin' || user.role === 'admin') {
    return true;
  }
  
  // Clinic admins can manage their clinic's resources
  if (user.role === 'clinic_admin' && resource.clinicId === user.clinicId) {
    return true;
  }
  
  // Coaches can manage resources they created
  if (user.role === 'coach' && resource.createdBy === user.id) {
    return true;
  }
  
  return false;
};

/**
 * Get the highest role a user can assign to others
 */
export const getMaxAssignableRole = (user: UserData | null): UserRole | null => {
  if (!user) return null;
  
  switch (user.role) {
    case 'super_admin':
      return 'admin';
    case 'admin':
      return 'clinic_admin';
    case 'clinic_admin':
      return 'coach';
    case 'coach':
      return 'client';
    default:
      return null;
  }
};
