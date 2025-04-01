
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyCoachListProps {
  colSpan: number;
  error?: string | null;
  onRetry?: () => void;
}

const EmptyCoachList: React.FC<EmptyCoachListProps> = ({ colSpan, error, onRetry }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-8">
        {error ? (
          <div className="flex flex-col items-center text-destructive space-y-2">
            <AlertCircle size={20} />
            <div>{error}</div>
            {onRetry && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRetry} 
                className="mt-2 flex items-center gap-1"
              >
                <RefreshCw size={14} />
                <span>Retry</span>
              </Button>
            )}
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
