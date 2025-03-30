
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Mock admin user data - in a real app this would come from Supabase
const mockAdmins = [
  { id: '1', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'admin' },
  { id: '2', name: 'John Doe', email: 'john.doe@example.com', role: 'admin' },
];

const AdminUsersPage = () => {
  const [adminUsers, setAdminUsers] = useState(mockAdmins);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof mockAdmins[0] | null>(null);
  const { toast } = useToast();

  const handleAdd = () => {
    setIsAddDialogOpen(true);
  };

  const handleEdit = (user: typeof mockAdmins[0]) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user: typeof mockAdmins[0]) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      // In a real app, you would delete the user from Supabase here
      setAdminUsers(prev => prev.filter(user => user.id !== selectedUser.id));
      toast({
        title: "Admin user deleted",
        description: `${selectedUser.name} has been removed from admin users.`,
      });
    }
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Users</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <UserPlus size={16} />
          <span>Add Admin User</span>
        </Button>
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    No admin users found. Add an admin to get started.
                  </TableCell>
                </TableRow>
              ) : (
                adminUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                          <Pencil size={14} className="mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDelete(user)}>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this admin user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Admin Dialog - in a real app this would include a form to enter details */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Admin User</DialogTitle>
            <DialogDescription>
              Enter the details for the new admin user. They will receive an email invitation.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Form would go here in the complete implementation.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              toast({
                title: "Feature in development",
                description: "Adding admin users will be fully implemented soon.",
              });
              setIsAddDialogOpen(false);
            }}>Add Admin</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Dialog - in a real app this would include a form to edit details */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin User</DialogTitle>
            <DialogDescription>
              Update the details for this admin user.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Form would go here in the complete implementation.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              toast({
                title: "Feature in development",
                description: "Editing admin users will be fully implemented soon.",
              });
              setIsEditDialogOpen(false);
            }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersPage;
