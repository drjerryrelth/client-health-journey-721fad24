
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

  // Auth methods - fix the type issue here
  const { login, logout, signUp, hasRole: hasRoleFn } = useAuthMethods({
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
        hasRole: (role: UserRole | UserRole[]) => hasRoleFn(role),
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
