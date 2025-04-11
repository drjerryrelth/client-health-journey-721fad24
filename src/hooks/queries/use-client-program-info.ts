import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';

type ProgramInfo = {
  programType: string | null;
  programCategory: string | null;
  loading: boolean;
};

export function useClientProgramInfo(): ProgramInfo {
  const { user } = useAuth();
  const [programType, setProgramType] = useState<string | null>(null);
  const [programCategory, setProgramCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgramInfo = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        // First get the client data
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('program_id')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (clientError) {
          console.error("Error fetching client data:", clientError);
          return;
        }
        
        if (!clientData?.program_id) {
          setLoading(false);
          return;
        }
        
        // Then get the program data
        const { data: programData, error: programError } = await supabase
          .from('programs')
          .select('type')
          .eq('id', clientData.program_id)
          .maybeSingle();
            
        if (programError) {
          console.error("Error fetching program data:", programError);
          return;
        }
        
        if (programData) {
          setProgramType(programData.type);
          // Since program_category column doesn't exist, we'll set it to null
          setProgramCategory(null);
        }
      } catch (error) {
        console.error("Error fetching program info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramInfo();
  }, [user?.id]);

  return {
    programType,
    programCategory,
    loading
  };
}
