
import React from 'react';
import { TableBody } from "@/components/ui/table";
import { Coach } from '@/services/coaches';
import CoachRow from './CoachRow';
import EmptyCoachList from './EmptyCoachList';

interface CoachListBodyProps {
  coaches: Coach[];
  getClinicName: (clinicId: string) => string;
  onEdit?: (coach: Coach) => void;
  onDelete?: (coach: Coach) => void;
}

const CoachListBody: React.FC<CoachListBodyProps> = ({ coaches, getClinicName, onEdit, onDelete }) => {
  const showActions = !!onEdit || !!onDelete;
  const colSpan = showActions ? 7 : 6;
  
  return (
    <TableBody>
      {coaches.length > 0 ? (
        coaches.map((coach) => (
          <CoachRow 
            key={coach.id}
            coach={coach}
            getClinicName={getClinicName}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      ) : (
        <EmptyCoachList colSpan={colSpan} />
      )}
    </TableBody>
  );
};

export default CoachListBody;
