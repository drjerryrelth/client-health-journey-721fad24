
import React, { useState, useCallback } from 'react';
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

  const handleSubmit = useCallback(async (values: CoachFormValues) => {
    if (!coach) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // First close the dialog to prevent UI blocking
      onOpenChange(false);
      
      // Show a loading toast to indicate the update is in progress
      toast.loading("Updating coach information...");
      
      // Update coach in a non-blocking way
      setTimeout(async () => {
        try {
          const result = await CoachService.updateCoach(coach.id, {
            name: values.name,
            email: values.email,
            phone: values.phone,
            clinicId: coach.clinicId,
            status: coach.status
          });
          
          if (result) {
            // Dismiss the loading toast and show success
            toast.dismiss();
            toast.success(`${values.name}'s information has been updated`);
            
            // Notify parent with delay to prevent UI freezing
            if (onCoachUpdated) {
              // Use a longer delay to ensure UI has time to update
              setTimeout(onCoachUpdated, 500);
            }
          } else {
            toast.dismiss();
            toast.error("Failed to update coach information");
            setError("Failed to update coach information. Please try again.");
            setShowErrorDialog(true);
          }
        } catch (err) {
          toast.dismiss();
          console.error("Error updating coach:", err);
          const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
          toast.error(`Update failed: ${errorMessage}`);
          setError(errorMessage);
          setShowErrorDialog(true);
        } finally {
          setIsSubmitting(false);
        }
      }, 100);
    } catch (error) {
      console.error("Error preparing coach update:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      setShowErrorDialog(true);
      setIsSubmitting(false);
      onOpenChange(false);
    }
  }, [coach, onOpenChange, onCoachUpdated]);

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
