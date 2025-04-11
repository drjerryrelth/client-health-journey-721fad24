// Add the sleep_hours field to CheckInRow
export interface CheckInRow {
  id: string;
  client_id: string;
  date: string;
  created_at?: string;
  weight?: number;
  waist?: number;
  hips?: number;
  chest?: number;
  thighs?: number;
  arms?: number;
  mood_score?: number;
  energy_score?: number;
  sleep_hours?: number; // Added this field
  water_intake?: number;
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  snacks?: string;
  notes?: string;
}

// Add the missing types that were causing errors
export interface ProfileRow {
  id: string;
  full_name?: string;
  email?: string;
  role?: string;
  clinic_id?: string;
  phone?: string;
}

export interface ClientRow {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  program_id?: string;
  program_category?: string; // Added program_category field
  start_date: string;
  last_check_in?: string;
  notes?: string;
  profile_image?: string;
  clinic_id: string;
  coach_id?: string;
  created_at?: string;
  initial_weight?: number;
  weight_date?: string;
  goals?: string[];
}

export interface ProgramRow {
  id: string;
  name: string;
  description: string;
  duration: number;
  type: string;
  check_in_frequency: string;
  clinic_id: string;
  created_at?: string;
}

export interface SupplementRow {
  id: string;
  name: string;
  description: string;
  dosage: string;
  frequency: string;
  time_of_day?: string;
  program_id: string;
  created_at?: string;
}

export interface ClinicRow {
  id: string;
  name: string;
  logo?: string;
  primary_color?: string;
  secondary_color?: string;
  created_at?: string;
}

export interface Coach {
  id: string;
  name: string;
  email: string;
  phone?: string;
  clinicId: string;
  status: 'active' | 'inactive';
  clients: Client[];
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  coachId: string;
  clinicId: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Clinic {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status: 'active' | 'inactive';
  subscriptionTier?: string;
  subscriptionStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: string;
  name: string;
  description?: string;
  clinicId?: string; // null for global templates
  isTemplate: boolean;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Export Database type for use with supabase client
export type Database = {
  public: {
    Tables: {
      clients: {
        Row: ClientRow;
        Insert: Omit<ClientRow, 'id' | 'created_at'>;
        Update: Partial<Omit<ClientRow, 'id' | 'created_at'>>;
      };
      programs: {
        Row: ProgramRow;
        Insert: Omit<ProgramRow, 'id' | 'created_at'>;
        Update: Partial<Omit<ProgramRow, 'id' | 'created_at'>>;
      };
      supplements: {
        Row: SupplementRow;
        Insert: Omit<SupplementRow, 'id' | 'created_at'>;
        Update: Partial<Omit<SupplementRow, 'id' | 'created_at'>>;
      };
      check_ins: {
        Row: CheckInRow;
        Insert: Omit<CheckInRow, 'id' | 'created_at'>;
        Update: Partial<Omit<CheckInRow, 'id' | 'created_at'>>;
      };
      check_in_photos: {
        Row: {
          id: string;
          created_at?: string;
          check_in_id: string;
          photo_url: string;
          photo_type: string;
        };
        Insert: Omit<{
          id: string;
          created_at?: string;
          check_in_id: string;
          photo_url: string;
          photo_type: string;
        }, 'id' | 'created_at'>;
        Update: Partial<Omit<{
          id: string;
          created_at?: string;
          check_in_id: string;
          photo_url: string;
          photo_type: string;
        }, 'id' | 'created_at'>>;
      };
      clinics: {
        Row: ClinicRow;
        Insert: Omit<ClinicRow, 'id' | 'created_at'>;
        Update: Partial<Omit<ClinicRow, 'id' | 'created_at'>>;
      };
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, 'id'>;
        Update: Partial<Omit<ProfileRow, 'id'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};
