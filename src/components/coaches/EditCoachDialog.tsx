
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CoachForm, CoachFormValues } from './CoachForm';
import ErrorDialog from './ErrorDialog';
import { Coach, CoachService } from '@/services/coaches';
import { toast } from 'sonner';

interface EditCoachDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coach: Coach | null;
  clinicName: string;
  onCoachUpdated?: () => void;
}

const EditCoachDialog = ({ open, onOpenChange, coach, clinicName, onCoachUpdated }: EditCoachDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  // Prepare default values for the form
  const defaultValues = coach ? {
    name: coach.name,
    email: coach.email,
    phone: coach.phone || ''
  } : {
    name: '',
    email: '',
    phone: ''
  };

  const handleSubmit = async (values: CoachFormValues) => {
    if (!coach) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      console.log('Updating coach with values:', values);
      
      const result = await CoachService.updateCoach(coach.id, {
        name: values.name,
        email: values.email,
        phone: values.phone,
        clinicId: coach.clinicId,
        status: coach.status
      });
      
      if (result) {
        toast(`${values.name}'s information has been updated.`);
        
        // Call the onCoachUpdated callback if provided
        if (onCoachUpdated) {
          onCoachUpdated();
        }
        
        onOpenChange(false);
      } else {
        setError("Failed to update coach information. Please try again.");
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error("Error updating coach:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      setShowErrorDialog(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Coach</DialogTitle>
            <DialogDescription>
              Update coach information for {clinicName}.
            </DialogDescription>
          </DialogHeader>
          
          {coach && (
            <CoachForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              onCancel={handleCancel}
              defaultValues={defaultValues}
              submitButtonText="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>

      <ErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        errorDetails={error}
        title="Update Error"
      />
    </>
  );
};

export default EditCoachDialog;
