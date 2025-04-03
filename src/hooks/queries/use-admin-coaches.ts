
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
      const allClinics = await ClinicService.getClinics();
      const clinicMap: Record<string, string> = {};
      allClinics.forEach(clinic => {
        clinicMap[clinic.id] = clinic.name;
      });
      setClinics(clinicMap);
      console.log('[useAdminCoaches] Clinic map created:', clinicMap);
    } catch (err) {
      console.error('[useAdminCoaches] Error fetching clinics:', err);
    }
  };

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`[useAdminCoaches] Fetching coaches (attempt: ${retryCount + 1})`);
      
      // CRITICAL FIX: Use the correct fetching method based on role
      // Clinic admins should ONLY see their clinic's coaches
      const isClinicAdmin = user?.role === 'clinic_admin';
      const clinicId = user?.clinicId;
      
      let coachesData;
      if (isClinicAdmin && clinicId) {
        console.log('[useAdminCoaches] Fetching coaches for specific clinic:', clinicId);
        coachesData = await CoachService.getClinicCoaches(clinicId);
      } else {
        console.log('[useAdminCoaches] Fetching all coaches (system admin)');
        coachesData = await CoachService.getAllCoachesForAdmin();
      }
      
      console.log('[useAdminCoaches] Received coaches data:', coachesData);
      console.log('[useAdminCoaches] Coaches data type:', typeof coachesData);
      console.log('[useAdminCoaches] Is array?', Array.isArray(coachesData));
      
      if (!Array.isArray(coachesData)) {
        console.error('[useAdminCoaches] Invalid coaches data format:', coachesData);
        throw new Error('Invalid data format received from service');
      }
      
      setCoaches(coachesData);
      
      if (coachesData.length === 0) {
        console.warn('[useAdminCoaches] No coaches were returned');
        toast.info('No coaches found in the database');
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
    fetchClinics();
    fetchCoaches();
  }, [user?.role, user?.clinicId]); // CRITICAL FIX: Added user role and clinicId as dependencies

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
