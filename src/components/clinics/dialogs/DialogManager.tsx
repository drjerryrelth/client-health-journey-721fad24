
import React from 'react';
import { Coach } from '@/services/coaches';
import EditClinicDialog from '../EditClinicDialog';
import AddCoachDialog from '@/components/coaches/AddCoachDialog';
import EditCoachDialog from '@/components/coaches/EditCoachDialog';
import ReassignClientsDialog from '@/components/coaches/ReassignClientsDialog';

interface DialogManagerProps {
  clinic: {
    id: string;
    name: string;
  };
  dialogs: {
    editClinic: boolean;
    addCoach: boolean;
    editCoach: boolean;
    reassignClients: boolean;
  };
  setDialogs: {
    setEditClinic: (open: boolean) => void;
    setAddCoach: (open: boolean) => void;
    setEditCoach: (open: boolean) => void;
    setReassignClients: (open: boolean) => void;
  };
  selectedCoach: Coach | null;
  availableCoaches: Coach[];
  replacementCoachId: string;
  setReplacementCoachId: (id: string) => void;
  handlers: {
    handleClinicUpdate: () => void;
    handleCoachAdded: () => void;
    handleCoachUpdated: () => void;
    handleReassignAndDelete: () => void;
  };
}

const DialogManager = ({
  clinic,
  dialogs,
  setDialogs,
  selectedCoach,
  availableCoaches,
  replacementCoachId,
  setReplacementCoachId,
  handlers,
}: DialogManagerProps) => {
  return (
    <>
      {/* Edit clinic dialog */}
      <EditClinicDialog
        open={dialogs.editClinic}
        onOpenChange={setDialogs.setEditClinic}
        clinicId={clinic.id}
        onClinicUpdated={handlers.handleClinicUpdate}
      />
      
      {/* Add coach dialog */}
      <AddCoachDialog
        open={dialogs.addCoach}
        onOpenChange={setDialogs.setAddCoach}
        clinicId={clinic.id}
        clinicName={clinic.name}
        onCoachAdded={handlers.handleCoachAdded}
      />
      
      {/* Edit coach dialog */}
      {selectedCoach && (
        <EditCoachDialog
          open={dialogs.editCoach}
          onOpenChange={setDialogs.setEditCoach}
          coach={selectedCoach}
          clinicName={clinic.name}
          onCoachUpdated={handlers.handleCoachUpdated}
        />
      )}
      
      {/* Reassign clients dialog */}
      {selectedCoach && (
        <ReassignClientsDialog
          open={dialogs.reassignClients}
          onOpenChange={setDialogs.setReassignClients}
          selectedCoach={selectedCoach}
          availableCoaches={availableCoaches}
          replacementCoachId={replacementCoachId}
          setReplacementCoachId={setReplacementCoachId}
          onReassignAndDelete={handlers.handleReassignAndDelete}
        />
      )}
    </>
  );
};

export default DialogManager;
