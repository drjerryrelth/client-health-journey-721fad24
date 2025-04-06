
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/auth';
import { ClientService } from '@/services/client-service';
import { Client } from '@/types';
import { toast } from 'sonner';
import { useClinicFilter } from '@/components/coaches/list/useClinicFilter';

// Client Queries
export const useClientsQuery = (clinicId?: string) => {
  const { user } = useAuth();
  const { userClinicId } = useClinicFilter();
  
  // Use a hierarchical approach to determine the active clinic ID
  const activeClinicId = clinicId || user?.clinicId || userClinicId;

  return useQuery({
    queryKey: ['clients', activeClinicId],
    queryFn: () => {
      if (!activeClinicId) {
        console.error('Missing clinic ID in useClientsQuery');
        return Promise.resolve([]);
      }
      console.log('Fetching clients for clinic:', activeClinicId);
      return ClientService.getClinicClients(activeClinicId);
    },
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
    onSuccess: (result, variables) => {
      // Update clients query cache
      queryClient.invalidateQueries({ queryKey: ['clients', variables.clinicId] });
      
      // Show success toast with temp password if available
      if (result.data) {
        if (result.tempPassword) {
          toast.success(
            `Client ${result.data.name} created successfully. Temporary password: ${result.tempPassword}`, 
            { duration: 10000 }
          );
        } else {
          toast.success(`Client ${result.data.name} created successfully`);
        }
      }
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
      queryClient.invalidateQueries({ queryKey: ['client', data.data?.id] });
      queryClient.invalidateQueries({ queryKey: ['clients', data.data?.clinicId] });
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
