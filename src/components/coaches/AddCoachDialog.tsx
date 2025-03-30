
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import CoachService from '@/services/coaches';
import { checkAuthentication } from '@/services/clinics/auth-helper';
import { useAuth } from '@/context/auth';
import { CoachForm } from './CoachForm';
import ErrorDialog from './ErrorDialog';
import { CoachFormValues } from './schema/coach-form-schema';

interface AddCoachDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinicName: string;
  clinicId: string;
  onCoachAdded?: () => void;
}

const AddCoachDialog = ({ 
  open, 
  onOpenChange, 
  clinicName, 
  clinicId, 
  onCoachAdded 
}: AddCoachDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    if (open) {
      const verifyAuth = async () => {
        const session = await checkAuthentication();
        if (!session) {
          toast.error("You must be logged in to add a coach");
          onOpenChange(false);
        }
      };
      
      verifyAuth();
    }
  }, [open, onOpenChange]);

  const handleSubmitAddCoach = async (values: CoachFormValues) => {
    try {
      setIsSubmitting(true);
      setErrorDetails(null);
      
      console.log('[AddCoachDialog] Submitting coach data:', {
        name: values.name,
        email: values.email,
        phone: values.phone || null,
        clinicId: clinicId
      });
      
      console.log('[AddCoachDialog] Current auth context user:', user);
      
      const session = await checkAuthentication();
      if (!session) {
        setErrorDetails("Authentication verification failed. Please try logging in again.");
        setShowErrorDialog(true);
        toast.error("Authentication required to add a coach.");
        return;
      }
      
      console.log('[AddCoachDialog] Session verified before submission:', session.user.id);
      
      const newCoach = await CoachService.addCoach({
        name: values.name,
        email: values.email,
        phone: values.phone || null,
        status: 'active',
        clinicId: clinicId
      });

      if (newCoach) {
        toast.success(`${values.name} has been added to ${clinicName}`);
        onOpenChange(false);
        if (onCoachAdded) onCoachAdded();
      } else {
        throw new Error("Coach addition failed - service returned null");
      }
    } catch (error) {
      console.error("[AddCoachDialog] Error adding coach:", error);
      
      if (error instanceof Error) {
        setErrorDetails(error.message);
      } else {
        setErrorDetails(String(error));
      }
      
      setShowErrorDialog(true);
      toast.error("Failed to add coach. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogChange = (open: boolean) => {
    onOpenChange(open);
  };

  const handleCancel = () => {
    handleDialogChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Coach</DialogTitle>
            <DialogDescription>
              Add a new coach to {clinicName}. They will receive an email invitation to set up their account.
            </DialogDescription>
          </DialogHeader>
          
          <CoachForm 
            onSubmit={handleSubmitAddCoach}
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>

      <ErrorDialog 
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        errorDetails={errorDetails}
        title="Error Adding Coach"
      />
    </>
  );
};

export default AddCoachDialog;
