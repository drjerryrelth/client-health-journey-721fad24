
import { useState, useEffect, useCallback } from 'react';
import { CoachService } from '@/services/coaches';
import ClinicService from '@/services/clinic-service';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth';

export interface CoachWithClinic {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: 'active' | 'inactive';
  clinicId: string;
  clinic_id?: string; // Add this to match Coach type
  clinicName: string;
  clients: number;
}

export function useAdminCoaches() {
  const [coaches, setCoaches] = useState<any[]>([]);
  const [clinics, setClinics] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { user } = useAuth();

  const fetchClinics = useCallback(async () => {
    try {
      // Only system admins should fetch all clinics
      if (user?.role === 'admin' || user?.role === 'super_admin') {
        const allClinics = await ClinicService.getClinics();
        const clinicMap: Record<string, string> = {};
        allClinics.forEach(clinic => {
          clinicMap[clinic.id] = clinic.name;
        });
        setClinics(clinicMap);
        console.log('[useAdminCoaches] Clinic map created for system admin:', clinicMap);
      } 
      // Clinic admins should only know about their own clinic
      else if (user?.role === 'clinic_admin' && user?.clinicId) {
        const singleClinic = await ClinicService.getClinic(user.clinicId);
        const clinicMap: Record<string, string> = {};
        if (singleClinic) {
          clinicMap[singleClinic.id] = singleClinic.name;
          setClinics(clinicMap);
          console.log('[useAdminCoaches] Single clinic map created for clinic admin:', clinicMap);
          console.log('[useAdminCoaches] Clinic admin details:', {
            name: user.name,
            clinicId: user.clinicId
          });
        }
      }
    } catch (err) {
      console.error('[useAdminCoaches] Error fetching clinics:', err);
    }
  }, [user]);

  const fetchCoaches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`[useAdminCoaches] Fetching coaches (attempt: ${retryCount + 1})`);
      console.log('[useAdminCoaches] User role:', user?.role, 'clinicId:', user?.clinicId);
      
      // STRICT ROLE ENFORCEMENT:
      // Clinic admins should ONLY see their clinic's coaches
      // System admins can see all coaches
      let coachesData;
      
      if (user?.role === 'clinic_admin' && user?.clinicId) {
        console.log('[useAdminCoaches] Clinic admin role detected, fetching only clinic coaches for clinic:', user.clinicId);
        try {
          coachesData = await CoachService.getClinicCoaches(user.clinicId);
          console.log('[useAdminCoaches] Successfully fetched coaches for clinic admin:', coachesData?.length || 0);
        } catch (err: any) {
          console.error('[useAdminCoaches] Error fetching clinic coaches:', err);
          // Provide specific error message for clinic admins
          throw new Error(`Failed to fetch coaches for your clinic: ${err.message || 'Unknown error'}`);
        }
      } else if (user?.role === 'admin' || user?.role === 'super_admin') {
        console.log('[useAdminCoaches] System admin role detected, fetching all coaches');
        coachesData = await CoachService.getAllCoachesForAdmin();
      } else {
        console.error('[useAdminCoaches] Invalid or missing role/clinicId:', user);
        throw new Error('Unauthorized or missing clinic information');
      }
      
      console.log('[useAdminCoaches] Received coaches data count:', coachesData?.length || 0);
      
      if (!Array.isArray(coachesData)) {
        console.error('[useAdminCoaches] Invalid coaches data format:', coachesData);
        throw new Error('Invalid data format received from service');
      }
      
      setCoaches(coachesData);
      
      if (coachesData.length === 0) {
        console.warn('[useAdminCoaches] No coaches were returned');
        toast.info('No coaches found for your clinic');
      } else {
        toast.success(`Successfully loaded ${coachesData.length} coaches`);
      }
      
      setLoading(false);
    } catch (err: any) {
      console.error("[useAdminCoaches] Error fetching coaches:", err);
      setError("Failed to load coaches. Please try again.");
      setErrorDetails(err instanceof Error ? err.message : String(err));
      setLoading(false);
      
      if (retryCount === 0) {
        console.log('[useAdminCoaches] First attempt failed, retrying automatically');
        setRetryCount(1);
        setTimeout(() => {
          fetchCoaches();
        }, 1000);
      }
    }
  }, [retryCount, user]);

  const refresh = useCallback(() => {
    setRetryCount(prev => prev + 1);
    toast.info("Refreshing coaches data...");
    fetchClinics();
    fetchCoaches();
  }, [fetchClinics, fetchCoaches]);

  useEffect(() => {
    console.log('[useAdminCoaches] Hook mounted, fetching coaches');
    console.log('[useAdminCoaches] Current user role:', user?.role, 'clinicId:', user?.clinicId);
    if (user?.role === 'clinic_admin') {
      console.log('[useAdminCoaches] Clinic admin details:', {
        name: user.name,
        clinicId: user.clinicId
      });
    }
    fetchClinics();
    fetchCoaches();
  }, [user?.role, user?.clinicId, fetchClinics, fetchCoaches]); // Critical to include both role and clinicId as dependencies

  const getClinicName = useCallback((clinicId: string) => {
    return clinics[clinicId] || `Your Clinic (${clinicId ? clinicId.slice(-4) : 'None'})`;
  }, [clinics]);

  // Enrich coaches with clinic names
  const coachesWithClinicNames = coaches.map(coach => ({
    ...coach,
    clinicName: getClinicName(coach.clinicId)
  }));

  return {
    coaches: coachesWithClinicNames,
    loading,
    error,
    errorDetails,
    refresh,
    retryCount
  };
}
