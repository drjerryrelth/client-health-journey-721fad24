
import { Database } from "@/integrations/supabase/types";

// Re-export the Database type
export type { Database } from "@/integrations/supabase/types";

// Export specific table types for easier access in components
export type TablesInsert<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert'];
  
export type TablesRow<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];
  
export type TablesUpdate<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update'];

// Create specific types for each table
export type ProfileRow = TablesRow<'profiles'>;
export type ProfileInsert = TablesInsert<'profiles'>;
export type ProfileUpdate = TablesUpdate<'profiles'>;

export type ClientRow = TablesRow<'clients'>;
export type ClientInsert = TablesInsert<'clients'>;
export type ClientUpdate = TablesUpdate<'clients'>;

export type ProgramRow = TablesRow<'programs'>;
export type ProgramInsert = TablesInsert<'programs'>;
export type ProgramUpdate = TablesUpdate<'programs'>;

export type SupplementRow = TablesRow<'supplements'>;
export type SupplementInsert = TablesInsert<'supplements'>;
export type SupplementUpdate = TablesUpdate<'supplements'>;

export type CheckInRow = TablesRow<'check_ins'>;
export type CheckInInsert = TablesInsert<'check_ins'>;
export type CheckInUpdate = TablesUpdate<'check_ins'>;

export type CheckInPhotoRow = TablesRow<'check_in_photos'>;
export type CheckInPhotoInsert = TablesInsert<'check_in_photos'>;
export type CheckInPhotoUpdate = TablesUpdate<'check_in_photos'>;

export type ClinicRow = TablesRow<'clinics'>;
export type ClinicInsert = TablesInsert<'clinics'>;
export type ClinicUpdate = TablesUpdate<'clinics'>;
