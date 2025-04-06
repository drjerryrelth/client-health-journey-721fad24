
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';

// Default context value
const defaultValue: AuthContextType = {
  user: null,
  supabaseUser: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false, // Return false by default
  logout: async () => {},
  hasRole: () => false,
  signUp: async () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultValue);

export const useAuth = () => useContext(AuthContext);
