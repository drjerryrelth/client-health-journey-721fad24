
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface AddCoachDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinicName: string;
}

const AddCoachDialog = ({ open, onOpenChange, clinicName }: AddCoachDialogProps) => {
  const { toast } = useToast();
  const [coachName, setCoachName] = useState('');
  const [coachEmail, setCoachEmail] = useState('');
  const [coachPhone, setCoachPhone] = useState('');

  const handleSubmitAddCoach = () => {
    if (!coachName || !coachEmail) {
      toast({
        title: "Missing Information",
        description: "Please provide name and email for the coach.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Coach Added",
      description: `${coachName} has been added to ${clinicName}.`
    });
    
    // Reset form and close dialog
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setCoachName('');
    setCoachEmail('');
    setCoachPhone('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Coach</DialogTitle>
          <DialogDescription>
            Add a new coach to {clinicName}. They will receive an email invitation to set up their account.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input 
              id="name" 
              value={coachName} 
              onChange={(e) => setCoachName(e.target.value)} 
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input 
              id="email" 
              type="email" 
              value={coachEmail} 
              onChange={(e) => setCoachEmail(e.target.value)} 
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input 
              id="phone" 
              type="tel" 
              value={coachPhone} 
              onChange={(e) => setCoachPhone(e.target.value)} 
              className="col-span-3" 
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmitAddCoach}>
            Add Coach
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCoachDialog;
