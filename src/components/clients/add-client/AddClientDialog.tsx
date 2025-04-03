
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AddClientForm from './AddClientForm';
import ClientSuccessDisplay from './ClientSuccessDisplay';

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinicId?: string;  // Added clinicId as an optional prop
}

const AddClientDialog: React.FC<AddClientDialogProps> = ({ open, onOpenChange, clinicId }) => {
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [clientEmail, setClientEmail] = useState<string>('');
  
  // Handle successful client creation
  const handleSuccess = (email: string, password: string) => {
    setClientEmail(email);
    setTempPassword(password);
  };

  // Close the dialog and reset temp password
  const handleClose = () => {
    setTempPassword(null);
    setClientEmail('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={tempPassword ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Create a new client record for your practice.
          </DialogDescription>
        </DialogHeader>

        {tempPassword ? (
          <ClientSuccessDisplay 
            email={clientEmail}
            tempPassword={tempPassword}
            onClose={handleClose}
          />
        ) : (
          <AddClientForm 
            onSuccess={handleSuccess}
            onCancel={() => onOpenChange(false)}
            clinicId={clinicId}  // Pass clinicId to the AddClientForm
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddClientDialog;
