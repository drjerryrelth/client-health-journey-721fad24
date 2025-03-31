
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PracticeNaturalsGuidelineProps {
  category: string;
  mealType: string;
  guidelines: string[];
  title?: string;
}

const PracticeNaturalsGuideline: React.FC<PracticeNaturalsGuidelineProps> = ({ 
  category, 
  mealType, 
  guidelines,
  title
}) => {
  const displayTitle = title || `Category ${category} - ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`;
  
  return (
    <Card className="mb-4 border-blue-300 bg-blue-50">
      <CardHeader className="py-3 pb-1">
        <CardTitle className="text-sm text-blue-800">Practice Naturals™ {displayTitle}</CardTitle>
      </CardHeader>
      <CardContent className="py-2 text-sm text-blue-700">
        <ul className="list-disc pl-5 space-y-1">
          {guidelines.map((guideline, index) => (
            <li key={index}>{guideline}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PracticeNaturalsGuideline;
