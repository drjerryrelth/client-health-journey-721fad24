
import { useAuth } from '@/context/auth';
import { useEffect } from 'react';

/**
 * Custom hook to filter data based on user role and clinic ID
 * This ensures strict role-based access to data
 */
export function useClinicFilter() {
  const { user } = useAuth();
  
  // Determine if user is a system admin (admin or super_admin)
  const isSystemAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  
  // Determine if user is a clinic admin
  const isClinicAdmin = user?.role === 'clinic_admin';
  
  // Get the user's clinic ID (if any)
  const userClinicId = user?.clinicId;
  
  // Enhanced logging for clinic admins
  useEffect(() => {
    if (isClinicAdmin && userClinicId) {
      console.log('Clinic admin detected in useClinicFilter:', {
        name: user?.name,
        clinicId: userClinicId,
        role: user?.role
      });
    }
  }, [isClinicAdmin, userClinicId, user]);
  
  /**
   * Filter function that can be applied to any data array with clinicId property
   * Will return:
   * - All data for system admins
   * - Only clinic-specific data for clinic admins
   * - Empty array for unauthorized users
   */
  const filterByClinic = <T extends { clinicId: string }>(data: T[]): T[] => {
    // System admins can see all data
    if (isSystemAdmin) {
      console.log('System admin detected, showing all data across clinics');
      return data;
    }
    
    // Clinic admins can only see their clinic's data
    if (isClinicAdmin && userClinicId) {
      console.log(`Clinic admin detected, filtering data to clinic ${userClinicId}`);
      const filteredData = data.filter(item => item.clinicId === userClinicId);
      console.log(`Filtered from ${data.length} items to ${filteredData.length} items`);
      return filteredData;
    }
    
    // For other roles or missing clinic ID, return empty array
    console.log('Neither system admin nor clinic admin with valid clinic ID, returning empty array');
    return [];
  };
  
  return {
    isSystemAdmin,
    isClinicAdmin,
    userClinicId,
    filterByClinic
  };
}
