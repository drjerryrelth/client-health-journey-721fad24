
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { ProgramService } from '@/services/programs';
import { Program } from '@/types';

// Program Queries
export const useProgramsQuery = (clinicId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['programs', clinicId || 'all'],
    queryFn: async () => {
      console.log("Fetching programs with clinicId:", clinicId);
      try {
        let programs;
        if (clinicId) {
          programs = await ProgramService.getClinicPrograms(clinicId);
          console.log(`Fetched ${programs?.length || 0} programs for clinic ${clinicId}:`, programs);
        } else {
          programs = await ProgramService.getAllPrograms();
          console.log(`Fetched ${programs?.length || 0} programs (all):`, programs);
        }
        
        if (!programs || programs.length === 0) {
          console.log("No programs found in database");
          return [];
        }
        
        return programs;
      } catch (error) {
        console.error("Error in queryFn when fetching programs:", error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    staleTime: 1000 * 60 * 5, // 5 minutes
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
      supplements: Omit<Program['supplements'][0], 'id'>[] 
    }) => ProgramService.createProgram(program, supplements),
    onSuccess: (data) => {
      // Update programs query cache
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['programs', 'all'] });
      if (data.clinicId) {
        queryClient.invalidateQueries({ queryKey: ['programs', data.clinicId] });
      }
    },
  });
};

export const useUpdateProgramMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ programId, updates, supplements }: { 
      programId: string; 
      updates: Partial<Omit<Program, 'supplements'>>; 
      supplements?: Partial<Program['supplements'][0]>[] 
    }) => ProgramService.updateProgram(programId, updates, supplements),
    onSuccess: (data) => {
      // Update both the program and programs queries
      queryClient.invalidateQueries({ queryKey: ['program', data.id] });
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['programs', 'all'] });
      if (data.clinicId) {
        queryClient.invalidateQueries({ queryKey: ['programs', data.clinicId] });
      }
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
      
      // Remove program from cache and invalidate relevant queries
      queryClient.removeQueries({ queryKey: ['program', variables] });
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['programs', 'all'] });
      
      if (program?.clinicId) {
        queryClient.invalidateQueries({ queryKey: ['programs', program.clinicId] });
      }
    },
  });
};
