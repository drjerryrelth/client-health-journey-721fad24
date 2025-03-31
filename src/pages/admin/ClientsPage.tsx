
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ClientList from '@/components/clients/ClientList';
import CoachClientList from '@/components/clients/CoachClientList';
import { useAuth } from '@/context/AuthContext';
import { useCoachActions } from '@/hooks/use-coach-actions';
import { useSearchParams } from 'react-router-dom';

const ClientsPage = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action');
  const isCoach = hasRole('coach');
  const { addClient, isLoading } = useCoachActions();

  const handleAddClientClick = async () => {
    if (isCoach) {
      await addClient();
    } else {
      navigate('/clients/add');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <Button onClick={handleAddClientClick} disabled={isLoading}>
          Add Client
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{isCoach ? 'Your Clients' : 'All Clients'}</CardTitle>
        </CardHeader>
        <CardContent>
          {isCoach ? <CoachClientList /> : <ClientList />}
        </CardContent>
      </Card>
      
      {action === 'add' && (
        <div className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Client</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Client form would go here.</p>
              {/* Add the client form component when it's built */}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
