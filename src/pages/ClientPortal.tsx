
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import ClientDashboard from './ClientDashboard';
import ClientMessages from '@/components/client/ClientMessages';
import ClientResources from '@/components/client/ClientResources';
import ClientJournal from '@/components/client/ClientJournal';

const ClientPortal = () => {
  const { user } = useAuth();
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Portal</h1>
        <p className="text-gray-500">Welcome back, {user?.name}!</p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="journal">Food Journal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <ClientDashboard />
        </TabsContent>
        
        <TabsContent value="messages">
          <ClientMessages />
        </TabsContent>
        
        <TabsContent value="resources">
          <ClientResources />
        </TabsContent>
        
        <TabsContent value="journal">
          <ClientJournal />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientPortal;
