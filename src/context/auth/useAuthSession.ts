
import { useCallback } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { UserData } from '@/types/auth';
import { fetchUserProfile } from '@/services/profile/fetch-profile';
import { 
  getCurrentSession,
  setupAuthListener 
} from '@/services/auth';
import { isDemoAdminEmail } from '@/services/auth/demo/utils';

type UseAuthSessionProps = {
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  setSupabaseUser: React.Dispatch<React.SetStateAction<SupabaseUser | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  toast: any;
  navigate: any;
};

export const useAuthSession = ({
  setUser,
  setSupabaseUser,
  setIsLoading,
  toast,
  navigate
}: UseAuthSessionProps) => {
  
  const fetchAndSetUserProfile = useCallback(async (userId: string, userEmail?: string) => {
    try {
      // Special case for demo admin - highest priority check
      if (userEmail && isDemoAdminEmail(userEmail)) {
        console.log('CRITICAL: Demo admin detected in fetchAndSetUserProfile, ensuring admin role');
        // For demo admin, force role to admin regardless of what's in the database
        setUser({
          id: userId,
          name: 'Admin User',
          email: userEmail,
          role: 'admin',
          clinicId: null // Admin has no clinic
        });
        return;
      }
      
      const userData = await fetchUserProfile(userId);
      
      if (userData) {
        console.log('Setting user data', userData);
        setUser(userData);
      } else {
        console.warn('No user data found, this may cause issues with authentication');
        
        // If still no data, but we have a demo admin email, enforce admin role
        if (userEmail && isDemoAdminEmail(userEmail)) {
          console.log('Fallback: Using demo admin detection when profile fetch failed');
          setUser({
            id: userId,
            name: 'Admin User',
            email: userEmail,
            role: 'admin',
            clinicId: null
          });
          return;
        }
        
        toast({
          title: 'Profile Error',
          description: 'Could not retrieve your user profile. Please contact support.',
          variant: 'destructive',
        });
      }
    } catch (profileError) {
      console.error('Error fetching user profile:', profileError);
      
      // Last resort for demo admin - even in case of errors, enforce admin role
      if (userEmail && isDemoAdminEmail(userEmail)) {
        console.log('ERROR FALLBACK: Using demo admin detection when profile fetch failed with error');
        setUser({
          id: userId,
          name: 'Admin User',
          email: userEmail,
          role: 'admin',
          clinicId: null
        });
        return;
      }
      
      toast({
        title: 'Profile Error',
        description: 'An error occurred while retrieving your profile data.',
        variant: 'destructive',
      });
    }
  }, [setUser, toast]);

  const setupAuth = useCallback(async () => {
    let isMounted = true;
    
    try {
      console.log('Checking initial session');
      console.log('Setting up auth listener');
      
      // Add a timeout to prevent infinite loading
      const timeoutPromise = new Promise<{data: null, error: Error}>((_, reject) => 
        setTimeout(() => reject(new Error('Session check timeout')), 10000)
      );
      
      // Set up auth state listener first
      const { data: authListener } = setupAuthListener((event, session) => {
        console.log('Auth state changed:', event);
        
        if (!isMounted) return;
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, getting profile data');
          setSupabaseUser(session.user);
          
          // Use setTimeout to avoid Supabase deadlocks
          setTimeout(async () => {
            if (!isMounted) return;
            
            // Pass email to handle demo admin case
            await fetchAndSetUserProfile(session.user.id, session.user.email);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUser(null);
          setSupabaseUser(null);
          navigate('/login');
        } else if (event === 'USER_UPDATED' && session?.user) {
          console.log('User updated');
          setSupabaseUser(session.user);
          
          // Use setTimeout to avoid Supabase deadlocks
          setTimeout(async () => {
            if (!isMounted) return;
            
            // Pass email to handle demo admin case
            await fetchAndSetUserProfile(session.user.id, session.user.email);
          }, 0);
        } else if (event === 'INITIAL_SESSION' && session?.user) {
          console.log('Initial session found');
          setSupabaseUser(session.user);
          
          // Use setTimeout to avoid Supabase deadlocks
          setTimeout(async () => {
            if (!isMounted) return;
            
            // Pass email to handle demo admin case
            await fetchAndSetUserProfile(session.user.id, session.user.email);
          }, 0);
        }
      });
      
      // Race between actual session check and timeout
      try {
        const sessionResult = await Promise.race([
          getCurrentSession(),
          timeoutPromise
        ]);
        
        if (!isMounted) return;
        
        // If we have a session with a user
        if (sessionResult.data?.session?.user) {
          console.log('Session found, user authenticated');
          const sessionUser = sessionResult.data.session.user;
          setSupabaseUser(sessionUser);
          
          // Get the user profile - pass email to handle demo admin case
          await fetchAndSetUserProfile(sessionUser.id, sessionUser.email);
        } else {
          console.log('No active session found');
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
        if (!isMounted) return;
        
        toast({
          title: 'Authentication Error',
          description: 'There was an error checking your authentication status.',
          variant: 'destructive',
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
      
      return () => {
        isMounted = false;
        if (authListener && authListener.subscription) {
          authListener.subscription.unsubscribe();
        }
      };
    } catch (error) {
      setIsLoading(false);
      console.error('Setup auth error:', error);
    }
  }, [setUser, setSupabaseUser, setIsLoading, toast, navigate, fetchAndSetUserProfile]);

  return {
    setupAuth,
    fetchAndSetUserProfile
  };
};
