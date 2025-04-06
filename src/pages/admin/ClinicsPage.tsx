
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ClinicsOverview from '@/components/clinics/ClinicsOverview';
import CoachesPage from './CoachesPage';
import ClientsPage from './ClientsPage';
import { useAuth } from '@/context/auth';
import { useCoachActions } from '@/hooks/use-coach-actions';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ClinicsPage = () => {
  const [activeTab, setActiveTab] = useState('clinics');
  const { user } = useAuth();
  const isClinicAdmin = user?.role === 'clinic_admin';
  const { isLoading } = useCoachActions();
  const [clinics, setClinics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch clinics data on component mount
  React.useEffect(() => {
    const fetchClinics = async () => {
      try {
        const { data, error } = await supabase
          .from('clinics')
          .select('*');
        
        if (error) throw error;
        
        // Transform the data to match the FormattedClinic interface
        const formattedClinics = data.map(clinic => ({
          id: clinic.id,
          name: clinic.name,
          coaches: clinic.coach_count || 0,
          clients: clinic.client_count || 0,
          city: clinic.city,
          state: clinic.state,
          status: clinic.status || 'active'
        }));
        
        setClinics(formattedClinics);
      } catch (error) {
        console.error('Error fetching clinics:', error);
        toast.error('Failed to load clinics');
      } finally {
        setIsLoading(false);
      }
    };

    if (!isClinicAdmin) {
      fetchClinics();
    }
  }, [isClinicAdmin]);

  // Handler functions for clinic actions
  const handleClinicSelect = (clinicId) => {
    console.log('Selected clinic:', clinicId);
    // Implement clinic selection logic here
    // Could navigate to clinic details or set a selected clinic state
  };

  const handleAddClinic = () => {
    console.log('Add clinic clicked');
    // Implement add clinic logic here
    // Could open a modal or navigate to an add clinic page
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

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
            <ClinicsOverview 
              clinics={clinics}
              onClinicSelect={handleClinicSelect}
              onAddClinic={handleAddClinic}
              getStatusColor={getStatusColor}
            />
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
