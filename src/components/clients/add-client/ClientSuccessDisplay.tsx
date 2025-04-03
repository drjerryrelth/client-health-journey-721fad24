
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface ClientSuccessDisplayProps {
  email: string;
  tempPassword: string;
  onClose: () => void;
}

const ClientSuccessDisplay: React.FC<ClientSuccessDisplayProps> = ({
  email,
  tempPassword,
  onClose
}) => {
  return (
    <>
      <div className="py-4">
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription>
            <div className="flex flex-col gap-2">
              <p><strong>Client created successfully!</strong></p>
              <p>An account has been created for this client with the following details:</p>
              <p><strong>Username:</strong> {email}</p>
              <p><strong>Temporary Password:</strong> {tempPassword}</p>
              <p className="text-sm mt-2">
                The client will be prompted to change this password when they first log in.
                Please share these credentials with them.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      </div>
      <DialogFooter>
        <Button 
          onClick={onClose}
          className="w-full"
        >
          Done
        </Button>
      </DialogFooter>
    </>
  );
};

export default ClientSuccessDisplay;
