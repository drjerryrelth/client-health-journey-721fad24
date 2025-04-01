
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Clinic } from '@/services/clinic-service';
import { Coach } from '@/services/coaches';
import ClinicHeader from './header/ClinicHeader';
import TabsManager from './tabs/TabsManager';
import DialogManager from './dialogs/DialogManager';

interface ClinicDetailProps {
  clinic: Clinic;
  onBackClick: () => void;
  getMockCoaches?: () => any[];
}

const ClinicDetail = ({ clinic, onBackClick, getMockCoaches }: ClinicDetailProps) => {
  const { toast } = useToast();
  // Dialog visibility states
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddCoachDialog, setShowAddCoachDialog] = useState(false);
  const [showEditCoachDialog, setShowEditCoachDialog] = useState(false);
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  
  // Coach management states
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [refreshCoachTrigger, setRefreshCoachTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Client reassignment states
  const [availableCoaches, setAvailableCoaches] = useState<Coach[]>([]);
  const [replacementCoachId, setReplacementCoachId] = useState('');

  // Event handlers
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
    
    // Fetch available coaches for reassignment
    if (getMockCoaches) {
      const coaches = getMockCoaches().filter(c => c.id !== coach.id && c.clinicId === clinic.id);
      setAvailableCoaches(coaches);
    } else {
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
    setReplacementCoachId('');
  }, [toast]);

  const handleEditClick = () => {
    setShowEditDialog(true);
  };

  const handleReassignAndDelete = useCallback(() => {
    // In a real app, this would call an API to reassign clients and delete the coach
    console.log(`Reassigning clients from coach ${selectedCoach?.id} to coach ${replacementCoachId}`);
    
    handleCoachDeleted();
  }, [selectedCoach, replacementCoachId, handleCoachDeleted]);

  return (
    <>
      <ClinicHeader onBackClick={onBackClick} onEditClick={handleEditClick} />

      <Card>
        <CardContent className="pt-6">
          <TabsManager
            clinic={clinic}
            onEditClick={handleEditClick}
            onAddCoach={handleAddCoach}
            onEditCoach={handleEditCoach}
            onDeleteCoach={handleDeleteCoach}
            refreshCoachTrigger={refreshCoachTrigger}
            isRefreshing={isRefreshing}
            setIsRefreshing={setIsRefreshing}
          />
        </CardContent>
      </Card>

      <DialogManager
        clinic={{
          id: clinic.id,
          name: clinic.name,
        }}
        dialogs={{
          editClinic: showEditDialog,
          addCoach: showAddCoachDialog,
          editCoach: showEditCoachDialog,
          reassignClients: showReassignDialog,
        }}
        setDialogs={{
          setEditClinic: setShowEditDialog,
          setAddCoach: setShowAddCoachDialog,
          setEditCoach: setShowEditCoachDialog,
          setReassignClients: setShowReassignDialog,
        }}
        selectedCoach={selectedCoach}
        availableCoaches={availableCoaches}
        replacementCoachId={replacementCoachId}
        setReplacementCoachId={setReplacementCoachId}
        handlers={{
          handleClinicUpdate,
          handleCoachAdded,
          handleCoachUpdated,
          handleReassignAndDelete,
        }}
      />
    </>
  );
};

export default ClinicDetail;
