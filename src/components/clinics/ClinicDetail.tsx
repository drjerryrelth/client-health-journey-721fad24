
import React, { useState, useCallback } from 'react';
import { ArrowLeft, AlertCircle, Edit, Trash } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Clinic } from '@/services/clinic-service';
import EditClinicDialog from './EditClinicDialog';
import ClinicDetailsTab from './ClinicDetailsTab';
import CoachesTab from './CoachesTab';
import { Coach } from '@/services/coaches';
import AddCoachDialog from '@/components/coaches/AddCoachDialog';
import EditCoachDialog from '@/components/coaches/EditCoachDialog';
import ReassignClientsDialog from '@/components/coaches/ReassignClientsDialog';

interface ClinicDetailProps {
  clinic: Clinic;
  onBackClick: () => void;
  getMockCoaches?: () => any[];
}

const ClinicDetail = ({ clinic, onBackClick, getMockCoaches }: ClinicDetailProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('details');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddCoachDialog, setShowAddCoachDialog] = useState(false);
  const [showEditCoachDialog, setShowEditCoachDialog] = useState(false);
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [refreshCoachTrigger, setRefreshCoachTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // For reassigning clients
  const [availableCoaches, setAvailableCoaches] = useState<Coach[]>([]);
  const [replacementCoachId, setReplacementCoachId] = useState('');

  const handleClinicUpdate = () => {
    toast({
      title: "Clinic Updated",
      description: "The clinic information has been updated successfully."
    });
    setShowEditDialog(false);
  };

  const handleAddCoach = () => {
    setShowAddCoachDialog(true);
  };

  const handleCoachAdded = () => {
    toast({
      title: "Coach Added",
      description: "The coach has been added successfully."
    });
    setShowAddCoachDialog(false);
    
    // Refresh the coach list
    setRefreshCoachTrigger(prev => prev + 1);
  };

  const handleEditCoach = useCallback((coach: Coach) => {
    setSelectedCoach(coach);
    setShowEditCoachDialog(true);
  }, []);

  const handleCoachUpdated = useCallback(() => {
    toast({
      title: "Coach Updated",
      description: "The coach information has been updated successfully."
    });
    
    // Close dialog first for better UX
    setShowEditCoachDialog(false);
    
    // Then refresh the list
    setTimeout(() => {
      setRefreshCoachTrigger(prev => prev + 1);
    }, 100);
  }, [toast]);

  const handleDeleteCoach = useCallback((coach: Coach) => {
    setSelectedCoach(coach);
    
    // We need to fetch available coaches for reassignment
    // This would typically be done with an API call
    // For now, we'll simulate it with a simple filter
    if (getMockCoaches) {
      const coaches = getMockCoaches().filter(c => c.id !== coach.id && c.clinicId === clinic.id);
      setAvailableCoaches(coaches);
    } else {
      // In a real app, fetch coaches from API
      setAvailableCoaches([]);
    }
    
    setShowReassignDialog(true);
  }, [clinic.id, getMockCoaches]);

  const handleCoachDeleted = useCallback(() => {
    toast({
      title: "Coach Deleted",
      description: "The coach has been deleted and clients reassigned."
    });
    setShowReassignDialog(false);
    setRefreshCoachTrigger(prev => prev + 1);
    // Reset the replacement coach ID
    setReplacementCoachId('');
  }, [toast]);

  const handleEditClick = () => {
    setShowEditDialog(true);
  };

  // Function to handle the reassign and delete action
  const handleReassignAndDelete = useCallback(() => {
    // In a real app, this would call an API to reassign clients
    // and then delete the coach
    console.log(`Reassigning clients from coach ${selectedCoach?.id} to coach ${replacementCoachId}`);
    
    // After successful reassignment and deletion
    handleCoachDeleted();
  }, [selectedCoach, replacementCoachId, handleCoachDeleted]);

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Button variant="outline" onClick={onBackClick} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to All Clinics
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowEditDialog(true)} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Clinic
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="details">Clinic Details</TabsTrigger>
              <TabsTrigger value="coaches">Coaches</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <ClinicDetailsTab clinic={clinic} onEditClick={handleEditClick} />
            </TabsContent>

            <TabsContent value="coaches">
              <CoachesTab 
                clinicName={clinic.name} 
                clinicId={clinic.id} 
                clinicEmail={clinic.email}
                onAddCoach={handleAddCoach}
                onEditCoach={handleEditCoach}
                onDeleteCoach={handleDeleteCoach}
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
        </CardContent>
      </Card>

      {/* Edit clinic dialog */}
      <EditClinicDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        clinicId={clinic.id}
        onClinicUpdated={handleClinicUpdate}
      />
      
      {/* Add coach dialog */}
      <AddCoachDialog
        open={showAddCoachDialog}
        onOpenChange={setShowAddCoachDialog}
        clinicId={clinic.id}
        clinicName={clinic.name}
        onCoachAdded={handleCoachAdded}
      />
      
      {/* Edit coach dialog */}
      {selectedCoach && (
        <EditCoachDialog
          open={showEditCoachDialog}
          onOpenChange={setShowEditCoachDialog}
          coach={selectedCoach}
          clinicName={clinic.name}
          onCoachUpdated={handleCoachUpdated}
        />
      )}
      
      {/* Reassign clients dialog */}
      {selectedCoach && (
        <ReassignClientsDialog
          open={showReassignDialog}
          onOpenChange={setShowReassignDialog}
          selectedCoach={selectedCoach}
          availableCoaches={availableCoaches}
          replacementCoachId={replacementCoachId}
          setReplacementCoachId={setReplacementCoachId}
          onReassignAndDelete={handleReassignAndDelete}
        />
      )}
    </>
  );
};

export default ClinicDetail;
