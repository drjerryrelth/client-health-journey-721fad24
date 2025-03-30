
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Coach, CoachService } from '@/services/coach-service';

interface CoachListProps {
  limit?: number;
  clinicId?: string;
  onEdit?: (coach: Coach) => void;
  onDelete?: (coach: Coach) => void;
}

const CoachList: React.FC<CoachListProps> = ({ limit, clinicId, onEdit, onDelete }) => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCoaches = async () => {
      if (clinicId) {
        setIsLoading(true);
        try {
          const coachesData = await CoachService.getClinicCoaches(clinicId);
          setCoaches(coachesData);
        } catch (error) {
          console.error('Error loading coaches:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setCoaches([]);
        setIsLoading(false);
      }
    };

    loadCoaches();
  }, [clinicId]);
  
  // Apply limit if specified
  const displayedCoaches = limit ? coaches.slice(0, limit) : coaches;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-4">Loading coaches...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Coach</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Clients</TableHead>
            {(onEdit || onDelete) && <TableHead className="w-[80px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedCoaches.length > 0 ? (
            displayedCoaches.map((coach) => (
              <TableRow key={coach.id} className="cursor-pointer hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${coach.name}`} />
                      <AvatarFallback>
                        <User size={16} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{coach.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Mail size={14} className="text-gray-400" />
                    <span>{coach.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Phone size={14} className="text-gray-400" />
                    <span>{coach.phone}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(coach.status)} variant="outline">
                    {coach.status.charAt(0).toUpperCase() + coach.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{coach.clients}</TableCell>
                {(onEdit || onDelete) && (
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
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={onEdit || onDelete ? 6 : 5} className="text-center py-4">
                No coaches found for this clinic
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CoachList;
