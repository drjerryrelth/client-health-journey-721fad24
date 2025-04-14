
import React from 'react';
import { useAuth } from '@/context/auth';
import { useClientsQuery } from '@/hooks/queries/use-client-queries';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { EmptyClientState, ClientListItem } from '@/components/clients/coach';
import { useClinicFilter } from '@/components/coaches/list/useClinicFilter';

const CoachClientList = ({ onAddClient }: { onAddClient: () => void }) => {
  const { user } = useAuth();
  const { data: clients, isLoading } = useClientsQuery(user?.clinicId);
  const { filterByClinic } = useClinicFilter();
  const navigate = useNavigate();

  // Filter clients to only show those assigned to this coach
  const coachClients = React.useMemo(() => {
    if (!clients || !user) return [];
    
    // First filter by clinic, then by coach ID
    const clinicClients = filterByClinic(clients);
    const filteredClients = clinicClients.filter(client => client.coach_id === user.coach_id);
    
    console.log('Coach client filtering:', {
      totalClients: clients.length,
      clinicFilteredClients: clinicClients.length,
      coachFilteredClients: filteredClients.length,
      coachId: user.id
    });
    
    return filteredClients;
  }, [clients, user, filterByClinic]);

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

  if (!coachClients || coachClients.length === 0) {
    return <EmptyClientState onAddClient={onAddClient} />;
  }

  return (
    <div className="space-y-4">
      {coachClients.map((client) => (
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
