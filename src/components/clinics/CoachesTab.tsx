
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import CoachList from '@/components/coaches/CoachList';
import { Coach } from '@/services/coaches';

interface CoachesTabProps {
  clinicName: string;
  clinicId: string;
  onAddCoach: () => void;
  refreshTrigger: number;
  onEditCoach: (coach: Coach) => void;
  onDeleteCoach: (coach: Coach) => void;
}

const CoachesTab = ({ 
  clinicName, 
  clinicId, 
  onAddCoach, 
  refreshTrigger,
  onEditCoach,
  onDeleteCoach
}: CoachesTabProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Coaches at {clinicName}</CardTitle>
        <Button 
          onClick={onAddCoach} 
          className="flex items-center gap-2"
          disabled={isRefreshing}
        >
          <UserPlus size={18} />
          <span>Add Coach</span>
        </Button>
      </CardHeader>
      <CardContent>
        <CoachList 
          clinicId={clinicId} 
          onEdit={onEditCoach}
          onDelete={onDeleteCoach}
          refreshTrigger={refreshTrigger}
          isRefreshing={isRefreshing}
          setIsRefreshing={setIsRefreshing}
        />
      </CardContent>
    </Card>
  );
};

export default CoachesTab;
