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

  console.log('useClientsQuery - User:', { 
    role: user?.role, 
    clinicId: user?.clinicId, 
    coach_id: user?.coach_id,
    activeClinicId 
  });

  const queryEnabled = !!user?.role;
  console.log('Query enabled:', queryEnabled);

  return useQuery({
    queryKey: ['clients', user?.role, activeClinicId, user?.coach_id],
    queryFn: () => {
      if (!user?.role) {
        console.error('Missing user role in useClientsQuery');
        return Promise.resolve([]);
      }

      // For coaches, we need their coach_id
      if (user.role === 'coach' && !user.coach_id) {
        console.error('Missing coach_id for coach role');
        return Promise.resolve([]);
      }

      console.log('Fetching clients for role:', user.role, 'clinic:', activeClinicId, 'coach:', user.coach_id);
      return ClientService.getClientsByRole(user.role, activeClinicId, user.coach_id);
    },
    enabled: queryEnabled,
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
