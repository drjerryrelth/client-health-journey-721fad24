
import React, { useEffect } from 'react';
import { useClientsQuery } from '@/hooks/queries/use-client-queries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';

interface ClientListProps {
  clinicId?: string;
}

const ClientList: React.FC<ClientListProps> = ({ clinicId }) => {
  const { user } = useAuth();
  const activeClinicId = clinicId || user?.clinicId;
  
  const {
    data: clients,
    isLoading,
    isError,
    refetch
  } = useClientsQuery(activeClinicId);
  
  useEffect(() => {
    console.log('ClientList - activeClinicId:', activeClinicId);
    console.log('ClientList - user role:', user?.role);
    console.log('ClientList - user clinicId:', user?.clinicId);
  }, [activeClinicId, user]);
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Failed to load clients</p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }
  
  if (!clients || clients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No clients found
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Coach</TableHead>
          <TableHead>Program</TableHead>
          <TableHead>Last Check-in</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id} className="hover:bg-gray-50">
            <TableCell className="font-medium">{client.name}</TableCell>
            <TableCell>{client.email}</TableCell>
            <TableCell>
              {client.coachId ? client.coaches?.name || 'Unassigned' : 'Unassigned'}
            </TableCell>
            <TableCell>
              {client.programId ? (client as any).program?.name || 'None' : 'None'}
            </TableCell>
            <TableCell>
              {client.lastCheckIn ? (
                new Date(client.lastCheckIn).toLocaleDateString()
              ) : (
                <Badge variant="outline" className="bg-amber-100 text-amber-800">
                  No check-ins
                </Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClientList;
