
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
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());
  const { user } = useAuth();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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
        console.log('[useAdminCoaches] Clinic name:', user.name);
        coachesData = await CoachService.getClinicCoaches(user.clinicId);
      } else if (user?.role === 'admin' || user?.role === 'super_admin') {
        console.log('[useAdminCoaches] System admin role detected, fetching all coaches');
        // Force direct retrieval with a timestamp to bust any caching
        const timestamp = Date.now();
        coachesData = await CoachService.getAllCoaches();
      } else {
        console.error('[useAdminCoaches] Invalid or missing role/clinicId:', user);
        throw new Error('Unauthorized or missing clinic information');
      }
      
      console.log('[useAdminCoaches] Received coaches data count:', coachesData?.length || 0);
      
      if (!Array.isArray(coachesData)) {
        console.error('[useAdminCoaches] Invalid coaches data format:', coachesData);
        throw new Error('Invalid data format received from service');
      }
      
      // Log each coach email for debugging
      if (coachesData.length > 0) {
        console.log('[useAdminCoaches] Coach emails:', coachesData.map(c => c.email).join(', '));
      } else {
        console.warn('[useAdminCoaches] No coaches were returned');
      }
      
      setCoaches(coachesData);
      setLoading(false);
      setIsInitialLoad(false);
      
      // Only show toast for empty data if we've tried at least once
      if (coachesData.length === 0 && retryCount > 0) {
        toast.info('No coaches found. You may need to add coaches to your clinics.');
      } else if (coachesData.length > 0) {
        toast.success(`Successfully loaded ${coachesData.length} coaches`);
      }
    } catch (err) {
      console.error("[useAdminCoaches] Error fetching coaches:", err);
      setError("Failed to load coaches. Please try again.");
      setErrorDetails(err instanceof Error ? err.message : String(err));
      setLoading(false);
      setIsInitialLoad(false);
      
      if (retryCount < 3) {
        console.log(`[useAdminCoaches] Attempt ${retryCount + 1} failed, retrying automatically`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          fetchCoaches();
        }, 1500);
      }
    }
  }, [retryCount, user]);

  const refresh = useCallback(() => {
    setRetryCount(0); // Reset retry count
    setLastRefreshTime(Date.now()); // Update refresh timestamp
    toast.info("Refreshing coaches data...");
    fetchClinics();
    fetchCoaches();
  }, [fetchClinics, fetchCoaches]);

  // Force a hard refresh that bypasses cache at all levels
  const hardRefresh = useCallback(() => {
    setRetryCount(0);
    setLastRefreshTime(Date.now());
    toast.info("Force refreshing all coaches data...");
    
    // Clear existing data first
    setCoaches([]);
    
    // Force cache-busting
    fetchClinics();
    
    // Add a small delay to ensure previous request is canceled
    setTimeout(() => {
      fetchCoaches();
    }, 300);
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
    
    // Clear any existing data first to avoid stale displays
    setCoaches([]);
    
    // Immediate data fetch
    fetchClinics();
    fetchCoaches();
    
    // Auto-refresh data every 15 seconds to prevent stale data (reduced from 30 seconds)
    const refreshInterval = setInterval(() => {
      const currentTime = Date.now();
      // Only refresh if it's been more than 15 seconds since last refresh
      if (currentTime - lastRefreshTime > 15000) {
        console.log('[useAdminCoaches] Auto-refreshing data');
        setLastRefreshTime(currentTime);
        fetchClinics();
        fetchCoaches();
      }
    }, 15000);
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [user?.role, user?.clinicId, fetchClinics, fetchCoaches, lastRefreshTime]); 

  // Safety timeout to prevent eternal loading state
  useEffect(() => {
    if (loading && isInitialLoad) {
      const timeout = setTimeout(() => {
        if (loading) {
          console.log('[useAdminCoaches] Safety timeout triggered to prevent eternal loading state');
          setLoading(false);
          setIsInitialLoad(false);
          setError("Loading timed out. Please try refreshing the page.");
        }
      }, 10000); // 10 second safety timeout
      
      return () => clearTimeout(timeout);
    }
  }, [loading, isInitialLoad]);

  const getClinicName = useCallback((clinicId: string) => {
    const name = clinics[clinicId] || `Unknown Clinic (${clinicId ? clinicId.slice(-4) : 'None'})`;
    return name;
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
    hardRefresh,
    retryCount
  };
}
