
import { useState, useEffect } from 'react';
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

  const fetchClinics = async () => {
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
        }
      }
    } catch (err) {
      console.error('[useAdminCoaches] Error fetching clinics:', err);
    }
  };

  const fetchCoaches = async () => {
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
        console.log('[useAdminCoaches] Clinic admin role detected, fetching only clinic coaches');
        coachesData = await CoachService.getClinicCoaches(user.clinicId);
      } else if (user?.role === 'admin' || user?.role === 'super_admin') {
        console.log('[useAdminCoaches] System admin role detected, fetching all coaches');
        coachesData = await CoachService.getAllCoachesForAdmin();
      } else {
        console.error('[useAdminCoaches] Invalid or missing role/clinicId:', user);
        throw new Error('Unauthorized or missing clinic information');
      }
      
      console.log('[useAdminCoaches] Received coaches data:', coachesData);
      
      if (!Array.isArray(coachesData)) {
        console.error('[useAdminCoaches] Invalid coaches data format:', coachesData);
        throw new Error('Invalid data format received from service');
      }
      
      setCoaches(coachesData);
      
      if (coachesData.length === 0) {
        console.warn('[useAdminCoaches] No coaches were returned');
        toast.info('No coaches found');
      } else {
        toast.success(`Successfully loaded ${coachesData.length} coaches`);
      }
      
      setLoading(false);
    } catch (err) {
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
  };

  const refresh = () => {
    setRetryCount(prev => prev + 1);
    toast.info("Refreshing coaches data...");
    fetchClinics();
    fetchCoaches();
  };

  useEffect(() => {
    console.log('[useAdminCoaches] Hook mounted, fetching coaches');
    console.log('[useAdminCoaches] Current user role:', user?.role, 'clinicId:', user?.clinicId);
    fetchClinics();
    fetchCoaches();
  }, [user?.role, user?.clinicId]); // Critical to include both role and clinicId as dependencies

  const getClinicName = (clinicId: string) => {
    return clinics[clinicId] || `Unknown Clinic (${clinicId ? clinicId.slice(-4) : 'None'})`;
  };

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
