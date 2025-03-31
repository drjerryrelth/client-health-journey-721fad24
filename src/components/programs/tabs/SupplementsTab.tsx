
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import SupplementsList from '../supplements/SupplementsList';

interface SupplementsTabProps {
  supplements: any[];
  programType: string | null;
}

const SupplementsTab: React.FC<SupplementsTabProps> = ({ supplements, programType }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Program Supplements</CardTitle>
      </CardHeader>
      <CardContent>
        <SupplementsList supplements={supplements} programType={programType} />
      </CardContent>
    </Card>
  );
};

export default SupplementsTab;
