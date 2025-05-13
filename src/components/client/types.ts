
import { CheckIn } from '@/types';

// Define the context type
export interface ClientDataContextType {
  clientId?: string | null;
  checkIns: CheckIn[];
  loading: boolean;
  programName: string;
  clientStartDate: string;
  waterProgress: number;
  weightTrend: 'up' | 'down' | 'neutral';
  calculateProgress: () => number;
}
