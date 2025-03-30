
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminUserService } from '@/services/admin-user-service';
import type { AdminUser, AdminUserFormData } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

// Admin Users Queries
export const useAdminUsersQuery = () => {
  return useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => AdminUserService.getAllAdminUsers(),
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
    mutationFn: (userData: AdminUserFormData) => 
      AdminUserService.createAdminUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast({
        title: 'Admin user created',
        description: 'The admin user has been successfully created.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to create admin user',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
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
