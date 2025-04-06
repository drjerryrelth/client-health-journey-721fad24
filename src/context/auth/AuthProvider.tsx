
import React from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types';
import { UserData, AuthContextType } from '@/types/auth';
import { AuthContext } from './AuthContext';
import { useAuthMethods } from './useAuthMethods';
import { useAuthSession } from './useAuthSession';
import { toast } from 'sonner';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use React.useState explicitly
  const [user, setUser] = React.useState<UserData | null>(null);
  const [supabaseUser, setSupabaseUser] = React.useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();
  
  // Log the current auth state for debugging
  React.useEffect(() => {
    console.log('AuthProvider state:', {
      user: user ? { 
        id: user.id,
        role: user.role,
        name: user.name,
        clinicId: user.clinicId 
      } : null,
      isAuthenticated: !!user,
      isLoading
    });
  }, [user, isLoading]);
  
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
    console.log('AuthProvider: Setting up auth...');
    const cleanup = setupAuth();
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [setupAuth]);

  // Wrap the signUp method to match the expected return type
  const wrappedSignUp = async (email: string, password: string, userData: { full_name: string; role: string }): Promise<void> => {
    await signUp(email, password, userData);
  };

  // Create a hasRoleWrapper function that takes the user from context
  const hasRoleWrapper = (roleToCheck: UserRole | UserRole[]): boolean => {
    const roleCheckFn = hasRole(roleToCheck);
    return roleCheckFn(user);
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
        hasRole: hasRoleWrapper,
        signUp: wrappedSignUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
