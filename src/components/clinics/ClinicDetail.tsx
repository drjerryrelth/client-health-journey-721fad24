
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Coach } from '@/services/coaches';
import { Clinic } from '@/services/clinic-service';
import CoachesTab from '@/components/clinics/CoachesTab';
import AddCoachDialog from '@/components/coaches/AddCoachDialog';
import EditCoachDialog from '@/components/coaches/EditCoachDialog';
import ReassignClientsDialog from '@/components/coaches/ReassignClientsDialog';
import ClinicDetailsTab from '@/components/clinics/ClinicDetailsTab';
import EditClinicDialog from '@/components/clinics/EditClinicDialog';
import { useToast } from '@/hooks/use-toast';
import { useCoachActions } from '@/hooks/use-coach-actions';

interface ClinicDetailProps {
  clinic: Clinic;
  onBackClick: () => void;
  getMockCoaches: () => Coach[];
}

const ClinicDetail = ({ clinic, onBackClick, getMockCoaches }: ClinicDetailProps) => {
  const { toast } = useToast();
  const [activeClinicTab, setActiveClinicTab] = useState('coaches');
  const [showAddCoachDialog, setShowAddCoachDialog] = useState(false);
  const [showEditCoachDialog, setShowEditCoachDialog] = useState(false);
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  const [showEditClinicDialog, setShowEditClinicDialog] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [replacementCoachId, setReplacementCoachId] = useState<string>('');
  const [coachListRefreshTrigger, setCoachListRefreshTrigger] = useState(0);
  
  // Use our extracted coach actions hook
  const { handleDeleteCoach, handleReassignAndDelete: reassignAndDelete } = useCoachActions(
    clinic.name,
    toast
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddCoach = () => {
    setShowAddCoachDialog(true);
  };

  const handleCoachAdded = () => {
    setCoachListRefreshTrigger(prev => prev + 1);
  };

  const handleEditCoach = (coach: Coach) => {
    setSelectedCoach(coach);
    setShowEditCoachDialog(true);
  };

  const handleCoachDelete = (coach: Coach) => {
    if (coach.clients > 0) {
      setSelectedCoach(coach);
      setShowReassignDialog(true);
    } else {
      handleDeleteCoach(coach);
      // Refresh the coach list after deletion
      setTimeout(() => setCoachListRefreshTrigger(prev => prev + 1), 500);
    }
  };

  const handleEditClinic = () => {
    setShowEditClinicDialog(true);
  };

  const handleReassignAndDelete = async () => {
    if (selectedCoach) {
      await reassignAndDelete(selectedCoach.id, replacementCoachId);
      setShowReassignDialog(false);
      setReplacementCoachId('');
      setCoachListRefreshTrigger(prev => prev + 1);
    }
  };

  const availableCoaches = selectedCoach
    ? getMockCoaches()
        .filter(coach => coach.clinicId === clinic.id && coach.id !== selectedCoach.id)
    : [];

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={onBackClick}
          className="mr-2 flex items-center gap-1"
        >
          <ArrowLeft size={18} />
          <span>Back to All Clinics</span>
        </Button>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900">{clinic.name}</h1>
          <div className="flex items-center mt-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(clinic.status)}`}>
              {clinic.status.toUpperCase()}
            </span>
            {clinic.subscriptionTier && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {clinic.subscriptionTier.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <Tabs value={activeClinicTab} onValueChange={setActiveClinicTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="coaches">Coaches</TabsTrigger>
          <TabsTrigger value="details">Clinic Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="coaches">
          <CoachesTab 
            clinicName={clinic.name}
            clinicId={clinic.id}
            onAddCoach={handleAddCoach}
            refreshTrigger={coachListRefreshTrigger}
            onEditCoach={handleEditCoach}
            onDeleteCoach={handleCoachDelete}
          />
        </TabsContent>
        
        <TabsContent value="details">
          <ClinicDetailsTab 
            clinic={clinic}
            onEditClick={handleEditClinic}
          />
        </TabsContent>
      </Tabs>

      <AddCoachDialog 
        open={showAddCoachDialog} 
        onOpenChange={setShowAddCoachDialog} 
        clinicName={clinic.name}
        clinicId={clinic.id}
        onCoachAdded={handleCoachAdded}
      />

      <EditCoachDialog 
        open={showEditCoachDialog} 
        onOpenChange={setShowEditCoachDialog} 
        coach={selectedCoach} 
        clinicName={clinic.name} 
      />

      <ReassignClientsDialog 
        open={showReassignDialog}
        onOpenChange={setShowReassignDialog}
        selectedCoach={selectedCoach}
        availableCoaches={availableCoaches}
        replacementCoachId={replacementCoachId}
        setReplacementCoachId={setReplacementCoachId}
        onReassignAndDelete={handleReassignAndDelete}
      />

      <EditClinicDialog 
        open={showEditClinicDialog} 
        onOpenChange={setShowEditClinicDialog} 
        clinicId={clinic.id}
        onClinicUpdated={() => {
          // Refresh clinic details after update
          if (clinic.id) {
            handleEditClinic();
          }
        }}
      />
    </div>
  );
};

export default ClinicDetail;
