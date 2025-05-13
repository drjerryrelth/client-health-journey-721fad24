
import { createContext, useContext } from 'react';

type ClientDataContextType = {
  clientId?: string | null;
  checkIns: any[];
  loading: boolean;
  programName: string;
  clientStartDate: string;
  waterProgress: number;
  weightTrend: 'up' | 'down' | 'neutral';
  calculateProgress: () => number;
};

export const ClientDataContext = createContext<ClientDataContextType>({
  clientId: null,
  checkIns: [],
  loading: true,
  programName: '',
  clientStartDate: '',
  waterProgress: 0,
  weightTrend: 'neutral',
  calculateProgress: () => 0,
});

export const useClientData = () => useContext(ClientDataContext);
