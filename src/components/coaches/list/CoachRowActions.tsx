
import React from 'react';
import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Coach } from '@/services/coaches';

interface CoachRowActionsProps {
  coach: Coach;
  onEdit?: (coach: Coach) => void;
  onDelete?: (coach: Coach) => void;
  onResetPassword?: (coach: Coach) => void;
}

const CoachRowActions: React.FC<CoachRowActionsProps> = ({ 
  coach, 
  onEdit, 
  onDelete,
  onResetPassword
}) => {
  if (!onEdit && !onDelete && !onResetPassword) return null;
  
  return (
    <TableCell>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onEdit && (
            <DropdownMenuItem onClick={() => onEdit(coach)}>
              Edit
            </DropdownMenuItem>
          )}
          {onResetPassword && (
            <DropdownMenuItem onClick={() => onResetPassword(coach)}>
              Reset Password
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem 
              onClick={() => onDelete(coach)}
              className="text-red-600 focus:text-red-600"
            >
              Remove
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  );
};

export default CoachRowActions;
