
import { useCallback } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { UserData } from '@/types/auth';
import { fetchUserProfile } from '@/services/profile/fetch-profile';
import { 
  getCurrentSession,
  setupAuthListener 
} from '@/services/auth';
import { isDemoAdminEmail, isDemoClinicAdminEmail, isDemoCoachEmail, isDemoClientEmail } from '@/services/auth/demo/utils';

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
      
      // Special case for demo clinic admin - second highest priority check
      if (userEmail && isDemoClinicAdminEmail(userEmail)) {
        console.log('CRITICAL: Demo clinic admin detected in fetchAndSetUserProfile, ensuring clinic_admin role');
        // Default clinic ID for demo clinic admin
        const clinicId = process.env.DEMO_CLINIC_ID || '65196bd4-f754-4c4e-9649-2bf478016701';
        // For demo clinic admin, force role to clinic_admin with specific clinic ID
        setUser({
          id: userId,
          name: 'Clinic Admin User',
          email: userEmail,
          role: 'clinic_admin',
          clinicId: clinicId // Clinic admin must have a clinic
        });
        return;
      }
      
      // Special case for demo coach - third highest priority check
      if (userEmail && isDemoCoachEmail(userEmail)) {
        console.log('CRITICAL: Demo coach detected in fetchAndSetUserProfile, ensuring coach role');
        // Default clinic ID for demo coach
        const clinicId = process.env.DEMO_CLINIC_ID || '65196bd4-f754-4c4e-9649-2bf478016701';
        // Name depends on which coach demo email is used
        const name = userEmail === 'support@practicenaturals.com' ? 'Support Coach' : 'Coach User';
        // For demo coach, force role to coach with specific clinic ID
        setUser({
          id: userId,
          name: name,
          email: userEmail,
          role: 'coach',
          clinicId: clinicId // Coach must have a clinic
        });
        return;
      }
      
      // Special case for demo client - fourth highest priority check
      if (userEmail && isDemoClientEmail(userEmail)) {
        console.log('CRITICAL: Demo client detected in fetchAndSetUserProfile, ensuring client role');
        // Default clinic ID for demo client
        const clinicId = process.env.DEMO_CLINIC_ID || '65196bd4-f754-4c4e-9649-2bf478016701';
        // Name depends on which client demo email is used
        const name = userEmail === 'drjerry@livingbetterhealthcare.com' ? 'Dr. Jerry' : 'Client User';
        // For demo client, force role to client with specific clinic ID
        setUser({
          id: userId,
          name: name,
          email: userEmail,
          role: 'client',
          clinicId: clinicId // Client must have a clinic
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
        
        // If still no data, but we have a demo clinic admin email, enforce clinic_admin role
        if (userEmail && isDemoClinicAdminEmail(userEmail)) {
          console.log('Fallback: Using demo clinic admin detection when profile fetch failed');
          const clinicId = process.env.DEMO_CLINIC_ID || '65196bd4-f754-4c4e-9649-2bf478016701';
          setUser({
            id: userId,
            name: 'Clinic Admin User',
            email: userEmail,
            role: 'clinic_admin',
            clinicId: clinicId
          });
          return;
        }
        
        // If still no data, but we have a demo coach email, enforce coach role
        if (userEmail && isDemoCoachEmail(userEmail)) {
          console.log('Fallback: Using demo coach detection when profile fetch failed');
          const clinicId = process.env.DEMO_CLINIC_ID || '65196bd4-f754-4c4e-9649-2bf478016701';
          const name = userEmail === 'support@practicenaturals.com' ? 'Support Coach' : 'Coach User';
          setUser({
            id: userId,
            name: name,
            email: userEmail,
            role: 'coach',
            clinicId: clinicId
          });
          return;
        }
        
        // If still no data, but we have a demo client email, enforce client role
        if (userEmail && isDemoClientEmail(userEmail)) {
          console.log('Fallback: Using demo client detection when profile fetch failed');
          const clinicId = process.env.DEMO_CLINIC_ID || '65196bd4-f754-4c4e-9649-2bf478016701';
          const name = userEmail === 'drjerry@livingbetterhealthcare.com' ? 'Dr. Jerry' : 'Client User';
          setUser({
            id: userId,
            name: name,
            email: userEmail,
            role: 'client',
            clinicId: clinicId
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
      
      // Last resort for demo clinic admin - even in case of errors, enforce clinic_admin role
      if (userEmail && isDemoClinicAdminEmail(userEmail)) {
        console.log('ERROR FALLBACK: Using demo clinic admin detection when profile fetch failed with error');
        const clinicId = process.env.DEMO_CLINIC_ID || '65196bd4-f754-4c4e-9649-2bf478016701';
        setUser({
          id: userId,
          name: 'Clinic Admin User',
          email: userEmail,
          role: 'clinic_admin',
          clinicId: clinicId
        });
        return;
      }
      
      // Last resort for demo coach - even in case of errors, enforce coach role
      if (userEmail && isDemoCoachEmail(userEmail)) {
        console.log('ERROR FALLBACK: Using demo coach detection when profile fetch failed with error');
        const clinicId = process.env.DEMO_CLINIC_ID || '65196bd4-f754-4c4e-9649-2bf478016701';
        const name = userEmail === 'support@practicenaturals.com' ? 'Support Coach' : 'Coach User';
        setUser({
          id: userId,
          name: name,
          email: userEmail,
          role: 'coach',
          clinicId: clinicId
        });
        return;
      }
      
      // Last resort for demo client - even in case of errors, enforce client role
      if (userEmail && isDemoClientEmail(userEmail)) {
        console.log('ERROR FALLBACK: Using demo client detection when profile fetch failed with error');
        const clinicId = process.env.DEMO_CLINIC_ID || '65196bd4-f754-4c4e-9649-2bf478016701';
        const name = userEmail === 'drjerry@livingbetterhealthcare.com' ? 'Dr. Jerry' : 'Client User';
        setUser({
          id: userId,
          name: name,
          email: userEmail,
          role: 'client',
          clinicId: clinicId
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
      console.log('Setting up auth system');
      setIsLoading(true);
      
      // Add a timeout to prevent infinite loading
      const timeoutPromise = new Promise<{data: null, error: Error}>((_, reject) => 
        setTimeout(() => reject(new Error('Session check timeout')), 10000)
      );
      
      // Set up auth state listener first - this is crucial for capturing all auth events
      const { data: authListener } = setupAuthListener((event, session) => {
        console.log('Auth state changed:', event, session ? 'session exists' : 'no session');
        
        if (!isMounted) return;
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, getting profile data');
          setSupabaseUser(session.user);
          
          // Use setTimeout to avoid Supabase deadlocks
          setTimeout(async () => {
            if (!isMounted) return;
            
            // Pass email to handle demo admin case
            await fetchAndSetUserProfile(session.user.id, session.user.email);
            setIsLoading(false);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUser(null);
          setSupabaseUser(null);
          setIsLoading(false);
          navigate('/login');
        } else if (event === 'USER_UPDATED' && session?.user) {
          console.log('User updated');
          setSupabaseUser(session.user);
          
          // Use setTimeout to avoid Supabase deadlocks
          setTimeout(async () => {
            if (!isMounted) return;
            
            // Pass email to handle demo admin case
            await fetchAndSetUserProfile(session.user.id, session.user.email);
            setIsLoading(false);
          }, 0);
        } else if (event === 'INITIAL_SESSION' && session?.user) {
          console.log('Initial session found');
          setSupabaseUser(session.user);
          
          // Use setTimeout to avoid Supabase deadlocks
          setTimeout(async () => {
            if (!isMounted) return;
            
            // Pass email to handle demo admin case
            await fetchAndSetUserProfile(session.user.id, session.user.email);
            setIsLoading(false);
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
          console.log('Session found during app initialization, user authenticated');
          const sessionUser = sessionResult.data.session.user;
          setSupabaseUser(sessionUser);
          
          // Get the user profile - pass email to handle demo admin case
          await fetchAndSetUserProfile(sessionUser.id, sessionUser.email);
        } else {
          console.log('No active session found during initialization');
          // Ensure loading is set to false when no session is found
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
        if (!isMounted) return;
        
        toast({
          title: 'Authentication Error',
          description: 'There was an error checking your authentication status.',
          variant: 'destructive',
        });
        
        // Ensure loading is set to false even when there's an error
        setIsLoading(false);
      }
      
      return () => {
        isMounted = false;
        if (authListener && authListener.subscription) {
          authListener.subscription.unsubscribe();
        }
      };
    } catch (error) {
      if (isMounted) {
        setIsLoading(false);
        console.error('Setup auth error:', error);
      }
    }
  }, [setUser, setSupabaseUser, setIsLoading, toast, navigate, fetchAndSetUserProfile]);

  return {
    setupAuth,
    fetchAndSetUserProfile
  };
};
