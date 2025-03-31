
import { useCallback } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { UserData } from '@/types/auth';
import { fetchUserProfile } from '@/hooks/use-user-profile';
import { 
  getCurrentSession,
  setupAuthListener 
} from '@/services/auth';

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
  
  const fetchAndSetUserProfile = useCallback(async (userId: string) => {
    try {
      const userData = await fetchUserProfile(userId);
      
      if (userData) {
        console.log('Setting user data', userData);
        setUser(userData);
      } else {
        console.warn('No user data found, signing out');
      }
    } catch (profileError) {
      console.error('Error fetching user profile:', profileError);
    }
  }, [setUser]);

  const setupAuth = useCallback(async () => {
    let isMounted = true;
    
    try {
      console.log('Checking initial session');
      
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
            
            await fetchAndSetUserProfile(session.user.id);
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
            
            await fetchAndSetUserProfile(session.user.id);
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
          
          // Get the user profile
          await fetchAndSetUserProfile(sessionUser.id);
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
