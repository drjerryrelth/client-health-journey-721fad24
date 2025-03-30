
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface AddClinicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddClinicDialog = ({ open, onOpenChange }: AddClinicDialogProps) => {
  const { toast } = useToast();
  const [clinicName, setClinicName] = useState('');
  const [clinicLocation, setClinicLocation] = useState('');
  const [clinicEmail, setClinicEmail] = useState('');
  const [clinicPhone, setClinicPhone] = useState('');

  const handleSubmitClinic = () => {
    if (!clinicName || !clinicLocation) {
      toast({
        title: "Missing Information",
        description: "Please provide clinic name and location.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Clinic Added",
      description: `${clinicName} has been added successfully.`
    });
    
    // Reset form and close dialog
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setClinicName('');
    setClinicLocation('');
    setClinicEmail('');
    setClinicPhone('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Clinic</DialogTitle>
          <DialogDescription>
            Add a new clinic to your organization. You'll be able to manage its coaches and programs later.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="clinic-name" className="text-right">
              Name
            </Label>
            <Input 
              id="clinic-name" 
              value={clinicName} 
              onChange={(e) => setClinicName(e.target.value)} 
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input 
              id="location" 
              value={clinicLocation} 
              onChange={(e) => setClinicLocation(e.target.value)} 
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="clinic-email" className="text-right">
              Email
            </Label>
            <Input 
              id="clinic-email" 
              type="email" 
              value={clinicEmail} 
              onChange={(e) => setClinicEmail(e.target.value)} 
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="clinic-phone" className="text-right">
              Phone
            </Label>
            <Input 
              id="clinic-phone" 
              type="tel" 
              value={clinicPhone} 
              onChange={(e) => setClinicPhone(e.target.value)} 
              className="col-span-3" 
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmitClinic}>
            Add Clinic
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddClinicDialog;
