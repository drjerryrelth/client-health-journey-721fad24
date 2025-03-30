
import React, { useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types';
import { UserData, AuthContextType } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { AuthContext } from './AuthContext';
import { useAuthMethods } from './useAuthMethods';
import { useAuthSession } from './useAuthSession';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { setupAuth, fetchAndSetUserProfile } = useAuthSession({
    setUser,
    setSupabaseUser,
    setIsLoading,
    toast,
    navigate
  });

  // Auth methods
  const { login, logout, signUp, hasRole } = useAuthMethods({
    setIsLoading,
    toast
  });

  // Initialize auth once on component mount
  useEffect(() => {
    setupAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        // Fixed: Call hasRole with the role and immediately pass in the user
        hasRole: (role: UserRole | UserRole[]) => hasRole(role)(user),
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
