
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FoodPrepReminder from './FoodPrepReminder';

const ChiroThinGuidelines: React.FC = () => {
  return (
    <>
      <FoodPrepReminder />
      <Card className="mb-4 border-blue-300 bg-blue-50">
        <CardHeader className="py-3 pb-1">
          <CardTitle className="text-sm text-blue-800">ChiroThin Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="py-2 text-sm text-blue-700">
          <ul className="list-disc pl-5 space-y-1">
            <li>4 oz protein</li>
            <li>4 oz fruit</li>
            <li>4 oz vegetables</li>
          </ul>
        </CardContent>
      </Card>
    </>
  );
};

export default ChiroThinGuidelines;
