
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { ClientService } from '@/services/client-service';
import { Client } from '@/types';

// Client Queries
export const useClientsQuery = (clinicId?: string) => {
  const { user } = useAuth();
  const activeClinicId = clinicId || user?.clinicId;

  return useQuery({
    queryKey: ['clients', activeClinicId],
    queryFn: () => ClientService.getClinicClients(activeClinicId as string),
    enabled: !!activeClinicId,
  });
};

export const useClientQuery = (clientId?: string) => {
  return useQuery({
    queryKey: ['client', clientId],
    queryFn: () => ClientService.getClientById(clientId as string),
    enabled: !!clientId,
  });
};

export const useCreateClientMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newClient: Omit<Client, 'id'>) => 
      ClientService.createClient(newClient),
    onSuccess: (data, variables) => {
      // Update clients query cache
      queryClient.invalidateQueries({ queryKey: ['clients', variables.clinicId] });
    },
  });
};

export const useUpdateClientMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ clientId, updates }: { clientId: string; updates: Partial<Client> }) => 
      ClientService.updateClient(clientId, updates),
    onSuccess: (data) => {
      // Update both the client and clients queries
      queryClient.invalidateQueries({ queryKey: ['client', data.id] });
      queryClient.invalidateQueries({ queryKey: ['clients', data.clinicId] });
    },
  });
};

export const useDeleteClientMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (clientId: string) => ClientService.deleteClient(clientId),
    onSuccess: (_, variables) => {
      // Get the client data from cache to know which clinic to invalidate
      const client = queryClient.getQueryData<Client>(['client', variables]);
      if (client?.clinicId) {
        queryClient.invalidateQueries({ queryKey: ['clients', client.clinicId] });
      }
      // Remove client from cache
      queryClient.removeQueries({ queryKey: ['client', variables] });
    },
  });
};
