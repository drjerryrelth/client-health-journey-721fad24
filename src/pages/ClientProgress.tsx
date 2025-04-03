
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClientDataProvider from '@/components/client/ClientDataProvider';
import ProgressChart from '@/components/progress/ProgressChart';
import { Separator } from '@/components/ui/separator';
import { CheckIn } from '@/types';
import { ClientDataContext } from '@/components/client/context/ClientDataContext';

const ClientProgress = () => {
  return (
    <ClientDataProvider>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">My Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ProgressChart />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Measurement History</CardTitle>
          </CardHeader>
          <CardContent>
            <CheckInHistoryTable />
          </CardContent>
        </Card>
      </div>
    </ClientDataProvider>
  );
};

// Component to display a table of check-in history
const CheckInHistoryTable = () => {
  // Properly use the context type
  const { checkIns } = React.useContext(ClientDataContext);
  
  if (checkIns.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No check-ins recorded yet. Start tracking your progress!
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-2">Date</th>
            <th className="text-left py-3 px-2">Weight</th>
            <th className="text-left py-3 px-2">Waist</th>
            <th className="text-left py-3 px-2">Energy</th>
            <th className="text-left py-3 px-2">Mood</th>
            <th className="text-left py-3 px-2">Sleep</th>
          </tr>
        </thead>
        <tbody>
          {checkIns.map((checkIn) => (
            <tr key={checkIn.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-2">{new Date(checkIn.date).toLocaleDateString()}</td>
              <td className="py-3 px-2">{checkIn.weight ? `${checkIn.weight} lbs` : '-'}</td>
              <td className="py-3 px-2">{checkIn.waist ? `${checkIn.waist} in` : '-'}</td>
              <td className="py-3 px-2">{checkIn.energy_score ? `${checkIn.energy_score}/10` : '-'}</td>
              <td className="py-3 px-2">{checkIn.mood_score ? `${checkIn.mood_score}/10` : '-'}</td>
              <td className="py-3 px-2">{checkIn.sleep_hours ? `${checkIn.sleep_hours} hrs` : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientProgress;
