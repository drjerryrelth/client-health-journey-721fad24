
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { AdminUser } from '@/types/admin';
import { useUpdateAdminUserMutation, useAdminUserQuery } from '@/hooks/use-admin-users';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define the form validation schema
const formSchema = z.object({
  full_name: z.string().min(3, { message: "Full name must be at least 3 characters" }),
  role: z.string(),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditAdminUserDialogProps {
  userId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSuperAdmin?: boolean; // Add the missing isSuperAdmin prop
}

export function EditAdminUserDialog({ userId, open, onOpenChange, isSuperAdmin = false }: EditAdminUserDialogProps) {
  const { data: adminUser, isLoading } = useAdminUserQuery(userId);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      role: 'admin',
      is_active: true,
    },
  });
  
  useEffect(() => {
    if (adminUser) {
      form.reset({
        full_name: adminUser.full_name,
        role: adminUser.role,
        is_active: adminUser.is_active,
      });
    }
  }, [adminUser, form]);
  
  const updateAdminUser = useUpdateAdminUserMutation();
  
  const onSubmit = async (data: FormValues) => {
    if (!userId) return;
    
    try {
      await updateAdminUser.mutateAsync({ 
        userId, 
        updates: data as Partial<AdminUser>
      });
      onOpenChange(false);
    } catch (error) {
      // Error is handled in the mutation hook
      console.error("Error updating admin user:", error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Admin User</DialogTitle>
          <DialogDescription>
            Update the details for this admin user.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="py-6 text-center">Loading user information...</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {adminUser && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    Email: <span className="font-medium text-foreground">{adminUser.email}</span>
                  </p>
                </div>
              )}
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        {/* Only show Super Admin option if current user is a Super Admin */}
                        {isSuperAdmin && (
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Determines the user's permissions in the system.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Active Status
                      </FormLabel>
                      <FormDescription>
                        Inactive users cannot log in to the system.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateAdminUser.isPending}>
                  {updateAdminUser.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
