import { useCallback, useEffect, useRef } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { UserData } from '@/types/auth';
import { fetchUserProfile } from '@/services/profile/fetch-profile';
import { 
  getCurrentSession,
  setupAuthListener 
} from '@/services/auth';
import { isDemoAdminEmail, isDemoClinicAdminEmail, isDemoCoachEmail, isDemoClientEmail } from '@/services/auth/demo/utils';
import { DEMO_CLINIC_ID } from '@/services/auth/demo/constants';
import { toast } from 'sonner';

type UseAuthSessionProps = {
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  setSupabaseUser: React.Dispatch<React.SetStateAction<SupabaseUser | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: any;
};

export const useAuthSession = ({
  setUser,
  setSupabaseUser,
  setIsLoading,
  navigate
}: UseAuthSessionProps) => {
  const isMounted = useRef(true);

  const fetchAndSetUserProfile = useCallback(async (userId: string, userEmail?: string) => {
    try {
      const profile = await fetchUserProfile(userId);
      console.log('Profile:', profile);
      
      if (!profile) {
        console.error('No profile found for user:', userId);
        setUser(null);
        setSupabaseUser(null);
        return;
      }

      setUser({
        id: profile.id,
        name: profile.name || '',
        email: profile.email || '',
        role: profile.role as any,
        clinicId: profile.clinicId || undefined,
        phone: profile.phone || undefined
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Error loading user profile');
      setUser(null);
      setSupabaseUser(null);
    }
  }, [setUser, setSupabaseUser]);

  const setupAuth = useCallback(async () => {
    try {
      const { data: { session }, error } = await getCurrentSession();
      
      if (error) {
        console.error('Error getting current session:', error);
        toast.error('Error checking session');
        return;
      }

      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      setSupabaseUser(session.user);
      await fetchAndSetUserProfile(session.user.id, session.user.email);
    } catch (error) {
      console.error('Error checking session:', error);
      toast.error('Error checking session');
    } finally {
      setIsLoading(false);
    }
  }, [setSupabaseUser, setIsLoading, fetchAndSetUserProfile]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return {
    setupAuth
  };
};
