
import React from 'react';
import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Coach } from '@/services/coaches';
import CoachRow from './CoachRow';
import EmptyCoachList from './EmptyCoachList';
import { Loader2 } from 'lucide-react';

interface CoachListBodyProps {
  coaches: Coach[];
  getClinicName: (clinicId: string) => string;
  onEdit?: (coach: Coach) => void;
  onDelete?: (coach: Coach) => void;
  error?: string | null;
  onRetry?: () => void;
  isLoading?: boolean;
}

const CoachListBody: React.FC<CoachListBodyProps> = ({ 
  coaches, 
  getClinicName, 
  onEdit, 
  onDelete,
  error,
  onRetry,
  isLoading = false
}) => {
  const showActions = !!onEdit || !!onDelete;
  const colSpan = showActions ? 7 : 6;
  
  // Handle error state
  if (error) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={colSpan} className="p-0">
            <EmptyCoachList colSpan={colSpan} error={error} onRetry={onRetry} />
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  
  // Handle loading state with a subtle indicator
  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={colSpan} className="h-24">
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  
  // Empty state
  if (coaches.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={colSpan} className="p-0">
            <EmptyCoachList colSpan={colSpan} onRetry={onRetry} />
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  
  // Regular data display
  return (
    <TableBody>
      {coaches.map((coach) => (
        <CoachRow 
          key={coach.id}
          coach={coach}
          getClinicName={getClinicName}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </TableBody>
  );
};

export default CoachListBody;
