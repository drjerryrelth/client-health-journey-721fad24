
import React, { createContext, useContext } from 'react';
import { ClientDataContextType } from '../types';

// Create the context with default values
export const ClientDataContext = createContext<ClientDataContextType>({
  checkIns: [],
  loading: true,
  programName: "",
  clientStartDate: "",
  waterProgress: 0,
  weightTrend: 'neutral',
  calculateProgress: () => 0,
});

// Hook to use the context
export const useClientData = () => useContext(ClientDataContext);
