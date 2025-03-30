
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RecentCheckIns from '@/components/check-ins/RecentCheckIns';

const CheckInsPage = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Check-ins</h1>
        <p className="text-gray-500">Review all client check-ins</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentCheckIns />
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckInsPage;
