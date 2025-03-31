import React, { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { CheckIn } from '@/types';
import CheckInService from '@/services/check-in-service';

// Define the context type
interface ClientDataContextType {
  checkIns: any[];
  loading: boolean;
  programName: string;
  clientStartDate: string;
  waterProgress: number;
  weightTrend: 'up' | 'down' | 'neutral';
  calculateProgress: () => number;
}

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

export const ClientDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [clientId, setClientId] = useState<string | null>(null);
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [programName, setProgramName] = useState("");
  const [clientStartDate, setClientStartDate] = useState("");
  const [waterProgress, setWaterProgress] = useState(0);
  const [weightTrend, setWeightTrend] = useState<'up' | 'down' | 'neutral'>('neutral');
  
  // First, get the client ID associated with the logged-in user
  useEffect(() => {
    const fetchClientId = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('id')
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        if (data) {
          setClientId(data.id);
        }
      } catch (error) {
        console.error("Error fetching client ID:", error);
      }
    };
    
    fetchClientId();
  }, [user]);
  
  // Now fetch client data using the client ID
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (!clientId) return;
        
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select(`
            id,
            name,
            start_date,
            program_id,
            programs:programs (name, duration)
          `)
          .eq('id', clientId)
          .single();
        
        if (clientError) throw clientError;
        
        if (clientData) {
          setClientStartDate(clientData.start_date);
          
          // Handle programs data safely to fix TypeScript errors
          if (clientData.programs) {
            // Type assertion to fix TypeScript errors
            const programsData = clientData.programs as { name?: string } | null;
            
            // Check if programsData exists and has a name property
            if (programsData && typeof programsData.name === 'string') {
              setProgramName(programsData.name);
            }
          }
          
          // Fetch check-ins for this client using the service
          try {
            const checkInsData = await CheckInService.getClientCheckIns(clientData.id);
            
            if (checkInsData && checkInsData.length > 0) {
              setCheckIns(checkInsData);
              
              // Calculate water progress from latest check-in
              const latestCheckIn = checkInsData[0];
              if (latestCheckIn.waterIntake) {
                const waterIntake = latestCheckIn.waterIntake;
                const waterTarget = 8; // 8 glasses as default target
                setWaterProgress(Math.min(100, (waterIntake / waterTarget) * 100));
              }
              
              // Calculate weight trend
              if (checkInsData.length >= 2) {
                const latest = checkInsData[0].weight;
                const previous = checkInsData[1].weight;
                
                if (latest < previous) {
                  setWeightTrend('down');
                } else if (latest > previous) {
                  setWeightTrend('up');
                } else {
                  setWeightTrend('neutral');
                }
              }
            }
          } catch (checkInsError) {
            console.error("Error fetching check-ins:", checkInsError);
          }
        }
        
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (clientId) {
      fetchClientData();
    }
  }, [clientId]);

  // Calculate progress percentage based on start date and program duration
  const calculateProgress = () => {
    if (!clientStartDate) return 0;
    
    const startDate = new Date(clientStartDate);
    const currentDate = new Date();
    const daysPassed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const programDuration = 30; // Default to 30 days if not specified
    
    const progressPercent = Math.min(100, Math.max(0, (daysPassed / programDuration) * 100));
    return Math.round(progressPercent);
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
      {children}
    </ClientDataContext.Provider>
  );
};

export default ClientDataProvider;
