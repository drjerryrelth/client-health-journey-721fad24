
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ResetClinicPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinicEmail?: string;
  onPasswordReset?: () => void;
}

const ResetClinicPasswordDialog: React.FC<ResetClinicPasswordDialogProps> = ({
  open,
  onOpenChange,
  clinicEmail,
  onPasswordReset
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleReset = async () => {
    // Validate inputs
    if (!newPassword) {
      setErrorMessage('Please enter a new password');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // Send password reset email via Supabase
      if (clinicEmail) {
        // In a production environment, this would use admin rights to reset the password directly
        // For now, we'll just send a password reset email
        const { error } = await supabase.auth.resetPasswordForEmail(clinicEmail, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;
        
        toast.success('Password reset link sent to clinic email');
        onOpenChange(false);
        if (onPasswordReset) onPasswordReset();
      } else {
        toast.error('No email provided for password reset');
      }
    } catch (error: any) {
      console.error('Error during password reset:', error);
      setErrorMessage(error.message || 'Failed to reset password');
      toast.error('Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewPassword('');
    setConfirmPassword('');
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
          <DialogTitle>Reset Clinic Password</DialogTitle>
          <DialogDescription>
            {clinicEmail 
              ? `Send a password reset link to ${clinicEmail}`
              : 'Send a password reset link to the clinic email address'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {errorMessage && (
            <div className="text-sm font-medium text-destructive">{errorMessage}</div>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-password" className="text-right">
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="col-span-3"
              placeholder="Enter new password"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirm-password" className="text-right">
              Confirm Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="col-span-3"
              placeholder="Confirm new password"
              disabled={isSubmitting}
            />
          </div>
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetClinicPasswordDialog;
