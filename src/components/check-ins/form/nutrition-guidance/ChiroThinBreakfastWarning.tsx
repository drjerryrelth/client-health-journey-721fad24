
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const ChiroThinBreakfastWarning: React.FC = () => {
  return (
    <Card className="mb-4 border-red-300 bg-red-50">
      <CardContent className="py-4">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">
              No breakfast allowed on the ChiroThin™ program
            </p>
            <p className="text-sm text-red-600">
              Your program does not include breakfast. Please leave this empty.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChiroThinBreakfastWarning;
