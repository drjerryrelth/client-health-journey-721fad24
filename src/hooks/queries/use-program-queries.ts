
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { ProgramService } from '@/services/program-service';
import { Program } from '@/types';

// Program Queries
export const useProgramsQuery = (clinicId?: string) => {
  const { user } = useAuth();
  const activeClinicId = clinicId || user?.clinicId;

  return useQuery({
    queryKey: ['programs', activeClinicId],
    queryFn: () => {
      console.log("Fetching programs for clinic:", activeClinicId);
      if (!activeClinicId) {
        console.error("No clinic ID available for fetching programs");
        return Promise.resolve([]);
      }
      return ProgramService.getClinicPrograms(activeClinicId as string);
    },
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
