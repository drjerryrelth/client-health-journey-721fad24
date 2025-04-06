
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ClientList from '@/components/clients/ClientList';
import CoachClientList from '@/components/clients/CoachClientList';
import { useAuth } from '@/context/auth';
import { useCoachActions } from '@/hooks/use-coach-actions';
import { useSearchParams } from 'react-router-dom';
import { AddClientDialog } from '@/components/clients/add-client';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ClientsPage = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const action = searchParams.get('action');
  const isCoach = hasRole('coach');
  const isClinicAdmin = user?.role === 'clinic_admin';
  const isSystemAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const { isLoading } = useCoachActions();
  
  // State to control dialog visibility
  const [dialogOpen, setDialogOpen] = useState(action === 'add');
  
  // Effect to ensure clinic admins only see their clinic's clients
  useEffect(() => {
    if (isClinicAdmin && !user?.clinicId) {
      toast.error("Missing clinic information. Please contact support.");
      navigate('/unauthorized', { replace: true });
    }
    
    console.log('ClientsPage - User role:', user?.role, 'Clinic ID:', user?.clinicId);
  }, [isClinicAdmin, user?.clinicId, navigate, user?.role]);
  
  // Handle opening the dialog directly
  const handleAddClientClick = () => {
    setDialogOpen(true);
    // Only update URL if the dialog wasn't already open
    if (!dialogOpen) {
      setSearchParams({ action: 'add' });
    }
  };

  // Handle dialog close
  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    // When closing, clear the URL parameter
    if (!open && action === 'add') {
      setSearchParams({});
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <Button onClick={handleAddClientClick} disabled={isLoading}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>
      
      {isClinicAdmin && (
        <Alert className="mb-6 bg-primary-50 border-primary-200">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertTitle>Clinic Admin View</AlertTitle>
          <AlertDescription>
            You are viewing all clients for {user?.name || 'your clinic'}. 
            This includes clients assigned to all coaches in your clinic.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>
            {isCoach ? 'Your Clients' : 
             isClinicAdmin ? `${user?.name || 'Clinic'} Clients` :
             'All Clients'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isCoach ? 
            <CoachClientList onAddClient={handleAddClientClick} /> : 
            <ClientList clinicId={isClinicAdmin ? user?.clinicId : undefined} />
          }
        </CardContent>
      </Card>
      
      {/* Add Client Dialog - controlled by local state, not directly by URL */}
      <AddClientDialog 
        open={dialogOpen} 
        onOpenChange={handleDialogOpenChange}
        clinicId={isClinicAdmin ? user?.clinicId : undefined}
      />
    </div>
  );
};

export default ClientsPage;
