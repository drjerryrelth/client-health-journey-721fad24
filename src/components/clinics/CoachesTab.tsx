
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Loader2 } from 'lucide-react';
import CoachList from '@/components/coaches/CoachList';
import { Coach } from '@/services/coaches';

interface CoachesTabProps {
  clinicName: string;
  clinicId: string;
  onAddCoach: () => void;
  refreshTrigger: number;
  onEditCoach: (coach: Coach) => void;
  onDeleteCoach: (coach: Coach) => void;
  isRefreshing?: boolean;
  setIsRefreshing?: (isRefreshing: boolean) => void;
}

const CoachesTab = ({ 
  clinicName, 
  clinicId, 
  onAddCoach, 
  refreshTrigger,
  onEditCoach,
  onDeleteCoach,
  isRefreshing,
  setIsRefreshing
}: CoachesTabProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Coaches at {clinicName}</CardTitle>
        <Button 
          onClick={onAddCoach} 
          className="flex items-center gap-2"
          disabled={isRefreshing}
        >
          {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus size={18} />}
          <span>{isRefreshing ? "Processing..." : "Add Coach"}</span>
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
