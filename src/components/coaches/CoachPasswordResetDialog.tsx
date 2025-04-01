
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Coach } from '@/services/coaches';

interface CoachPasswordResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coach: Coach | null;
  onPasswordReset?: () => void;
}

const CoachPasswordResetDialog: React.FC<CoachPasswordResetDialogProps> = ({
  open,
  onOpenChange,
  coach,
  onPasswordReset
}) => {
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
      // Send password reset email via Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(coach.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
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
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CoachPasswordResetDialog;
