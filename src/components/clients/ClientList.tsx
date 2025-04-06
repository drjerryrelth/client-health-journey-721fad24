
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth';
import { supabase } from '@/lib/supabase';
import { Client } from '@/types';
import { mapDbClientToClient } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Edit, Trash2, MoreHorizontal, User, CalendarClock, Building,
  AlertCircle, Info, RefreshCw 
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ClientListProps {
  clinicId?: string;
}

const ClientList = ({ clinicId }: ClientListProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const isClinicAdmin = user?.role === 'clinic_admin';
  const isSystemAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  
  // Ensure clinicId is set for clinic admins
  const effectiveClinicId = isClinicAdmin ? user?.clinicId : clinicId;
  
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching clients with params:', { 
        effectiveClinicId, 
        isClinicAdmin, 
        userClinicId: user?.clinicId,
        userRole: user?.role
      });
      
      let query = supabase.from('clients').select(`
        *,
        programs:program_id (name),
        coaches:coach_id (name, email)
      `);
      
      // Filter by clinic ID if provided or if user is clinic admin
      if (effectiveClinicId) {
        console.log(`Filtering clients by clinic ID: ${effectiveClinicId}`);
        query = query.eq('clinic_id', effectiveClinicId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const mappedClients = data.map(client => mapDbClientToClient(client));
        console.log(`Found ${mappedClients.length} clients for ${isClinicAdmin ? 'clinic admin' : 'system admin'}`);
        setClients(mappedClients);
        
        // Verify we have the expected number of clients (4 for clinic admin)
        if (isClinicAdmin) {
          console.log(`Clinic Admin expects 4 clients - actual count: ${mappedClients.length}`);
        }
      }
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      setError(err.message);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [effectiveClinicId, isClinicAdmin, user?.clinicId]);

  const handleView = (id: string) => {
    navigate(`/admin/clients/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/clients/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        const { error } = await supabase.from('clients').delete().eq('id', id);
        
        if (error) {
          throw error;
        }
        
        setClients(clients.filter(client => client.id !== id));
        toast.success('Client deleted successfully');
      } catch (err: any) {
        console.error('Error deleting client:', err);
        toast.error('Failed to delete client');
      }
    }
  };

  const handleRefresh = () => {
    fetchClients();
    toast.info('Refreshing client list...');
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 border border-red-300 rounded-md">
        Error: {error}
        <Button variant="outline" className="mt-2" onClick={fetchClients}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isClinicAdmin && (
        <Alert className="bg-primary-50 border-primary-200">
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle>Clinic Admin View</AlertTitle>
          <AlertDescription>
            You are viewing all clients for {user?.name || 'your clinic'}. 
            This includes clients assigned to all coaches in your clinic.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-sm text-gray-500">
            {clients.length} client{clients.length !== 1 ? 's' : ''} found
            {isClinicAdmin ? ` in ${user?.name || 'your clinic'}` : ''}
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw size={14} />
          <span>Refresh</span>
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Coach</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Last Check-in</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length > 0 ? (
              clients.map((client) => (
                <TableRow key={client.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="bg-primary-100 h-8 w-8 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-700" />
                      </div>
                      <span className="font-medium">{client.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>
                    {client.programId ? (
                      <Badge variant="outline" className="bg-blue-50">
                        {(client as any).programs?.name || 'Unknown Program'}
                      </Badge>
                    ) : (
                      <span className="text-gray-500">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {client.coachId ? (
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span>{(client as any).coaches?.name || 'Unknown Coach'}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-600">
                      <CalendarClock className="h-4 w-4" />
                      {client.startDate || 'Not set'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {client.lastCheckIn || 'Never'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(client.id)}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(client.id)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(client.id)} 
                          className="text-red-600 focus:text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  {isClinicAdmin 
                    ? "No clients found in your clinic. Add clients or ask your coaches to add clients."
                    : "No clients found. Add clients to get started."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientList;
