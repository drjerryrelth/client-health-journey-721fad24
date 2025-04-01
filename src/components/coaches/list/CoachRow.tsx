
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone } from 'lucide-react';
import { Coach } from '@/services/coaches';
import CoachStatusBadge from './CoachStatusBadge';
import CoachRowActions from './CoachRowActions';

interface CoachRowProps {
  coach: Coach;
  getClinicName: (clinicId: string) => string;
  onEdit?: (coach: Coach) => void;
  onDelete?: (coach: Coach) => void;
  onResetPassword?: (coach: Coach) => void;
}

const CoachRow: React.FC<CoachRowProps> = ({ 
  coach, 
  getClinicName, 
  onEdit, 
  onDelete,
  onResetPassword
}) => {
  return (
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
        <div className="flex items-center space-x-1">
          <span>{getClinicName(coach.clinicId)}</span>
        </div>
      </TableCell>
      <TableCell>
        <CoachStatusBadge status={coach.status} />
      </TableCell>
      <TableCell>{coach.clients}</TableCell>
      {(onEdit || onDelete || onResetPassword) && (
        <CoachRowActions 
          coach={coach} 
          onEdit={onEdit} 
          onDelete={onDelete}
          onResetPassword={onResetPassword}
        />
      )}
    </TableRow>
  );
};

export default CoachRow;
