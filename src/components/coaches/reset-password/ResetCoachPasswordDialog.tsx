
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Coach, CoachService } from '@/services/coaches';

interface ResetCoachPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coach: Coach | null;
  onPasswordReset?: () => void;
}

export const ResetCoachPasswordDialog = ({
  open,
  onOpenChange,
  coach,
  onPasswordReset
}: ResetCoachPasswordDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleReset = async () => {
    if (!coach?.email) {
      setErrorMessage('No email provided for password reset');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // Use the service to reset the coach's password
      await CoachService.resetCoachPassword(coach.email);
      
      toast.success(`Password reset link sent to ${coach.name}'s email`);
      onOpenChange(false);
      if (onPasswordReset) onPasswordReset();
    } catch (error: any) {
      console.error('Error during password reset:', error);
      setErrorMessage(error.message || 'Failed to reset password');
      toast.error(`Failed to reset password for ${coach.name}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setErrorMessage(null);
  };

  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Coach Password</DialogTitle>
          <DialogDescription>
            {coach?.email 
              ? `Send a password reset link to ${coach.name} at ${coach.email}`
              : 'Send a password reset link to the coach email address'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {errorMessage && (
            <div className="text-sm font-medium text-destructive">{errorMessage}</div>
          )}
          
          <p className="text-sm text-muted-foreground">
            This will send an email with a secure link that will allow the coach to reset their password.
          </p>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleReset}
            disabled={isSubmitting || !coach}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
