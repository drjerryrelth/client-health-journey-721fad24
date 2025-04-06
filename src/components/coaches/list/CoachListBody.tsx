
import React from 'react';
import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Coach } from '@/services/coaches';
import CoachRow from './CoachRow';
import EmptyCoachList from './EmptyCoachList';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from 'lucide-react';

interface CoachListBodyProps {
  coaches: Coach[];
  getClinicName: (clinicId: string) => string;
  onEdit?: (coach: Coach) => void;
  onDelete?: (coach: Coach) => void;
  onResetPassword?: (coach: Coach) => void;
  error?: string | null;
  onRetry?: () => void;
  isLoading?: boolean;
}

const CoachListBody: React.FC<CoachListBodyProps> = ({ 
  coaches, 
  getClinicName, 
  onEdit, 
  onDelete,
  onResetPassword,
  error,
  onRetry,
  isLoading = false
}) => {
  const showActions = !!onEdit || !!onDelete || !!onResetPassword;
  const colSpan = showActions ? 7 : 6;
  
  // Handle loading state with a subtle indicator
  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={colSpan} className="h-24">
            <div className="flex flex-col justify-center items-center h-full space-y-2">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Loading coaches...</p>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  
  // Handle error state with retry button
  if (error) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={colSpan} className="p-4">
            <Alert variant="destructive" className="mb-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                {error}
              </AlertDescription>
            </Alert>
            
            {onRetry && (
              <div className="flex justify-center mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onRetry} 
                  className="flex items-center gap-1"
                >
                  <RefreshCw size={14} />
                  <span>Try Again</span>
                </Button>
              </div>
            )}
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
          onResetPassword={onResetPassword}
        />
      ))}
    </TableBody>
  );
};

export default CoachListBody;
