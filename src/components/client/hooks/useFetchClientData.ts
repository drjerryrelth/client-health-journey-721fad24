
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import CheckInService from '@/services/check-in-service';
import { toast } from 'sonner';
import { isDemoEmail } from '@/services/auth/demo';
import { getWeightTrend, calculateWaterProgress } from '../utils/clientDataCalculations';

export const useFetchClientData = () => {
  const { user } = useAuth();
  const [clientId, setClientId] = useState<string | null>(null);
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [programName, setProgramName] = useState("");
  const [clientStartDate, setClientStartDate] = useState("");
  const [waterProgress, setWaterProgress] = useState(0);
  const [weightTrend, setWeightTrend] = useState<'up' | 'down' | 'neutral'>('neutral');
  const [hasError, setHasError] = useState(false);

  // First, get the client ID associated with the logged-in user
  useEffect(() => {
    const fetchClientId = async () => {
      if (!user) {
        console.log('ClientDataProvider: No user, skipping data fetch');
        setLoading(false);
        return;
      }
      
      console.log('ClientDataProvider: Fetching client ID for user', user.id);
      
      // Check if this is a demo client account first
      const isDemo = user.email && isDemoEmail(user.email);
      if (isDemo) {
        console.log('Demo user detected, using demo client data');
        // Set some demo data values
        setCheckIns([{
          id: 'demo-1',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          waterIntake: 5,
          weight: 150
        }, {
          id: 'demo-2',
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          waterIntake: 4,
          weight: 152
        }]);
        setProgramName('Demo Program');
        setClientStartDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString());
        setWaterProgress(62.5);
        setWeightTrend('down');
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('id')
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          console.error("Error fetching client ID:", error);
          // For regular users who don't have a client record yet
          setHasError(true);
          toast.error('Could not load client data. Please try again later.');
          setLoading(false);
          return;
        }
        
        if (data) {
          console.log('ClientDataProvider: Found client ID', data.id);
          setClientId(data.id);
        } else {
          console.log('ClientDataProvider: No client ID found for user', user.id);
          // For demo purposes, still show the UI without real data
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching client ID:", error);
        setHasError(true);
        setLoading(false);
      }
    };
    
    fetchClientId();
  }, [user]);
  
  // Now fetch client data using the client ID
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (!clientId) return;
        
        console.log('ClientDataProvider: Fetching client data for client', clientId);
        
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
        
        if (clientError) {
          console.error("Error fetching client data:", clientError);
          setHasError(true);
          toast.error('Could not load client details. Using sample data instead.');
          
          // Use sample data for demo purposes
          setProgramName('Sample Program');
          setClientStartDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString());
          
          setLoading(false);
          return;
        }
        
        if (clientData) {
          console.log('ClientDataProvider: Found client data', clientData);
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
            console.log('ClientDataProvider: Fetching check-ins for client', clientData.id);
            const checkInsData = await CheckInService.getClientCheckIns(clientData.id);
            
            if (checkInsData && checkInsData.length > 0) {
              console.log('ClientDataProvider: Found check-ins', checkInsData.length);
              setCheckIns(checkInsData);
              
              // Calculate water progress from latest check-in
              const latestCheckIn = checkInsData[0];
              if (latestCheckIn.waterIntake) {
                const waterIntake = latestCheckIn.waterIntake;
                const waterTarget = 8; // 8 glasses as default target
                setWaterProgress(calculateWaterProgress(waterIntake, waterTarget));
              }
              
              // Calculate weight trend
              setWeightTrend(getWeightTrend(checkInsData));
            } else {
              console.log('ClientDataProvider: No check-ins found for client', clientData.id);
            }
          } catch (checkInsError) {
            console.error("Error fetching check-ins:", checkInsError);
            // Continue without check-ins data
          }
        }
        
      } catch (error) {
        console.error("Error fetching client data:", error);
        setHasError(true);
        toast.error('An error occurred while loading client data.');
      } finally {
        setLoading(false);
      }
    };
    
    if (clientId) {
      fetchClientData();
    }
  }, [clientId]);

  return {
    clientId,
    checkIns,
    loading,
    programName,
    clientStartDate,
    waterProgress,
    weightTrend,
    hasError,
    setHasError
  };
};
