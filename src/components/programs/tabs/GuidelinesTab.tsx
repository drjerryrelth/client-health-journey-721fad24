
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ProgramGuidelines from '@/components/programs/ProgramGuidelines';

interface GuidelinesTabProps {
  loading: boolean;
  programType: string | null;
  programCategory: string | null;
}

const GuidelinesTab: React.FC<GuidelinesTabProps> = ({ loading, programType, programCategory }) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-gray-500">Loading program guidelines...</p>
        </CardContent>
      </Card>
    );
  }

  return <ProgramGuidelines programType={programType || ''} category={programCategory} />;
};

export default GuidelinesTab;
