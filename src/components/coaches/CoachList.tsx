
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone } from 'lucide-react';

interface CoachListProps {
  limit?: number;
  clinicId?: string;
}

const CoachList: React.FC<CoachListProps> = ({ limit, clinicId }) => {
  // Mock coaches data
  const allCoaches = [
    {
      id: '1',
      name: 'Lisa Johnson',
      email: 'lisa@healthtracker.com',
      phone: '(555) 123-4567',
      status: 'active',
      clients: 8,
      clinicId: '1'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@healthtracker.com',
      phone: '(555) 234-5678',
      status: 'active',
      clients: 6,
      clinicId: '1'
    },
    {
      id: '3',
      name: 'Sarah Williams',
      email: 'sarah@healthtracker.com',
      phone: '(555) 345-6789',
      status: 'inactive',
      clients: 4,
      clinicId: '2'
    },
    {
      id: '4',
      name: 'David Martinez',
      email: 'david@healthtracker.com',
      phone: '(555) 456-7890',
      status: 'active',
      clients: 7,
      clinicId: '2'
    },
    {
      id: '5',
      name: 'Jennifer Lee',
      email: 'jennifer@healthtracker.com',
      phone: '(555) 567-8901',
      status: 'active',
      clients: 9,
      clinicId: '3'
    }
  ];
  
  // Filter by clinic if clinicId is provided
  const coaches = clinicId 
    ? allCoaches.filter(coach => coach.clinicId === clinicId) 
    : allCoaches;

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
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
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
