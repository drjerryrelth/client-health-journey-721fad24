
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useClientsQuery } from '@/hooks/queries/use-client-queries';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { EmptyClientState, ClientListItem } from '@/components/clients/coach';

const CoachClientList = ({ onAddClient }: { onAddClient: () => void }) => {
  const { user } = useAuth();
  const { data: clients, isLoading } = useClientsQuery(user?.clinicId);
  const navigate = useNavigate();

  // Handle client row click
  const handleClientClick = (clientId: string) => {
    navigate(`/coach/clients/${clientId}`);
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
    return <EmptyClientState onAddClient={onAddClient} />;
  }

  return (
    <div className="space-y-4">
      {clients.map((client) => (
        <ClientListItem 
          key={client.id}
          client={client} 
          onClick={handleClientClick} 
        />
      ))}
    </div>
  );
};

export default CoachClientList;
