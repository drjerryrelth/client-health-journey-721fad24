
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RecentCheckIns from '@/components/check-ins/RecentCheckIns';
import CoachCheckIns from '@/components/check-ins/CoachCheckIns';
import { useAuth } from '@/context/AuthContext';

const CheckInsPage = () => {
  const { hasRole } = useAuth();
  const isCoach = hasRole('coach');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Check-ins</h1>
        <p className="text-gray-500">
          {isCoach 
            ? "Review your clients' check-ins" 
            : "Review all client check-ins"}
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {isCoach ? 'Your Clients\' Check-ins' : 'Recent Check-ins'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isCoach ? <CoachCheckIns /> : <RecentCheckIns />}
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckInsPage;
