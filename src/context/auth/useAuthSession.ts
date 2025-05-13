
import { useCallback, useEffect, useRef } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { UserData } from '@/types/auth';
import { fetchUserProfile } from '@/services/profile/fetch-profile';
import { 
  getCurrentSession,
  setupAuthListener 
} from '@/services/auth';
import { isDemoAdminEmail, isDemoClinicAdminEmail, isDemoCoachEmail, isDemoClientEmail } from '@/services/auth/demo/utils';
import { toast } from 'sonner';

type UseAuthSessionProps = {
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  setSupabaseUser: React.Dispatch<React.SetStateAction<SupabaseUser | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setInitialAuthCheckComplete: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: any;
};

export const useAuthSession = ({
  setUser,
  setSupabaseUser,
  setIsLoading,
  setInitialAuthCheckComplete,
  navigate
}: UseAuthSessionProps) => {
  const isMounted = useRef(true);
  const authCheckCompleted = useRef(false);

  const fetchAndSetUserProfile = useCallback(async (userId: string, userEmail?: string) => {
    try {
      console.log(`Fetching user profile for ID: ${userId}`);
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
    if (authCheckCompleted.current) {
      console.log('Auth check already completed, skipping duplicate check');
      return;
    }

    try {
      const { data: { session }, error } = await getCurrentSession();
      
      if (error) {
        console.error('Error getting current session:', error);
        toast.error('Error checking session');
        setIsLoading(false);
        setInitialAuthCheckComplete(true);
        authCheckCompleted.current = true;
        return;
      }

      if (!session?.user) {
        console.log('No active session found');
        setIsLoading(false);
        setInitialAuthCheckComplete(true);
        authCheckCompleted.current = true;
        return;
      }

      console.log('Found active session for user:', session.user.email);
      setSupabaseUser(session.user);
      await fetchAndSetUserProfile(session.user.id, session.user.email);
      setIsLoading(false);
      setInitialAuthCheckComplete(true);
      authCheckCompleted.current = true;
    } catch (error) {
      console.error('Error checking session:', error);
      toast.error('Error checking session');
      setIsLoading(false);
      setInitialAuthCheckComplete(true);
      authCheckCompleted.current = true;
    }
  }, [setSupabaseUser, setIsLoading, setInitialAuthCheckComplete, fetchAndSetUserProfile]);

  // Setup listener for auth changes - only once
  useEffect(() => {
    const setupListener = () => {
      console.log('Setting up auth state change listener');
      const { subscription } = setupAuthListener((event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Use setTimeout to prevent potential loop/deadlock
          setTimeout(() => {
            if (isMounted.current) {
              console.log('User signed in:', session.user.email);
              setSupabaseUser(session.user);
              fetchAndSetUserProfile(session.user.id, session.user.email);
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          if (isMounted.current) {
            console.log('User signed out');
            setUser(null);
            setSupabaseUser(null);
          }
        }
      });
      
      return subscription;
    };
    
    const subscription = setupListener();
    
    return () => {
      console.log('Cleaning up auth listener');
      subscription?.unsubscribe();
      isMounted.current = false;
    };
  }, [setSupabaseUser, setUser, fetchAndSetUserProfile]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return {
    setupAuth
  };
};
