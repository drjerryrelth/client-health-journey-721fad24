import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ClinicsOverview from '@/components/clinics/ClinicsOverview';
import CoachesPage from './CoachesPage';
import ClientsPage from './ClientsPage';
import { useAuth } from '@/context/auth';
import { useCoachActions } from '@/hooks/use-coach-actions';

const ClinicsPage = () => {
  const [activeTab, setActiveTab] = useState('clinics');
  const { user } = useAuth();
  const isClinicAdmin = user?.role === 'clinic_admin';
  const { isLoading } = useCoachActions();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">
        {isClinicAdmin ? 'Clinic Management' : 'Clinics Management'}
      </h1>
      
      {isClinicAdmin ? (
        <div>
          <Tabs defaultValue="coaches">
            <TabsList className="mb-6">
              <TabsTrigger value="coaches">Coaches</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
            </TabsList>
            <TabsContent value="coaches">
              <CoachesPage />
            </TabsContent>
            <TabsContent value="clients">
              <ClientsPage />
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="clinics">Clinics</TabsTrigger>
            <TabsTrigger value="coaches">Coaches</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>
          <TabsContent value="clinics">
            <ClinicsOverview />
          </TabsContent>
          <TabsContent value="coaches">
            <CoachesPage />
          </TabsContent>
          <TabsContent value="clients">
            <ClientsPage />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ClinicsPage;
