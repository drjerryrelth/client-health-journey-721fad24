
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from 'react-router-dom';

interface ClientListProps {
  limit?: number;
}

const ClientList: React.FC<ClientListProps> = ({ limit }) => {
  // Mock client data
  const clients = [
    {
      id: '1',
      name: 'Jane Cooper',
      email: 'jane@example.com',
      program: 'Practice Naturals',
      progress: 75,
      lastCheckIn: '2 hours ago',
      status: 'active',
    },
    {
      id: '2',
      name: 'Michael Johnson',
      email: 'michael@example.com',
      program: 'Keto Program',
      progress: 40,
      lastCheckIn: '1 day ago',
      status: 'active',
    },
    {
      id: '3',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      program: 'Custom',
      progress: 60,
      lastCheckIn: '3 days ago',
      status: 'at risk',
    },
    {
      id: '4',
      name: 'Robert Brown',
      email: 'robert@example.com',
      program: 'Practice Naturals',
      progress: 90,
      lastCheckIn: '5 hours ago',
      status: 'active',
    },
    {
      id: '5',
      name: 'Olivia Thompson',
      email: 'olivia@example.com',
      program: 'Keto Program',
      progress: 30,
      lastCheckIn: '7 days ago',
      status: 'at risk',
    },
    {
      id: '6',
      name: 'William Garcia',
      email: 'william@example.com',
      program: 'Custom',
      progress: 15,
      lastCheckIn: 'Never',
      status: 'inactive',
    },
  ];

  const displayClients = limit ? clients.slice(0, limit) : clients;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'at risk':
        return 'bg-amber-100 text-amber-800';
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
            <TableHead>Client</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Last Check-in</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayClients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <Link to={`/client/${client.id}`} className="flex items-center space-x-3 hover:underline">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${client.name}`} alt={client.name} />
                    <AvatarFallback>{client.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{client.name}</div>
                    <div className="text-xs text-gray-500">{client.email}</div>
                  </div>
                </Link>
              </TableCell>
              <TableCell>{client.program}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${client.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium">{client.progress}%</span>
                </div>
              </TableCell>
              <TableCell>{client.lastCheckIn}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(client.status)} variant="outline">
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientList;
