
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User as SupabaseUser, AuthError } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clinicId?: string;
}

interface AuthContextType {
  user: UserData | null;
  supabaseUser: SupabaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  signUp: (email: string, password: string, userData: { full_name: string; role: string }) => Promise<void>;
}

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

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for ID:', userId);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return null;
      }

      if (profileData) {
        console.log('Profile data retrieved:', profileData);
        return {
          id: profileData.id,
          name: profileData.full_name,
          email: profileData.email,
          role: profileData.role as UserRole,
          clinicId: profileData.clinic_id,
        };
      }

      console.warn('No profile data found for user ID:', userId);
      return null;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    const initialSession = async () => {
      setIsLoading(true);
      
      try {
        console.log('Checking initial session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session?.user) {
          console.log('Session found, user authenticated');
          setSupabaseUser(session.user);
          
          const userData = await fetchUserProfile(session.user.id);
          
          if (userData) {
            console.log('User data retrieved and set');
            setUser(userData);
          } else {
            console.warn('No user data found, signing out');
            await supabase.auth.signOut();
            setSupabaseUser(null);
          }
        } else {
          console.log('No active session found');
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
        toast({
          title: 'Authentication Error',
          description: 'There was an error checking your authentication status.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    initialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in, getting profile data');
        setSupabaseUser(session.user);
        
        const userData = await fetchUserProfile(session.user.id);
        
        if (userData) {
          console.log('Setting user data after sign in');
          setUser(userData);
        } else {
          console.warn('No profile found after sign in');
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
        setSupabaseUser(null);
        navigate('/login');
      } else if (event === 'USER_UPDATED' && session?.user) {
        console.log('User updated');
        setSupabaseUser(session.user);
        
        const userData = await fetchUserProfile(session.user.id);
        
        if (userData) {
          setUser(userData);
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      console.log('Attempting login with email:', email);
      
      // Check if this is a demo login
      const isDemoLogin = ['admin@example.com', 'coach@example.com', 'client@example.com'].includes(email);
      if (isDemoLogin) {
        console.log('This is a demo login attempt');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error details:', error);
        
        // Provide more specific error messages based on error code
        let errorMessage = 'Invalid email or password';
        
        if (error.message.includes('Invalid login')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('rate limited')) {
          errorMessage = 'Too many login attempts. Please try again later.';
        }
        
        toast({
          title: 'Login failed',
          description: errorMessage,
          variant: 'destructive',
        });
        
        throw error;
      }
      
      if (!data.user) {
        console.error('No user returned from login');
        throw new Error('No user returned from login');
      }
      
      console.log('Login successful');
      return Promise.resolve();
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Error is already handled above, but catch any unexpected errors
      if (error instanceof AuthError) {
        // Already handled above
      } else {
        toast({
          title: 'Login failed',
          description: error.message || 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
      
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: { full_name: string; role: string }) => {
    setIsLoading(true);
    
    try {
      console.log('Attempting to create account with email:', email);
      
      // First check if the user already exists by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // If login succeeds, user already exists
      if (!signInError) {
        console.log('User already exists, no need to sign up');
        return;
      }
      
      console.log('User does not exist, creating new account');
      
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role,
          }
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }
      
      if (!data.user) {
        throw new Error('No user returned from signup');
      }
      
      // Create profile record manually to ensure it exists even if the trigger fails
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: userData.full_name,
        email: email,
        role: userData.role,
      });
      
      console.log('Account created successfully');
      
      return Promise.resolve();
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: 'Account creation failed',
        description: error.message || 'Could not create account',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user');
      await supabase.auth.signOut();
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
