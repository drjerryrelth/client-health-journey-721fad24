
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clinic } from '@/services/clinic-service';
import ClinicDetailsTab from '../ClinicDetailsTab';
import CoachesTab from '../CoachesTab';
import { Coach } from '@/services/coaches';

interface TabsManagerProps {
  clinic: Clinic;
  onEditClick: () => void;
  onAddCoach: () => void;
  onEditCoach: (coach: Coach) => void;
  onDeleteCoach: (coach: Coach) => void;
  refreshCoachTrigger: number;
  isRefreshing: boolean;
  setIsRefreshing: (isRefreshing: boolean) => void;
}

const TabsManager = ({
  clinic,
  onEditClick,
  onAddCoach,
  onEditCoach,
  onDeleteCoach,
  refreshCoachTrigger,
  isRefreshing,
  setIsRefreshing,
}: TabsManagerProps) => {
  const [activeTab, setActiveTab] = React.useState('details');
  
  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="details">Clinic Details</TabsTrigger>
        <TabsTrigger value="coaches">Coaches</TabsTrigger>
        <TabsTrigger value="clients">Clients</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>

      <TabsContent value="details">
        <ClinicDetailsTab clinic={clinic} onEditClick={onEditClick} />
      </TabsContent>

      <TabsContent value="coaches">
        <CoachesTab
          clinicName={clinic.name} 
          clinicId={clinic.id}
          clinicEmail={clinic.email}
          onAddCoach={onAddCoach}
          onEditCoach={onEditCoach}
          onDeleteCoach={onDeleteCoach}
          refreshTrigger={refreshCoachTrigger}
          isRefreshing={isRefreshing}
          setIsRefreshing={setIsRefreshing}
        />
      </TabsContent>
      
      <TabsContent value="clients">
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">Clients Management</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Client management functionality is coming soon. You will be able to view, add, and manage clients for this clinic.
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="billing">
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">Billing Information</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Detailed billing information and payment management is coming soon. You will be able to manage subscriptions and payments for this clinic.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default TabsManager;
