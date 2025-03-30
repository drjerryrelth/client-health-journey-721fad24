
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from 'react-router-dom';

interface CoachListProps {
  limit?: number;
}

const CoachList: React.FC<CoachListProps> = ({ limit }) => {
  // Mock coach data
  const coaches = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      clients: 8,
      clinicName: 'Wellness Center',
      status: 'active',
      lastActive: '10 minutes ago'
    },
    {
      id: '2',
      name: 'Michael Torres',
      email: 'michael@example.com',
      clients: 12,
      clinicName: 'Practice Naturals',
      status: 'active',
      lastActive: '1 hour ago'
    },
    {
      id: '3',
      name: 'Lisa Wong',
      email: 'lisa@example.com',
      clients: 5,
      clinicName: 'Health Partners',
      status: 'active',
      lastActive: '3 hours ago'
    },
    {
      id: '4',
      name: 'Robert Chen',
      email: 'robert@example.com',
      clients: 0,
      clinicName: 'Practice Naturals',
      status: 'inactive',
      lastActive: '2 days ago'
    },
    {
      id: '5',
      name: 'Jennifer Adams',
      email: 'jennifer@example.com',
      clients: 7,
      clinicName: 'Wellness Center',
      status: 'active',
      lastActive: '30 minutes ago'
    }
  ];

  const displayCoaches = limit ? coaches.slice(0, limit) : coaches;

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
            <TableHead>Clinic</TableHead>
            <TableHead>Clients</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayCoaches.map((coach) => (
            <TableRow key={coach.id}>
              <TableCell>
                <Link to={`/coach/${coach.id}`} className="flex items-center space-x-3 hover:underline">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${coach.name}`} alt={coach.name} />
                    <AvatarFallback>{coach.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{coach.name}</div>
                    <div className="text-xs text-gray-500">{coach.email}</div>
                  </div>
                </Link>
              </TableCell>
              <TableCell>{coach.clinicName}</TableCell>
              <TableCell>{coach.clients}</TableCell>
              <TableCell>{coach.lastActive}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(coach.status)} variant="outline">
                  {coach.status.charAt(0).toUpperCase() + coach.status.slice(1)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CoachList;
