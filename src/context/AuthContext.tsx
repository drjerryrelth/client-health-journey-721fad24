
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types';
import { UserData, AuthContextType } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { fetchUserProfile } from '@/hooks/use-user-profile';
import { 
  loginWithEmail, 
  signUpWithEmail, 
  logoutUser, 
  getCurrentSession,
  setupAuthListener 
} from '@/services/auth-service';

const AuthContext = createContext<AuthContextType>({
  user: null,
  supabaseUser: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  hasRole: () => false,
  signUp: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize auth once on component mount
  useEffect(() => {
    let isMounted = true;
    
    const initialSession = async () => {
      if (!isMounted) return;
      
      try {
        console.log('Checking initial session');
        
        // Add a timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 10000)
        );
        
        // Race between actual session check and timeout
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
          try {
            const userData = await fetchUserProfile(sessionUser.id);
            
            if (!isMounted) return;
            
            if (userData) {
              console.log('User data retrieved and set');
              setUser(userData);
            } else {
              console.warn('No user data found, signing out');
              await logoutUser();
              setSupabaseUser(null);
            }
          } catch (profileError) {
            console.error('Error fetching user profile:', profileError);
            // Continue without profile data
          }
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
    };
    
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
          
          try {
            const userData = await fetchUserProfile(session.user.id);
            
            if (!isMounted) return;
            
            if (userData) {
              console.log('Setting user data after sign in');
              setUser(userData);
            } else {
              console.warn('No profile found after sign in');
            }
          } catch (error) {
            console.error('Error fetching profile after sign in:', error);
          }
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
          
          try {
            const userData = await fetchUserProfile(session.user.id);
            
            if (!isMounted) return;
            
            if (userData) {
              setUser(userData);
            }
          } catch (error) {
            console.error('Error fetching profile after user update:', error);
          }
        }, 0);
      }
    });
    
    // Then check for initial session
    initialSession();
    
    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      await loginWithEmail(email, password);
      return Promise.resolve();
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Provide specific error messages based on error code
      let errorMessage = 'Invalid email or password';
      
      if (error.message.includes('Invalid login')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.message.includes('rate limited')) {
        errorMessage = 'Too many login attempts. Please try again later.';
      } else if (error.message.includes('Email not confirmed')) {
        // For demo purposes, we'll handle this case specially
        const isDemoLogin = email === 'drrelth@contourlight.com';
        if (isDemoLogin) {
          errorMessage = 'This demo account requires email confirmation in Supabase. To use the demo account, please go to Supabase User Management and confirm the email manually.';
        } else {
          errorMessage = 'Please check your email and confirm your account before logging in.';
        }
      }
      
      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: { full_name: string; role: string }) => {
    setIsLoading(true);
    
    try {
      await signUpWithEmail(email, password, userData);
      
      const isDemoAccount = email === 'drrelth@contourlight.com';
      
      if (isDemoAccount) {
        toast({
          title: 'Demo account created',
          description: 'Since email confirmation is required, please go to the Supabase User Management panel to confirm the email manually.',
        });
      } else {
        toast({
          title: 'Account created',
          description: 'Please check your email to confirm your account before logging in.',
        });
      }
      
      return Promise.resolve();
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      let errorMessage = error.message || 'Could not create account';
      
      // Handle specific Supabase signup errors
      if (error.message?.includes('email address is invalid')) {
        errorMessage = 'The email address format is invalid. Please use a different email.';
      } else if (error.message?.includes('already registered')) {
        errorMessage = 'This email is already registered. Please try logging in instead.';
      }
      
      toast({
        title: 'Account creation failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'There was a problem signing out.',
        variant: 'destructive',
      });
    }
  };

  const hasRole = (role: UserRole | UserRole[]) => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasRole,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
