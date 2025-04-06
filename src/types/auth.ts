
import { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'super_admin' | 'clinic_admin' | 'coach' | 'client';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clinicId: string | null;
  avatarUrl?: string | null;
  phone?: string | null; // Add phone property
}

export interface AuthContextType {
  user: UserData | null;
  supabaseUser: SupabaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  signUp: (email: string, password: string, userData: { full_name: string; role: string }) => Promise<void>;
}
