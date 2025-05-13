
import React, { useState, useCallback } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types';
import { UserData, AuthContextType } from '@/types/auth';
import { AuthContext } from './AuthContext';
import { useAuthMethods } from './useAuthMethods';
import { useAuthSession } from './useAuthSession';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialAuthCheckComplete, setInitialAuthCheckComplete] = useState(false);
  const navigate = useNavigate();
  
  // Hook for auth session management
  const { setupAuth } = useAuthSession({
    setUser,
    setSupabaseUser,
    setIsLoading,
    setInitialAuthCheckComplete,
    navigate
  });

  // Hook for auth methods
  const { login, logout, signUp, hasRole } = useAuthMethods({
    setIsLoading,
    setUser,
    setSupabaseUser
  });

  // Initialize auth once on component mount
  React.useEffect(() => {
    let isMounted = true;
    
    const initAuth = async () => {
      if (isMounted) {
        await setupAuth();
      }
    };
    
    initAuth();
    
    return () => {
      isMounted = false;
    };
  }, [setupAuth]);

  // Wrap the signUp method to match the expected return type
  const wrappedSignUp = async (email: string, password: string, userData: { full_name: string; role: string }): Promise<void> => {
    await signUp(email, password, userData);
  };

  // Create a hasRoleWrapper function that takes the user from context
  const hasRoleWrapper = (roleToCheck: UserRole | UserRole[]): boolean => {
    // Call the hasRole function which returns a role checking function
    const roleCheckFn = hasRole(roleToCheck);
    // Then call that function with the current user
    return roleCheckFn(user);
  };

  const value: AuthContextType = {
    user,
    supabaseUser,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signUp: wrappedSignUp,
    hasRole: hasRoleWrapper,
    initialAuthCheckComplete
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
