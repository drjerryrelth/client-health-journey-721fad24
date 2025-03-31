
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckInService } from '@/services/check-in-service';
import { CheckIn } from '@/types';

// Check-in Queries
export const useClientCheckInsQuery = (clientId?: string) => {
  return useQuery({
    queryKey: ['checkIns', clientId],
    queryFn: () => CheckInService.getClientCheckIns(clientId as string),
    enabled: !!clientId,
  });
};

export const useRecentCheckInsQuery = (clientId?: string) => {
  return useQuery({
    queryKey: ['recentCheckIns', clientId],
    queryFn: () => CheckInService.getRecentCheckIns(clientId as string),
    enabled: !!clientId,
  });
};

export const useCheckInQuery = (checkInId?: string) => {
  return useQuery({
    queryKey: ['checkIn', checkInId],
    queryFn: () => CheckInService.getCheckInById(checkInId as string),
    enabled: !!checkInId,
  });
};

export const useCreateCheckInMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ checkIn, photos }: { 
      checkIn: Omit<CheckIn, 'id'>; 
      photos?: File[] 
    }) => CheckInService.createCheckIn(checkIn, photos),
    onSuccess: (data) => {
      // Update check-ins queries
      queryClient.invalidateQueries({ queryKey: ['checkIns', data.clientId] });
      queryClient.invalidateQueries({ queryKey: ['recentCheckIns', data.clientId] });
      
      // Update client to reflect last check-in date
      queryClient.invalidateQueries({ queryKey: ['client', data.clientId] });
    },
  });
};

export const useUpdateCheckInMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ checkInId, updates }: { 
      checkInId: string; 
      updates: Partial<CheckIn>; 
    }) => CheckInService.updateCheckIn(checkInId, updates),
    onSuccess: (data) => {
      // Update check-in queries
      queryClient.invalidateQueries({ queryKey: ['checkIn', data.id] });
      queryClient.invalidateQueries({ queryKey: ['checkIns', data.clientId] });
      queryClient.invalidateQueries({ queryKey: ['recentCheckIns', data.clientId] });
    },
  });
};

export const useDeleteCheckInMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (checkInId: string) => CheckInService.deleteCheckIn(checkInId),
    onSuccess: (_, variables) => {
      // Get the check-in data from cache to know which client to invalidate
      const checkIn = queryClient.getQueryData<CheckIn>(['checkIn', variables]);
      if (checkIn?.clientId) {
        queryClient.invalidateQueries({ queryKey: ['checkIns', checkIn.clientId] });
        queryClient.invalidateQueries({ queryKey: ['recentCheckIns', checkIn.clientId] });
        // Also update client data since last check-in date may have changed
        queryClient.invalidateQueries({ queryKey: ['client', checkIn.clientId] });
      }
      // Remove check-in from cache
      queryClient.removeQueries({ queryKey: ['checkIn', variables] });
    },
  });
};
