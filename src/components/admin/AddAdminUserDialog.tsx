
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AdminUserFormData } from '@/types/admin';
import { useCreateAdminUserMutation, useAdminUsersQuery } from '@/hooks/use-admin-users';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useClinicQuery } from '@/hooks/use-clinics';

// Define the extended form validation schema with clinic field
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters" }),
  role: z.string().default("admin"),
  clinicId: z.string().optional(),
});

// Extend the form data type
interface ExtendedAdminUserFormData extends AdminUserFormData {
  clinicId?: string;
}

interface AddAdminUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSuperAdmin?: boolean;
}

export function AddAdminUserDialog({ open, onOpenChange, isSuperAdmin = false }: AddAdminUserDialogProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showClinicField, setShowClinicField] = useState<boolean>(false);
  
  // Fetch clinics for the dropdown
  const { data: clinics, isLoading: clinicsLoading } = useClinicQuery();
  
  const form = useForm<ExtendedAdminUserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      role: 'admin',
      clinicId: undefined,
    },
  });
  
  // Watch the role field to show/hide clinic selection
  const selectedRole = form.watch('role');
  
  // Update UI based on role selection
  useEffect(() => {
    setShowClinicField(selectedRole === 'clinic_admin');
    
    // Clear clinic ID if not a clinic admin
    if (selectedRole !== 'clinic_admin') {
      form.setValue('clinicId', undefined);
    }
  }, [selectedRole, form]);
  
  const createAdminUser = useCreateAdminUserMutation();
  const adminUsersQuery = useAdminUsersQuery();
  
  const onSubmit = async (data: ExtendedAdminUserFormData) => {
    setErrorMessage(null);
    
    // Prevent non-super-admins from creating super-admin accounts
    if (!isSuperAdmin && data.role === 'super_admin') {
      setErrorMessage('You do not have permission to create Super Admin accounts');
      return;
    }
    
    // Ensure clinic admin has a clinic assigned
    if (data.role === 'clinic_admin' && !data.clinicId) {
      setErrorMessage('Clinic Admin must have a clinic assigned');
      return;
    }
    
    try {
      await createAdminUser.mutateAsync(data);
      // Explicitly refetch the admin users data
      await adminUsersQuery.refetch();
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error creating admin user:", error);
      setErrorMessage(error?.message || 'An unknown error occurred when creating the admin user');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        form.reset();
        setErrorMessage(null);
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Admin User</DialogTitle>
          <DialogDescription>
            Create a new admin user with access to the admin dashboard.
          </DialogDescription>
        </DialogHeader>
        
        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormDescription>
                    The user will be able to change their password after logging in.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullName"
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="clinic_admin">Clinic Admin</SelectItem>
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
            
            {/* Conditional clinic selection field for clinic admins */}
            {showClinicField && (
              <FormField
                control={form.control}
                name="clinicId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign to Clinic</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a clinic" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clinicsLoading ? (
                          <SelectItem value="loading" disabled>Loading clinics...</SelectItem>
                        ) : clinics && clinics.length > 0 ? (
                          clinics.map((clinic) => (
                            <SelectItem key={clinic.id} value={clinic.id}>
                              {clinic.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>No clinics available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The clinic this admin will manage.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createAdminUser.isPending}>
                {createAdminUser.isPending ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
