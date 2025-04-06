import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Pencil, Trash2, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AddAdminUserDialog } from '@/components/admin/AddAdminUserDialog';
import { EditAdminUserDialog } from '@/components/admin/EditAdminUserDialog';
import { useAdminUsersQuery, useDeleteAdminUserMutation, useUpdateAdminUserMutation } from '@/hooks/use-admin-users';
import { Badge } from '@/components/ui/badge';
import { toast as sonnerToast } from 'sonner';
import { useAuth } from '@/context/auth';

const AdminUsersPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const isSuperAdmin = user?.role === 'super_admin';
  
  const { data: adminUsers, isLoading, isError, refetch, isFetching } = useAdminUsersQuery();
  const deleteAdminUser = useDeleteAdminUserMutation();
  const updateAdminUser = useUpdateAdminUserMutation();

  useEffect(() => {
    console.log('AdminUsersPage mounted, forcing refetch of admin users');
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (adminUsers) {
      console.log('Admin users data updated:', adminUsers.length, 'users found');
    }
  }, [adminUsers]);

  const handleAdd = () => {
    setIsAddDialogOpen(true);
  };

  const handleEdit = (userId: string) => {
    setSelectedUserId(userId);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (userId: string) => {
    setSelectedUserId(userId);
    setIsDeleteDialogOpen(true);
  };

  const handlePromoteToSuperAdmin = (userId: string) => {
    if (!isSuperAdmin) {
      sonnerToast.error('Unauthorized', {
        description: 'Only Super Admins can promote users to Super Admin role.',
      });
      return;
    }
    setSelectedUserId(userId);
    setIsPromoteDialogOpen(true);
  };

  const confirmPromote = async () => {
    if (!isSuperAdmin) {
      sonnerToast.error('Unauthorized action');
      setIsPromoteDialogOpen(false);
      return;
    }
    
    if (selectedUserId) {
      try {
        await updateAdminUser.mutateAsync({
          userId: selectedUserId,
          updates: { role: 'super_admin' }
        });
        await refetch();
        sonnerToast.success('User promoted to Super Admin successfully');
      } catch (error) {
        console.error('Error promoting user:', error);
      }
    }
    setIsPromoteDialogOpen(false);
    setSelectedUserId(undefined);
  };

  const confirmDelete = async () => {
    if (selectedUserId) {
      try {
        await deleteAdminUser.mutateAsync(selectedUserId);
        await refetch();
        sonnerToast.success('Admin user deleted successfully');
      } catch (error) {
        console.error('Error deleting admin user:', error);
      }
    }
    setIsDeleteDialogOpen(false);
    setSelectedUserId(undefined);
  };

  const handleAddDialogClose = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) {
      refetch();
    }
  };

  const handleEditDialogClose = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      refetch();
    }
  };

  const handleManualRefresh = () => {
    console.log('Manual refresh requested');
    refetch();
    sonnerToast.info('Refreshing admin users list...');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Users</h1>
        <div className="flex space-x-2">
          <Button 
            onClick={handleManualRefresh} 
            variant="outline" 
            size="icon"
            disabled={isFetching}
            className="flex items-center justify-center"
            title="Refresh list"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          </Button>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <UserPlus size={16} />
            <span>Add Admin User</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Admin Users</CardTitle>
          <CardDescription>
            Add, edit, or remove users with administrative access to the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Admin users have full access to all features and data in the system. Add new admin users carefully.
            </AlertDescription>
          </Alert>

          {isError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                There was an error loading admin users. Please try refreshing the page.
              </AlertDescription>
            </Alert>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || isFetching ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Loading admin users...
                  </TableCell>
                </TableRow>
              ) : adminUsers?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No admin users found. Add an admin to get started.
                  </TableCell>
                </TableRow>
              ) : (
                adminUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'super_admin' ? 'default' : 'outline'}>
                        {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? 'success' : 'destructive'}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {isSuperAdmin && user.role !== 'super_admin' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-blue-600"
                            onClick={() => handlePromoteToSuperAdmin(user.id)}
                          >
                            <ShieldCheck size={14} className="mr-1" /> Make Super
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleEdit(user.id)}>
                          <Pencil size={14} className="mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDelete(user.id)}>
                          <Trash2 size={14} className="mr-1" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddAdminUserDialog 
        open={isAddDialogOpen} 
        onOpenChange={handleAddDialogClose} 
        isSuperAdmin={isSuperAdmin}
      />

      <EditAdminUserDialog 
        userId={selectedUserId} 
        open={isEditDialogOpen} 
        onOpenChange={handleEditDialogClose}
        isSuperAdmin={isSuperAdmin}
      />

      <Dialog 
        open={isPromoteDialogOpen && isSuperAdmin} 
        onOpenChange={(open) => {
          if (isSuperAdmin) {
            setIsPromoteDialogOpen(open);
          } else {
            setIsPromoteDialogOpen(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Promote to Super Admin</DialogTitle>
            <DialogDescription>
              Are you sure you want to promote this user to Super Admin? Super Admins have unrestricted access to all system functions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPromoteDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={confirmPromote}
              disabled={updateAdminUser.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateAdminUser.isPending ? "Promoting..." : "Yes, Promote"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersPage;
