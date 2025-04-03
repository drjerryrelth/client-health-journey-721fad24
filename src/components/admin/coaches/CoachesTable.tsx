
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User, Building, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CoachWithClinic } from '@/hooks/queries/use-admin-coaches';
import { Coach } from '@/services/coaches';

interface CoachesTableProps {
  coaches: CoachWithClinic[];
  onEdit?: (coach: Coach) => void;
  onDelete?: (coach: Coach) => void;
  onResetPassword?: (coach: Coach) => void;
  isSystemAdmin?: boolean;
}

const CoachesTable: React.FC<CoachesTableProps> = ({ 
  coaches, 
  onEdit, 
  onDelete, 
  onResetPassword, 
  isSystemAdmin = false 
}) => {
  const hasActions = Boolean(onEdit || onDelete || onResetPassword);
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Clinic</TableHead>
            <TableHead>Status</TableHead>
            {hasActions && <TableHead className="w-[80px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {coaches.length > 0 ? (
            coaches.map((coach) => (
              <TableRow key={coach.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary-100 h-8 w-8 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-700" />
                    </div>
                    <span className="font-medium">{coach.name}</span>
                  </div>
                </TableCell>
                <TableCell>{coach.email}</TableCell>
                <TableCell>{coach.phone || '-'}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary-100 h-6 w-6 rounded-full flex items-center justify-center">
                      <Building className="h-3 w-3 text-primary-700" />
                    </div>
                    <span>{coach.clinicName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={coach.status === 'active' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} variant="outline">
                    {coach.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                {hasActions && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
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
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={hasActions ? 6 : 5} className="text-center py-4 text-gray-500">
                {isSystemAdmin 
                  ? "No coaches found in the system. Please add coaches to clinics to see them here."
                  : "No coaches found for your clinic. Add coaches to manage your clients."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CoachesTable;
