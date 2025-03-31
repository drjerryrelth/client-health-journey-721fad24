
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ChiroThinGuidelines from './guidelines/ChiroThinGuidelines';
import PracticeNaturalsGuidelines from './guidelines/PracticeNaturalsGuidelines';
import GeneralGuidelines from './guidelines/GeneralGuidelines';

interface ProgramGuidelinesProps {
  programType: string;
  category?: string | null;
}

const ProgramGuidelines: React.FC<ProgramGuidelinesProps> = ({ programType, category }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Program Guidelines</CardTitle>
      </CardHeader>
      <CardContent>
        {programType === 'practice_naturals' && (
          <PracticeNaturalsGuidelines category={category} />
        )}
        
        {programType === 'chirothin' && (
          <ChiroThinGuidelines />
        )}
        
        <Separator className="my-4" />
        
        <GeneralGuidelines />
      </CardContent>
    </Card>
  );
};

export default ProgramGuidelines;
