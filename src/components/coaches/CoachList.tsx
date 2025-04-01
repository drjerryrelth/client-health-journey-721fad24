
import React from 'react';
import { Table } from "@/components/ui/table";
import CoachListHeader from './list/CoachListHeader';
import CoachListBody from './list/CoachListBody';
import CoachListLoader from './list/CoachListLoader';
import { useClinicNames } from './list/useClinicNames';
import { Coach } from '@/services/coaches';

interface CoachListProps {
  coaches: Coach[];
  loading?: boolean;
  error?: string | null;
  onEdit?: (coach: Coach) => void;
  onDelete?: (coach: Coach) => void;
  onResetPassword?: (coach: Coach) => void;
  onRetry?: () => void;
}

const CoachList: React.FC<CoachListProps> = ({ 
  coaches, 
  loading = false, 
  error = null,
  onEdit,
  onDelete,
  onResetPassword,
  onRetry
}) => {
  const { getClinicName } = useClinicNames();
  
  if (loading) {
    return <CoachListLoader />;
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <CoachListHeader showActions={!!(onEdit || onDelete || onResetPassword)} />
        <CoachListBody 
          coaches={coaches} 
          getClinicName={getClinicName}
          onEdit={onEdit}
          onDelete={onDelete}
          onResetPassword={onResetPassword}
          error={error}
          onRetry={onRetry}
          isLoading={loading}
        />
      </Table>
    </div>
  );
};

export default CoachList;
