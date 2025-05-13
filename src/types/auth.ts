
import { User as SupabaseUser } from '@supabase/supabase-js';
import { UserRole } from '@/types';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clinicId?: string;
  phone?: string;
  coach_id?: string;
  client_id?: string;
}

export interface AuthContextType {
  user: UserData | null;
  supabaseUser: SupabaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialAuthCheckComplete: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  signUp: (email: string, password: string, userData: { full_name: string; role: string }) => Promise<void>;
}
