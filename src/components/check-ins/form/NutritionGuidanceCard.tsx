
import React from 'react';
import { useClientProgramInfo } from '@/hooks/queries/use-client-program-info';
import { getProgramGuidelines } from './nutrition-guidance/getProgramGuidelines';

interface NutritionGuidanceCardProps {
  mealType: 'breakfast' | 'lunch' | 'dinner';
}

const NutritionGuidanceCard: React.FC<NutritionGuidanceCardProps> = ({ mealType }) => {
  const { programType, programCategory, loading } = useClientProgramInfo();
  
  if (loading || !programType) {
    return null;
  }

  return getProgramGuidelines({ programType, programCategory, mealType });
};

export default NutritionGuidanceCard;
