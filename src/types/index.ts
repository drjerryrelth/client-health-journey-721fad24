import { ProfileRow, ClientRow, ProgramRow, SupplementRow, CheckInRow, ClinicRow } from './database';

// Update the UserRole type to include a specific 'clinic_admin' role
export type UserRole = 'admin' | 'super_admin' | 'coach' | 'client' | 'clinic_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clinicId?: string;
}

export type Client = {
  id: string;
  userId?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  programId?: string | null;
  programCategory?: 'A' | 'B' | 'C' | null; 
  startDate: string;
  lastCheckIn?: string | null;
  notes?: string | null;
  profileImage?: string | null;
  clinicId: string;
  coachId?: string | null;
  tempPassword?: string; // Added temp password field for newly created clients
  initialWeight?: number | null;
  weightDate?: string | null;
  goals?: string[] | null;
};

export type Program = {
  id: string;
  name: string;
  description: string;
  duration: number; // in days
  type: 'practice_naturals' | 'chirothin' | 'keto' | 'nutrition' | 'fitness' | 'custom';
  checkInFrequency: 'daily' | 'weekly';
  clinicId: string;
  clientCount?: number; // Add this field to track number of enrolled clients
  supplements: Supplement[]; // Add back the supplements property
  isGlobal?: boolean; // Add isGlobal property
};

export type Supplement = {
  id: string;
  name: string;
  description: string;
  dosage: string;
  frequency: string;
  timeOfDay?: string;
};

export type CheckIn = {
  id: string;
  clientId: string;
  date: string;
  weight?: number;
  measurements?: {
    waist?: number;
    hips?: number;
    chest?: number;
    thighs?: number;
    arms?: number;
  };
  moodScore?: number;
  energyScore?: number;
  sleepHours?: number;
  waterIntake?: number;
  meals?: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
    snacks?: string;
  };
  notes?: string;
  photos?: string[];
};

export type Clinic = {
  id: string;
  name: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
};

// Helper functions to convert between database and application types
export const mapDbClientToClient = (dbClient: ClientRow): Client => ({
  id: dbClient.id,
  userId: dbClient.user_id,
  name: dbClient.name,
  email: dbClient.email,
  phone: dbClient.phone,
  programId: dbClient.program_id,
  programCategory: dbClient.program_category as 'A' | 'B' | 'C' | null,
  startDate: dbClient.start_date,
  lastCheckIn: dbClient.last_check_in,
  notes: dbClient.notes,
  profileImage: dbClient.profile_image,
  clinicId: dbClient.clinic_id,
  coachId: dbClient.coach_id,
  initialWeight: dbClient.initial_weight,
  weightDate: dbClient.weight_date,
  goals: dbClient.goals,
});

export const mapClientToDbClient = (client: Omit<Client, 'id'> & { id?: string }): ClientRow => ({
  id: client.id || crypto.randomUUID(),
  user_id: client.userId || null,
  name: client.name,
  email: client.email,
  phone: client.phone || null,
  program_id: client.programId || null,
  program_category: client.programCategory || null,
  start_date: client.startDate,
  last_check_in: client.lastCheckIn || null,
  notes: client.notes || null,
  profile_image: client.profileImage || null,
  clinic_id: client.clinicId,
  coach_id: client.coachId || null,
  initial_weight: client.initialWeight || null,
  weight_date: client.weightDate || null,
  goals: client.goals || null,
});

export const mapDbProgramToProgram = (dbProgram: ProgramRow): Program => ({
  id: dbProgram.id,
  name: dbProgram.name,
  description: dbProgram.description,
  duration: dbProgram.duration,
  type: dbProgram.type as 'practice_naturals' | 'chirothin' | 'keto' | 'nutrition' | 'fitness' | 'custom',
  checkInFrequency: dbProgram.check_in_frequency as 'daily' | 'weekly',
  clinicId: dbProgram.clinic_id,
  supplements: [], // Initialize with empty array, will be populated separately
});

export const mapProgramToDbProgram = (program: Omit<Program, 'id' | 'supplements'>): Omit<ProgramRow, 'id' | 'created_at'> => ({
  name: program.name,
  description: program.description,
  duration: program.duration,
  type: program.type,
  check_in_frequency: program.checkInFrequency,
  clinic_id: program.clinicId,
});

export const mapDbSupplementToSupplement = (dbSupplement: SupplementRow): Supplement => ({
  id: dbSupplement.id,
  name: dbSupplement.name,
  description: dbSupplement.description,
  dosage: dbSupplement.dosage,
  frequency: dbSupplement.frequency,
  timeOfDay: dbSupplement.time_of_day || undefined,
});

export const mapSupplementToDbSupplement = (supplement: Omit<Supplement, 'id'>, programId: string): Omit<SupplementRow, 'id' | 'created_at'> => ({
  name: supplement.name,
  description: supplement.description,
  dosage: supplement.dosage,
  frequency: supplement.frequency,
  time_of_day: supplement.timeOfDay || null,
  program_id: programId,
});
