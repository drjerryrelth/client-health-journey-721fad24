
import { useState, useEffect } from 'react';
import { CoachService } from '@/services/coaches';
import ClinicService from '@/services/clinic-service';
import { toast } from 'sonner';

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
      
      console.log(`[useAdminCoaches] Fetching all coaches (attempt: ${retryCount + 1})`);
      
      const allCoaches = await CoachService.getAllCoachesForAdmin();
      
      console.log('[useAdminCoaches] Received coaches data:', allCoaches);
      console.log('[useAdminCoaches] Coaches data type:', typeof allCoaches);
      console.log('[useAdminCoaches] Is array?', Array.isArray(allCoaches));
      
      if (!Array.isArray(allCoaches)) {
        console.error('[useAdminCoaches] Invalid coaches data format:', allCoaches);
        throw new Error('Invalid data format received from service');
      }
      
      setCoaches(allCoaches);
      
      if (allCoaches.length === 0) {
        console.warn('[useAdminCoaches] No coaches were returned');
        toast.info('No coaches found in the database');
      } else {
        toast.success(`Successfully loaded ${allCoaches.length} coaches`);
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
  }, []);

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
