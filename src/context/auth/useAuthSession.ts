
import React from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { getCurrentSession, setupAuthListener } from '@/services/auth';
import { supabase } from '@/integrations/supabase/client';
import { UserData } from '@/types/auth';

interface UseAuthSessionProps {
  setUser: (user: UserData | null) => void;
  setSupabaseUser: (user: SupabaseUser | null) => void;
  setIsLoading: (value: boolean) => void;
  toast: any;
  navigate: any;
}

export const useAuthSession = ({
  setUser,
  setSupabaseUser,
  setIsLoading,
  toast,
  navigate
}: UseAuthSessionProps) => {
  const setupAuth = React.useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Setup listener for auth changes
      const { data: authListener } = setupAuthListener(
        async (event, session) => {
          console.log('Auth state changed:', event);
          
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (session?.user) {
              // Fetch user profile when signed in
              try {
                const { data: profile, error } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .single();
                
                if (error) {
                  console.error('Error fetching user profile:', error);
                  toast.error('Error loading your profile');
                  return;
                }
                
                if (profile) {
                  // Set the user data
                  setUser({
                    id: profile.id,
                    name: profile.full_name || '',
                    email: session.user.email || '',
                    role: profile.role || 'client',
                    clinicId: profile.clinic_id,
                    avatarUrl: profile.avatar_url,
                    phone: profile.phone,
                  });
                  
                  // Set Supabase user
                  setSupabaseUser(session.user);
                } else {
                  // No profile found
                  console.warn('No profile found for user:', session.user.id);
                  toast.error('Your profile is incomplete. Please contact support.');
                }
              } catch (error) {
                console.error('Error in profile fetch:', error);
                toast.error('Error loading your profile');
              }
            }
          } else if (event === 'SIGNED_OUT') {
            // Clear user data on sign out
            setUser(null);
            setSupabaseUser(null);
            
            // Redirect to login page
            navigate('/login');
          }
        }
      );
      
      // Check for existing session
      const { data, error } = await getCurrentSession();
      
      if (error) {
        console.error('Session error:', error.message);
        throw error;
      }
      
      if (data.session && data.session.user) {
        // Fetch user profile
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching user profile:', profileError);
            throw profileError;
          }
          
          if (profile) {
            // Set the user data
            setUser({
              id: profile.id,
              name: profile.full_name || '',
              email: data.session.user.email || '',
              role: profile.role || 'client',
              clinicId: profile.clinic_id,
              avatarUrl: profile.avatar_url,
              phone: profile.phone,
            });
            
            // Set Supabase user
            setSupabaseUser(data.session.user);
          } else {
            // No profile found
            console.warn('No profile found for user:', data.session.user.id);
          }
        } catch (error) {
          console.error('Error in initial profile fetch:', error);
        }
      }
      
      // Cleanup function to unsubscribe when component unmounts
      return () => {
        authListener?.unsubscribe();
      };
    } catch (error) {
      console.error('Auth setup error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setUser, setSupabaseUser, setIsLoading, toast, navigate]);
  
  return { setupAuth };
};
