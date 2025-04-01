
import React from 'react';
import { CardContent } from '@/components/ui/card';
import CoachList from '@/components/coaches/CoachList';
import { Coach } from '@/services/coaches';

interface CoachesListContainerProps {
  clinicId: string;
  onEdit: (coach: Coach) => void;
  onDelete: (coach: Coach) => void;
  refreshTrigger: number;
  isRefreshing?: boolean;
  setIsRefreshing?: (isRefreshing: boolean) => void;
}

const CoachesListContainer: React.FC<CoachesListContainerProps> = ({
  clinicId,
  onEdit,
  onDelete,
  refreshTrigger,
  isRefreshing,
  setIsRefreshing
}) => {
  return (
    <CardContent>
      <CoachList 
        clinicId={clinicId} 
        onEdit={onEdit}
        onDelete={onDelete}
        refreshTrigger={refreshTrigger}
        isRefreshing={isRefreshing}
        setIsRefreshing={setIsRefreshing}
      />
    </CardContent>
  );
};

export default CoachesListContainer;
