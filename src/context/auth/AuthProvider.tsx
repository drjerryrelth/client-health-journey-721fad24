
import React from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types';
import { UserData, AuthContextType } from '@/types/auth';
import { AuthContext } from './AuthContext';
import { useAuthMethods } from './useAuthMethods';
import { useAuthSession } from './useAuthSession';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use React.useState explicitly
  const [user, setUser] = React.useState<UserData | null>(null);
  const [supabaseUser, setSupabaseUser] = React.useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();
  
  // Hook for auth session management
  const { setupAuth } = useAuthSession({
    setUser,
    setSupabaseUser,
    setIsLoading,
    navigate
  });

  // Hook for auth methods
  const { login, logout, signUp, hasRole } = useAuthMethods({
    setIsLoading
  });

  // Initialize auth once on component mount
  React.useEffect(() => {
    setupAuth();
  }, [setupAuth]);

  // Wrap the signUp method to match the expected return type
  const wrappedSignUp = async (email: string, password: string, userData: { full_name: string; role: string }): Promise<void> => {
    await signUp(email, password, userData);
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
        hasRole: (role: UserRole | UserRole[]) => hasRole(role)(user),
        signUp: wrappedSignUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
