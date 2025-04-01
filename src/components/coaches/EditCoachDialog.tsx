
import React, { useState, useCallback, useEffect } from 'react';
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
  const [formValues, setFormValues] = useState<CoachFormValues | null>(null);

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

  // Reset state when dialog opens or closes
  useEffect(() => {
    if (!open) {
      // Small delay to avoid state updates during unmount
      setTimeout(() => {
        setFormValues(null);
        setError(null);
      }, 300);
    }
  }, [open]);

  // Process update completely separate from the dialog
  useEffect(() => {
    let isMounted = true;
    let updateTimeoutId: number | null = null;
    
    const processUpdate = async () => {
      if (!formValues || !coach) return;
      
      try {
        // Show a loading toast to indicate the update is in progress
        const toastId = toast.loading("Updating coach information...");
        
        const result = await CoachService.updateCoach(coach.id, {
          name: formValues.name,
          email: formValues.email,
          phone: formValues.phone,
          clinicId: coach.clinicId,
          status: coach.status
        });
        
        if (isMounted) {
          if (result) {
            toast.dismiss(toastId);
            toast.success(`${formValues.name}'s information has been updated`);
            
            // Notify parent component of the update with a delay
            if (onCoachUpdated) {
              setTimeout(() => onCoachUpdated(), 500);
            }
          } else {
            toast.dismiss(toastId);
            toast.error("Failed to update coach information");
            setError("Failed to update coach information. Please try again.");
            setShowErrorDialog(true);
          }
          
          // Reset submission state
          setIsSubmitting(false);
          setFormValues(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error updating coach:", err);
          const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
          toast.error(`Update failed: ${errorMessage}`);
          setError(errorMessage);
          setShowErrorDialog(true);
          setIsSubmitting(false);
        }
      }
    };
    
    if (formValues && !isSubmitting) {
      // Ensure we're not in the middle of a React render cycle
      updateTimeoutId = window.setTimeout(() => {
        processUpdate();
      }, 50);
    }
    
    return () => {
      isMounted = false;
      if (updateTimeoutId) {
        clearTimeout(updateTimeoutId);
      }
    };
  }, [formValues, coach, onCoachUpdated, isSubmitting]);

  // Changed to async to match expected type
  const handleSubmit = useCallback(async (values: CoachFormValues) => {
    // Just store the values and close the dialog immediately
    setFormValues(values);
    onOpenChange(false);
    // Return a resolved Promise to satisfy type requirements
    return Promise.resolve();
  }, [onOpenChange]);

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
