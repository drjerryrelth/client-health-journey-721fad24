
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useClientsQuery } from '@/hooks/queries/use-client-queries';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { UserPlus } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CoachClientList = () => {
  const { user } = useAuth();
  const { data: clients, isLoading } = useClientsQuery(user?.clinicId);
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  // Handle the "Add Your First Client" button click
  const handleAddClientClick = () => {
    setSearchParams({ action: 'add' });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-lg font-medium text-gray-700 mb-4">You don't have any clients yet</p>
        <Button onClick={handleAddClientClick} className="flex items-center">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Your First Client
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {clients.map((client) => (
        <div 
          key={client.id} 
          className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
          onClick={() => navigate(`/coach/clients/${client.id}`)}
        >
          <div>
            <h3 className="font-medium">{client.name}</h3>
            <p className="text-sm text-gray-500">{client.email}</p>
          </div>
          <div className="text-sm text-gray-500">
            Last check-in: {client.lastCheckIn ? new Date(client.lastCheckIn).toLocaleDateString() : 'Never'}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoachClientList;
