
import { ProfileRow, ClientRow, ProgramRow, SupplementRow, CheckInRow, ClinicRow } from './database';

export type UserRole = 'admin' | 'coach' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clinicId?: string;
}

export type Client = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  programId?: string;
  startDate: string;
  lastCheckIn?: string;
  notes?: string;
  profileImage?: string;
  clinicId: string;
};

export type Program = {
  id: string;
  name: string;
  description: string;
  duration: number; // in days
  type: 'practice_naturals' | 'keto' | 'custom';
  supplements: Supplement[];
  checkInFrequency: 'daily' | 'weekly';
  clinicId: string;
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
  waterIntake?: number;
  meals?: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
    snacks?: string;
  };
  supplementsTaken?: string[];
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
  userId: dbClient.user_id || '',
  name: dbClient.name,
  email: dbClient.email,
  phone: dbClient.phone || undefined,
  programId: dbClient.program_id || undefined,
  startDate: dbClient.start_date,
  lastCheckIn: dbClient.last_check_in || undefined,
  notes: dbClient.notes || undefined,
  profileImage: dbClient.profile_image || undefined,
  clinicId: dbClient.clinic_id,
});

export const mapClientToDbClient = (client: Omit<Client, 'id'>): Omit<ClientRow, 'id' | 'created_at'> => ({
  user_id: client.userId || null,
  name: client.name,
  email: client.email,
  phone: client.phone || null,
  program_id: client.programId || null,
  start_date: client.startDate,
  last_check_in: client.lastCheckIn || null,
  notes: client.notes || null,
  profile_image: client.profileImage || null,
  clinic_id: client.clinicId,
});

// Add mapping functions for Program and Supplement
export const mapDbProgramToProgram = (dbProgram: ProgramRow, supplements: SupplementRow[] = []): Program => ({
  id: dbProgram.id,
  name: dbProgram.name,
  description: dbProgram.description,
  duration: dbProgram.duration,
  type: dbProgram.type as 'practice_naturals' | 'keto' | 'custom',
  checkInFrequency: dbProgram.check_in_frequency as 'daily' | 'weekly',
  clinicId: dbProgram.clinic_id,
  supplements: supplements.map(mapDbSupplementToSupplement),
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
