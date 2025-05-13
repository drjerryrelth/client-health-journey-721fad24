
import { User as SupabaseUser } from '@supabase/supabase-js';
import { UserRole } from '@/types';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clinicId?: string;
  phone?: string; // Added phone as an optional property
  coach_id?: string; // Added coach_id for coach users
  client_id?: string; // Added client_id for client users
}

export interface AuthContextType {
  user: UserData | null;
  supabaseUser: SupabaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  signUp: (email: string, password: string, userData: { full_name: string; role: string }) => Promise<void>;
}
