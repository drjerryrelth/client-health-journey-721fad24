
import React from 'react';
import ChiroThinBreakfastWarning from './ChiroThinBreakfastWarning';
import ChiroThinGuidelines from './ChiroThinGuidelines';
import ProgramCategoryWarning from './ProgramCategoryWarning';
import PracticeNaturalsGuideline from './PracticeNaturalsGuideline';
import FoodPrepReminder from './FoodPrepReminder';

interface GetProgramGuidelinesProps {
  programType: string | null;
  programCategory: string | null;
  mealType: 'breakfast' | 'lunch' | 'dinner';
}

export const getProgramGuidelines = ({ 
  programType, 
  programCategory, 
  mealType 
}: GetProgramGuidelinesProps): React.ReactNode => {
  
  // ChiroThin breakfast warning
  if (programType === 'chirothin' && mealType === 'breakfast') {
    return <ChiroThinBreakfastWarning />;
  }
  
  // ChiroThin lunch/dinner
  if (programType === 'chirothin' && (mealType === 'lunch' || mealType === 'dinner')) {
    return <ChiroThinGuidelines />;
  }
  
  // Practice Naturals
  if (programType === 'practice_naturals') {
    if (!programCategory) {
      return <ProgramCategoryWarning />;
    }
    
    // Category A
    if (programCategory === 'A') {
      if (mealType === 'breakfast') {
        return (
          <>
            <FoodPrepReminder />
            <PracticeNaturalsGuideline 
              category="A" 
              mealType="Breakfast" 
              guidelines={[
                '4 oz protein, OR', 
                '20g protein in a vegan protein shake'
              ]} 
            />
          </>
        );
      }
      
      if (mealType === 'lunch' || mealType === 'dinner') {
        return (
          <>
            <FoodPrepReminder />
            <PracticeNaturalsGuideline 
              category="A" 
              mealType={mealType} 
              guidelines={[
                '4 oz protein', 
                '2 oz fruit', 
                '4 oz vegetables'
              ]} 
            />
          </>
        );
      }
    }
    
    // Category B
    if (programCategory === 'B') {
      if (mealType === 'breakfast') {
        return (
          <>
            <FoodPrepReminder />
            <PracticeNaturalsGuideline 
              category="B" 
              mealType="Breakfast" 
              guidelines={[
                '5 oz protein, OR', 
                '20g protein in a vegan protein shake'
              ]} 
            />
          </>
        );
      }
      
      if (mealType === 'lunch') {
        return (
          <>
            <FoodPrepReminder />
            <PracticeNaturalsGuideline 
              category="B" 
              mealType="Lunch" 
              guidelines={[
                '4 oz protein', 
                '3 oz fruit', 
                '6 oz vegetables'
              ]} 
            />
          </>
        );
      }
      
      if (mealType === 'dinner') {
        return (
          <>
            <FoodPrepReminder />
            <PracticeNaturalsGuideline 
              category="B" 
              mealType="Dinner" 
              guidelines={[
                '4 oz protein', 
                '3 oz fruit', 
                '4 oz vegetables'
              ]} 
            />
          </>
        );
      }
    }
    
    // Category C
    if (programCategory === 'C') {
      if (mealType === 'breakfast') {
        return (
          <>
            <FoodPrepReminder />
            <PracticeNaturalsGuideline 
              category="C" 
              mealType="Breakfast" 
              guidelines={[
                '5 oz protein, OR', 
                '20g protein in a vegan protein shake'
              ]} 
            />
          </>
        );
      }
      
      if (mealType === 'lunch' || mealType === 'dinner') {
        return (
          <>
            <FoodPrepReminder />
            <PracticeNaturalsGuideline 
              category="C" 
              mealType={mealType} 
              guidelines={[
                '4 oz protein', 
                '4 oz fruit', 
                '6 oz vegetables'
              ]} 
            />
          </>
        );
      }
    }
  }
  
  return null;
};
