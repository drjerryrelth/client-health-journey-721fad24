
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { getProgramGuidelines } from './nutrition-guidance/getProgramGuidelines';

interface NutritionGuidanceCardProps {
  mealType: 'breakfast' | 'lunch' | 'dinner';
}

const NutritionGuidanceCard: React.FC<NutritionGuidanceCardProps> = ({ mealType }) => {
  const { user } = useAuth();
  const [programType, setProgramType] = useState<string | null>(null);
  const [programCategory, setProgramCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgramInfo = async () => {
      if (!user?.id) return;
      
      try {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('program_id, program_category')
          .eq('user_id', user.id)
          .single();
          
        if (clientError) throw clientError;
        
        if (clientData?.program_id) {
          const { data: programData, error: programError } = await supabase
            .from('programs')
            .select('type')
            .eq('id', clientData.program_id)
            .single();
            
          if (programError) throw programError;
          
          if (programData) {
            setProgramType(programData.type);
            setProgramCategory(clientData.program_category);
          }
        }
      } catch (error) {
        console.error("Error fetching program info:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProgramInfo();
  }, [user?.id]);
  
  if (loading || !programType) {
    return null;
  }

  return getProgramGuidelines({ programType, programCategory, mealType });
};

export default NutritionGuidanceCard;
