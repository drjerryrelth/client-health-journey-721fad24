
import { CheckIn } from '@/types';

// Define the context type
export interface ClientDataContextType {
  checkIns: any[];
  loading: boolean;
  programName: string;
  clientStartDate: string;
  waterProgress: number;
  weightTrend: 'up' | 'down' | 'neutral';
  calculateProgress: () => number;
}
