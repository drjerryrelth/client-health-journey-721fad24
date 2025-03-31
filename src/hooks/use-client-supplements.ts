
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time_of_day: string | null;
  description: string;
}

interface CheckedSupplements {
  [key: string]: boolean;
}

interface UseClientSupplementsProps {
  supplements: string;
  setSupplements: (value: string) => void;
}

export function useClientSupplements({ supplements, setSupplements }: UseClientSupplementsProps) {
  const { user } = useAuth();
  const [programType, setProgramType] = useState<string | null>(null);
  const [programSupplements, setProgramSupplements] = useState<Supplement[]>([]);
  const [checkedSupplements, setCheckedSupplements] = useState<CheckedSupplements>({});
  const [loading, setLoading] = useState(true);
  
  // Parse currently saved supplements from the string if any exist
  useEffect(() => {
    if (supplements) {
      try {
        // Try to parse as JSON if the supplements field contains JSON
        if (supplements.startsWith('[') || supplements.startsWith('{')) {
          const parsedSupplements = JSON.parse(supplements);
          if (Array.isArray(parsedSupplements)) {
            const newChecked: CheckedSupplements = {};
            parsedSupplements.forEach(id => {
              newChecked[id] = true;
            });
            setCheckedSupplements(newChecked);
          }
        }
      } catch (e) {
        // If parsing fails, we'll just use the text as is
        console.log('Using supplements as free-form text');
      }
    }
  }, [supplements]);

  // Fetch client's program info
  useEffect(() => {
    const fetchProgramSupplements = async () => {
      if (!user?.id) return;
      
      try {
        // Get client details including program
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('program_id')
          .eq('user_id', user.id)
          .single();
          
        if (clientError) throw clientError;
        
        if (clientData?.program_id) {
          // Get program type
          const { data: programData, error: programError } = await supabase
            .from('programs')
            .select('type')
            .eq('id', clientData.program_id)
            .single();
            
          if (programError) throw programError;
          
          if (programData) {
            setProgramType(programData.type);
            
            // Get supplements for this program
            const { data: supplementsData, error: supplementsError } = await supabase
              .from('supplements')
              .select('*')
              .eq('program_id', clientData.program_id);
              
            if (supplementsError) throw supplementsError;
            
            if (supplementsData) {
              setProgramSupplements(supplementsData as Supplement[]);
            } else {
              // Use default supplements based on program type if none are defined
              setProgramSupplements(getDefaultSupplements(programData.type));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching program supplements:", error);
        setProgramSupplements([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProgramSupplements();
  }, [user?.id]);
  
  // Handle supplement checkbox changes
  const handleSupplementChange = (supplementId: string, checked: boolean) => {
    const newCheckedSupplements = { ...checkedSupplements, [supplementId]: checked };
    setCheckedSupplements(newCheckedSupplements);
    
    // Save as JSON array of IDs of checked supplements
    const checkedIds = Object.keys(newCheckedSupplements).filter(id => newCheckedSupplements[id]);
    setSupplements(JSON.stringify(checkedIds));
  };

  return {
    programType,
    programSupplements,
    checkedSupplements,
    loading,
    handleSupplementChange
  };
}

// Moved from the original component to this utility function
export function getDefaultSupplements(type: string): Supplement[] {
  if (type === 'practice_naturals') {
    return [
      {
        id: 'boost',
        name: 'Boost',
        description: 'Helps boost metabolism and energy',
        dosage: '1 dropper',
        frequency: '3x daily',
        time_of_day: 'Under the tongue'
      },
      {
        id: 'burn',
        name: 'Burn (optional)',
        description: 'Supports fat metabolism',
        dosage: '1 capsule',
        frequency: 'Once daily',
        time_of_day: 'With breakfast, before 10am'
      },
      {
        id: 'cleanse',
        name: 'Cleanse',
        description: 'Supports digestive health',
        dosage: '1 capsule',
        frequency: 'Twice daily',
        time_of_day: 'With lunch and dinner'
      },
      {
        id: 'digest',
        name: 'Digest',
        description: 'Enhances nutrient absorption',
        dosage: '1 capsule',
        frequency: 'Twice daily',
        time_of_day: 'With lunch and dinner'
      },
      {
        id: 'suppress',
        name: 'Suppress',
        description: 'Helps control appetite',
        dosage: '1 capsule',
        frequency: 'Twice daily',
        time_of_day: '1-2 hours after lunch and dinner'
      },
      {
        id: 'revive',
        name: 'Reuv or Revive (optional)',
        description: 'Collagen supplement',
        dosage: 'As directed',
        frequency: 'Once daily',
        time_of_day: 'Anytime'
      },
      {
        id: 'vpro',
        name: 'V-Pro (optional)',
        description: 'Vegan protein shake',
        dosage: '1 scoop',
        frequency: 'As needed',
        time_of_day: 'Anytime'
      },
      {
        id: 'sweep',
        name: 'Sweep (optional)',
        description: 'Detoxification support',
        dosage: 'As directed by Coach',
        frequency: 'As directed',
        time_of_day: null
      }
    ];
  }
  
  if (type === 'chirothin') {
    return [
      {
        id: 'chirothin-drops',
        name: 'ChiroThin™ Drops',
        description: 'Proprietary formula for the ChiroThin™ program',
        dosage: '10 drops',
        frequency: '3x daily',
        time_of_day: 'Under the tongue'
      }
    ];
  }
  
  return [];
}
