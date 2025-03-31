
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';

type ProgramDetails = {
  programType: string | null;
  programCategory: string | null;
  supplements: any[];
  loading: boolean;
};

export function useProgramDetails(): ProgramDetails {
  const { user } = useAuth();
  const [programType, setProgramType] = useState<string | null>(null);
  const [programCategory, setProgramCategory] = useState<string | null>(null);
  const [supplements, setSupplements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchClientProgramDetails = async () => {
      if (!user?.id) return;
      
      try {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('id, program_id, program_category')
          .eq('user_id', user.id)
          .single();
          
        if (clientError) throw clientError;
        
        if (clientData && clientData.program_id) {
          const { data: programData, error: programError } = await supabase
            .from('programs')
            .select('type, id')
            .eq('id', clientData.program_id)
            .single();
            
          if (programError) throw programError;
          
          if (programData) {
            setProgramType(programData.type);
            setProgramCategory(clientData.program_category);
            
            const { data: supplementsData, error: supplementsError } = await supabase
              .from('supplements')
              .select('*')
              .eq('program_id', programData.id);
              
            if (supplementsError) throw supplementsError;
            
            if (supplementsData) {
              setSupplements(supplementsData);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching program details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClientProgramDetails();
  }, [user?.id]);

  return {
    programType,
    programCategory,
    supplements,
    loading
  };
}
