
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { ClientService } from '@/services/client-service';
import { ProgramService } from '@/services/program-service';
import { CheckInService } from '@/services/check-in-service';
import { Client, Program, CheckIn } from '@/types';

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

// Program Queries
export const useProgramsQuery = (clinicId?: string) => {
  const { user } = useAuth();
  const activeClinicId = clinicId || user?.clinicId;

  return useQuery({
    queryKey: ['programs', activeClinicId],
    queryFn: () => ProgramService.getClinicPrograms(activeClinicId as string),
    enabled: !!activeClinicId,
  });
};

export const useProgramQuery = (programId?: string) => {
  return useQuery({
    queryKey: ['program', programId],
    queryFn: () => ProgramService.getProgramById(programId as string),
    enabled: !!programId,
  });
};

export const useCreateProgramMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ program, supplements }: { 
      program: Omit<Program, 'id' | 'supplements'>; 
      supplements: any[] 
    }) => ProgramService.createProgram(program, supplements),
    onSuccess: (data) => {
      // Update programs query cache
      queryClient.invalidateQueries({ queryKey: ['programs', data.clinicId] });
    },
  });
};

export const useUpdateProgramMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ programId, updates, supplements }: { 
      programId: string; 
      updates: Partial<Omit<Program, 'supplements'>>; 
      supplements?: any[] 
    }) => ProgramService.updateProgram(programId, updates, supplements),
    onSuccess: (data) => {
      // Update both the program and programs queries
      queryClient.invalidateQueries({ queryKey: ['program', data.id] });
      queryClient.invalidateQueries({ queryKey: ['programs', data.clinicId] });
    },
  });
};

export const useDeleteProgramMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (programId: string) => ProgramService.deleteProgram(programId),
    onSuccess: (_, variables) => {
      // Get the program data from cache to know which clinic to invalidate
      const program = queryClient.getQueryData<Program>(['program', variables]);
      if (program?.clinicId) {
        queryClient.invalidateQueries({ queryKey: ['programs', program.clinicId] });
      }
      // Remove program from cache
      queryClient.removeQueries({ queryKey: ['program', variables] });
    },
  });
};

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
