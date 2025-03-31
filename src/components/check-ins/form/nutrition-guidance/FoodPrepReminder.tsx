
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FoodPrepReminder: React.FC = () => {
  return (
    <Card className="mb-4 border-amber-300 bg-amber-50">
      <CardHeader className="py-3 pb-1">
        <CardTitle className="text-sm text-amber-800">Food Prep Reminder</CardTitle>
      </CardHeader>
      <CardContent className="py-2 text-sm text-amber-700">
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Avoid cooking oils</strong> - use dry rubs and seasonings instead</li>
          <li>For salads, use only 1 tbsp of olive or avocado oil</li>
          <li>No dairy-based dressings allowed</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default FoodPrepReminder;
