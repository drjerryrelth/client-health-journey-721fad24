
import React from 'react';
import { ClientDataContext } from './context/ClientDataContext';
import { useFetchClientData } from './hooks/useFetchClientData';
import { calculateProgramProgress } from './utils/clientDataCalculations';

export const ClientDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    checkIns,
    loading,
    programName,
    clientStartDate,
    waterProgress,
    weightTrend,
    hasError
  } = useFetchClientData();
  
  // Calculate progress percentage based on start date and program duration
  const calculateProgress = () => {
    return calculateProgramProgress(clientStartDate);
  };
  
  // Provide the data and functions to child components
  const value = {
    checkIns,
    loading,
    programName,
    clientStartDate,
    waterProgress,
    weightTrend,
    calculateProgress
  };
  
  return (
    <ClientDataContext.Provider value={value}>
      {hasError && !loading ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-4">
          <p className="text-red-700">There was an error loading your data. Some features may not work correctly.</p>
        </div>
      ) : null}
      {children}
    </ClientDataContext.Provider>
  );
};

// Re-export useClientData hook for simpler imports
export { useClientData } from './context/ClientDataContext';

export default ClientDataProvider;
