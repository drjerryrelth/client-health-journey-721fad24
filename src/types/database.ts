
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
  sleep_hours?: number; // Add this line
  water_intake?: number;
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  snacks?: string;
  notes?: string;
}
