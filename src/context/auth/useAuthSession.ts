
import React from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { getCurrentSession, setupAuthListener } from '@/services/auth';
import { supabase } from '@/integrations/supabase/client';
import { UserData } from '@/types/auth';
import { toast } from 'sonner';

interface UseAuthSessionProps {
  setUser: (user: UserData | null) => void;
  setSupabaseUser: (user: SupabaseUser | null) => void;
  setIsLoading: (value: boolean) => void;
  navigate: any;
}

export const useAuthSession = ({
  setUser,
  setSupabaseUser,
  setIsLoading,
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
                  const userData = {
                    id: profile.id,
                    name: profile.full_name || '',
                    email: session.user.email || '',
                    role: profile.role || 'client',
                    clinicId: profile.clinic_id,
                    avatarUrl: profile.avatar_url,
                    phone: profile.phone,
                  };
                  
                  console.log('Setting user data:', userData);
                  setUser(userData);
                  
                  // Set Supabase user
                  setSupabaseUser(session.user);
                  
                  // Redirect to appropriate dashboard based on role
                  let redirectPath = '/dashboard';
                  if (profile.role === 'admin' || profile.role === 'super_admin') {
                    redirectPath = '/admin/dashboard';
                  } else if (profile.role === 'clinic_admin') {
                    redirectPath = '/admin/dashboard';
                  } else if (profile.role === 'coach') {
                    redirectPath = '/coach/dashboard';
                  } else if (profile.role === 'client') {
                    redirectPath = '/client';
                  }
                  
                  console.log('Redirecting to:', redirectPath);
                  // Use a small timeout to ensure state is updated before navigation
                  setTimeout(() => {
                    navigate(redirectPath, { replace: true });
                  }, 100);
                } else {
                  // No profile found - create a default one
                  console.warn('No profile found for user:', session.user.id);
                  
                  // Create a default profile for the user
                  try {
                    const { data: newProfile, error: insertError } = await supabase
                      .from('profiles')
                      .insert([{
                        id: session.user.id,
                        full_name: session.user.user_metadata?.full_name || 'New User',
                        email: session.user.email,
                        role: session.user.user_metadata?.role || 'client',
                      }])
                      .select()
                      .single();
                    
                    if (insertError) {
                      console.error('Error creating profile:', insertError);
                      toast.error('Error creating your profile');
                      return;
                    }
                    
                    if (newProfile) {
                      // Set user data with the newly created profile
                      const userData = {
                        id: newProfile.id,
                        name: newProfile.full_name || '',
                        email: session.user.email || '',
                        role: newProfile.role || 'client',
                        clinicId: newProfile.clinic_id,
                        avatarUrl: newProfile.avatar_url,
                        phone: newProfile.phone,
                      };
                      
                      console.log('Setting new user data from created profile:', userData);
                      setUser(userData);
                      setSupabaseUser(session.user);
                      
                      // Redirect to dashboard based on role
                      let redirectPath = '/dashboard';
                      if (newProfile.role === 'admin' || newProfile.role === 'super_admin') {
                        redirectPath = '/admin/dashboard';
                      } else if (newProfile.role === 'clinic_admin') {
                        redirectPath = '/admin/dashboard';
                      } else if (newProfile.role === 'coach') {
                        redirectPath = '/coach/dashboard';
                      } else if (newProfile.role === 'client') {
                        redirectPath = '/client';
                      }
                      
                      console.log('Redirecting new user to:', redirectPath);
                      // Use a small timeout to ensure state is updated before navigation
                      setTimeout(() => {
                        navigate(redirectPath, { replace: true });
                      }, 100);
                    }
                  } catch (createError) {
                    console.error('Error in profile creation:', createError);
                    toast.error('Failed to set up your profile');
                  }
                }
              } catch (error) {
                console.error('Error in profile fetch:', error);
                toast.error('Error loading your profile');
              } finally {
                setIsLoading(false);
              }
            }
          } else if (event === 'SIGNED_OUT') {
            // Clear user data on sign out
            setUser(null);
            setSupabaseUser(null);
            setIsLoading(false);
            
            // Redirect to login page
            navigate('/login');
          }
        }
      );
      
      // Check for existing session
      const { data, error } = await getCurrentSession();
      
      if (error) {
        console.error('Session error:', error.message);
        setIsLoading(false);
        return;
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
            setIsLoading(false);
            return;
          }
          
          if (profile) {
            // Set the user data
            const userData = {
              id: profile.id,
              name: profile.full_name || '',
              email: data.session.user.email || '',
              role: profile.role || 'client',
              clinicId: profile.clinic_id,
              avatarUrl: profile.avatar_url,
              phone: profile.phone,
            };
            
            // Set user and Supabase user
            setUser(userData);
            setSupabaseUser(data.session.user);
            
            console.log('User authenticated from existing session:', profile.role);
            
            // Redirect based on role if on login page
            if (window.location.pathname === '/login') {
              let redirectPath = '/dashboard';
              if (profile.role === 'admin' || profile.role === 'super_admin') {
                redirectPath = '/admin/dashboard';
              } else if (profile.role === 'clinic_admin') {
                redirectPath = '/admin/dashboard';
              } else if (profile.role === 'coach') {
                redirectPath = '/coach/dashboard';
              } else if (profile.role === 'client') {
                redirectPath = '/client';
              }
              
              console.log('Redirecting from existing session to:', redirectPath);
              // Use a small timeout to ensure state is updated before navigation
              setTimeout(() => {
                navigate(redirectPath, { replace: true });
              }, 100);
            }
          } else {
            // No profile found - create a default one for existing session
            console.warn('No profile found for user from existing session:', data.session.user.id);
            
            try {
              const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert([{
                  id: data.session.user.id,
                  full_name: data.session.user.user_metadata?.full_name || 'New User',
                  email: data.session.user.email,
                  role: data.session.user.user_metadata?.role || 'client',
                }])
                .select()
                .single();
              
              if (insertError) {
                console.error('Error creating profile for existing session:', insertError);
                setIsLoading(false);
                return;
              }
              
              if (newProfile) {
                // Set user data with the newly created profile
                const userData = {
                  id: newProfile.id,
                  name: newProfile.full_name || '',
                  email: data.session.user.email || '',
                  role: newProfile.role || 'client',
                  clinicId: newProfile.clinic_id,
                  avatarUrl: newProfile.avatar_url,
                  phone: newProfile.phone,
                };
                
                console.log('Setting new user data from created profile (existing session):', userData);
                setUser(userData);
                setSupabaseUser(data.session.user);
                
                // Redirect to dashboard based on role
                if (window.location.pathname === '/login') {
                  let redirectPath = '/dashboard';
                  if (newProfile.role === 'admin' || newProfile.role === 'super_admin') {
                    redirectPath = '/admin/dashboard';
                  } else if (newProfile.role === 'clinic_admin') {
                    redirectPath = '/admin/dashboard';
                  } else if (newProfile.role === 'coach') {
                    redirectPath = '/coach/dashboard';
                  } else if (newProfile.role === 'client') {
                    redirectPath = '/client';
                  }
                  
                  console.log('Redirecting new user from existing session to:', redirectPath);
                  // Use a small timeout to ensure state is updated before navigation
                  setTimeout(() => {
                    navigate(redirectPath, { replace: true });
                  }, 100);
                }
              }
            } catch (createError) {
              console.error('Error in profile creation for existing session:', createError);
            }
          }
        } catch (error) {
          console.error('Error in initial profile fetch:', error);
        }
      }
      
      // Always set loading to false after all operations
      setIsLoading(false);
      
      // Cleanup function to unsubscribe when component unmounts
      return () => {
        if (authListener && authListener.subscription) {
          authListener.subscription.unsubscribe();
        }
      };
    } catch (error) {
      console.error('Auth setup error:', error);
      setIsLoading(false);
    }
  }, [setUser, setSupabaseUser, setIsLoading, navigate]);
  
  return { setupAuth };
};
