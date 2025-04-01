
import React from 'react';
import { Table } from "@/components/ui/table";
import { Coach } from '@/services/coaches';
import CoachListHeader from './list/CoachListHeader';
import CoachListBody from './list/CoachListBody';
import CoachListLoader from './list/CoachListLoader';
import { useClinicNames } from './list/useClinicNames';
import { useCoachList } from './list/useCoachList';

interface CoachListProps {
  limit?: number;
  clinicId?: string;
  onEdit?: (coach: Coach) => void;
  onDelete?: (coach: Coach) => void;
  refreshTrigger?: number;
  isRefreshing?: boolean;
  setIsRefreshing?: (isRefreshing: boolean) => void;
}

const CoachList: React.FC<CoachListProps> = ({ 
  limit, 
  clinicId, 
  onEdit, 
  onDelete, 
  refreshTrigger = 0, 
  isRefreshing = false,
  setIsRefreshing
}) => {
  const { getClinicName } = useClinicNames();
  const { coaches, isLoading, error, refresh } = useCoachList({ 
    clinicId, 
    limit, 
    refreshTrigger, 
    setIsRefreshing 
  });
  
  const showActions = !!onEdit || !!onDelete;

  // Show custom messaging based on state
  if (isLoading && !isRefreshing) {
    return <CoachListLoader />;
  }

  return (
    <div className="overflow-x-auto relative">
      {isRefreshing && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <CoachListLoader message="Refreshing coaches..." />
        </div>
      )}
      
      <Table>
        <CoachListHeader showActions={showActions} />
        <CoachListBody 
          coaches={coaches}
          getClinicName={getClinicName}
          onEdit={onEdit}
          onDelete={onDelete}
          error={error}
          onRetry={refresh}
        />
      </Table>
    </div>
  );
};

export default CoachList;
