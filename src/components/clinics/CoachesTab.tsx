
import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { Coach } from '@/services/coaches';
import CoachTabHeader from './coaches/CoachTabHeader';
import CoachesListContainer from './coaches/CoachesListContainer';
import { useCoachTabActions } from './coaches/useCoachTabActions';

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
  isRefreshing = false,
  setIsRefreshing
}: CoachesTabProps) => {
  // Use extracted hook for action handling
  const { 
    isActionPending,
    handleAddCoach,
    handleEditCoach,
    handleDeleteCoach 
  } = useCoachTabActions({
    isRefreshing,
    onAddCoach,
    onEditCoach,
    onDeleteCoach
  });

  return (
    <Card>
      <CardHeader>
        <CoachTabHeader 
          clinicName={clinicName}
          onAddCoach={handleAddCoach}
          isDisabled={isRefreshing || isActionPending}
          isLoading={isRefreshing}
        />
      </CardHeader>
      
      <CoachesListContainer 
        clinicId={clinicId}
        onEdit={handleEditCoach}
        onDelete={handleDeleteCoach}
        refreshTrigger={refreshTrigger}
        isRefreshing={isRefreshing}
        setIsRefreshing={setIsRefreshing}
      />
    </Card>
  );
};

export default CoachesTab;
