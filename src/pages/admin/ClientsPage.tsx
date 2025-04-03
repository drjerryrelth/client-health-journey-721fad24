
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ClientList from '@/components/clients/ClientList';
import CoachClientList from '@/components/clients/CoachClientList';
import { useAuth } from '@/context/AuthContext';
import { useCoachActions } from '@/hooks/use-coach-actions';
import { useSearchParams } from 'react-router-dom';
import AddClientDialog from '@/components/clients/AddClientDialog';

const ClientsPage = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const action = searchParams.get('action');
  const isCoach = hasRole('coach');
  const { isLoading } = useCoachActions();
  
  // State to control dialog visibility
  const [dialogOpen, setDialogOpen] = useState(action === 'add');
  
  // Handle opening the dialog directly
  const handleAddClientClick = () => {
    setDialogOpen(true);
    setSearchParams({ action: 'add' });
  };

  // Handle dialog close
  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      // Remove the action parameter without triggering a loop
      if (action === 'add') {
        setSearchParams({});
      }
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
      
      <Card>
        <CardHeader>
          <CardTitle>{isCoach ? 'Your Clients' : 'All Clients'}</CardTitle>
        </CardHeader>
        <CardContent>
          {isCoach ? 
            <CoachClientList onAddClient={handleAddClientClick} /> : 
            <ClientList />
          }
        </CardContent>
      </Card>
      
      {/* Add Client Dialog */}
      <AddClientDialog open={dialogOpen} onOpenChange={handleDialogOpenChange} />
    </div>
  );
};

export default ClientsPage;
