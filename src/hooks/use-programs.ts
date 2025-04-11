import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProgramService } from '@/services/program/program-service';
import { useAuth } from '@/context/auth/AuthContext';
import { Program } from '@/types/database';
import { toast } from 'sonner';

export const usePrograms = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get all programs
  const { data: programs, isLoading: isLoadingPrograms } = useQuery({
    queryKey: ['programs'],
    queryFn: () => ProgramService.getPrograms(user),
    enabled: !!user,
  });

  // Get a specific program
  const useProgram = (id: string) => {
    return useQuery({
      queryKey: ['program', id],
      queryFn: () => ProgramService.getProgramById(id, user),
      enabled: !!user && !!id,
    });
  };

  // Create a new program
  const createProgram = useMutation({
    mutationFn: (program: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>) =>
      ProgramService.createProgram(program, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      toast.success('Program created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create program');
    },
  });

  // Update a program
  const updateProgram = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Program> }) =>
      ProgramService.updateProgram(id, updates, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      toast.success('Program updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update program');
    },
  });

  // Delete a program
  const deleteProgram = useMutation({
    mutationFn: (id: string) => ProgramService.deleteProgram(id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      toast.success('Program deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete program');
    },
  });

  return {
    programs,
    isLoadingPrograms,
    useProgram,
    createProgram,
    updateProgram,
    deleteProgram,
  };
}; 