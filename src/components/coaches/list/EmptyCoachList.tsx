
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { AlertCircle } from 'lucide-react';

interface EmptyCoachListProps {
  colSpan: number;
  error?: string | null;
}

const EmptyCoachList: React.FC<EmptyCoachListProps> = ({ colSpan, error }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-8">
        {error ? (
          <div className="flex flex-col items-center text-destructive space-y-1">
            <AlertCircle size={20} />
            <div>{error}</div>
          </div>
        ) : (
          <div className="text-muted-foreground">
            No coaches found for this clinic
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

export default EmptyCoachList;
