import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminUserService } from '@/services/admin-user-service';
import type { AdminUser, AdminUserFormData } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';

// Admin Users Queries
export const useAdminUsersQuery = () => {
  return useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => AdminUserService.getAllAdminUsers(),
    staleTime: 0, // Set to 0 to always refresh data
    refetchOnWindowFocus: true,
    refetchOnMount: true,  // Always refetch when component mounts
  });
};

export const useAdminUserQuery = (userId?: string) => {
  return useQuery({
    queryKey: ['adminUser', userId],
    queryFn: () => AdminUserService.getAdminUserById(userId as string),
    enabled: !!userId,
  });
};

export const useCreateAdminUserMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (userData: AdminUserFormData) => {
      // Log the userData to help with debugging
      console.log('Creating admin user with data:', userData);
      try {
        const result = await AdminUserService.createAdminUser(userData);
        console.log('Admin user creation result:', result);
        return result;
      } catch (error) {
        console.error('Error in mutationFn:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Admin user created successfully:', data);
      
      // Force an immediate refetch to get the latest data
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      
      // Use sonner toast for more visible notification
      sonnerToast.success('Admin user created', {
        description: 'The admin user has been successfully created.',
        duration: 4000,
      });
    },
    onError: (error: any) => {
      console.error('Admin user creation failed:', error);
      
      // Extract meaningful error message
      let errorMessage = 'An unknown error occurred';
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.error?.message) {
        errorMessage = error.error.message;
      }
      
      // Use sonner toast for more visible error notification
      sonnerToast.error('Failed to create admin user', {
        description: errorMessage,
        duration: 5000,
      });
    }
  });
};

export const useUpdateAdminUserMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: Partial<AdminUser> }) => 
      AdminUserService.updateAdminUser(userId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminUser', data.id] });
      toast({
        title: 'Admin user updated',
        description: 'The admin user has been successfully updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update admin user',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    }
  });
};

export const useDeleteAdminUserMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (userId: string) => AdminUserService.deleteAdminUser(userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.removeQueries({ queryKey: ['adminUser', variables] });
      toast({
        title: 'Admin user deleted',
        description: 'The admin user has been successfully deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete admin user',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    }
  });
};
