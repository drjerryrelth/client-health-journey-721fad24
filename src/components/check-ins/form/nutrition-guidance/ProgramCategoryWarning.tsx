
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const ProgramCategoryWarning: React.FC = () => {
  return (
    <Card className="mb-4 border-yellow-300 bg-yellow-50">
      <CardContent className="py-4">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
          <p className="text-sm text-yellow-800">
            No program category assigned. Please contact your coach for meal portion guidelines.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramCategoryWarning;
