
export type UserRole = 'admin' | 'coach' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clinicId?: string;
}

export interface Client {
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
}

export interface Program {
  id: string;
  name: string;
  description: string;
  duration: number; // in days
  type: 'practice_naturals' | 'keto' | 'custom';
  supplements: Supplement[];
  checkInFrequency: 'daily' | 'weekly';
  clinicId: string;
}

export interface Supplement {
  id: string;
  name: string;
  description: string;
  dosage: string;
  frequency: string;
  timeOfDay?: string;
}

export interface CheckIn {
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
}

export interface Clinic {
  id: string;
  name: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
}
