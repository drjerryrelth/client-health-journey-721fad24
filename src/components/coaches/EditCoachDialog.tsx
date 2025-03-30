
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Coach } from '@/services/coach-service';

interface EditCoachDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coach: Coach | null;
  clinicName: string;
}

const EditCoachDialog = ({ open, onOpenChange, coach, clinicName }: EditCoachDialogProps) => {
  const { toast } = useToast();
  const [coachName, setCoachName] = useState('');
  const [coachEmail, setCoachEmail] = useState('');
  const [coachPhone, setCoachPhone] = useState('');

  useEffect(() => {
    if (coach) {
      setCoachName(coach.name);
      setCoachEmail(coach.email);
      setCoachPhone(coach.phone || '');
    }
  }, [coach]);

  const handleSubmitEditCoach = () => {
    if (!coachName || !coachEmail) {
      toast({
        title: "Missing Information",
        description: "Please provide name and email for the coach.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Coach Updated",
      description: `${coachName}'s information has been updated.`
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Coach</DialogTitle>
          <DialogDescription>
            Update coach information for {clinicName}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right">
              Name
            </Label>
            <Input 
              id="edit-name" 
              value={coachName} 
              onChange={(e) => setCoachName(e.target.value)} 
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-email" className="text-right">
              Email
            </Label>
            <Input 
              id="edit-email" 
              type="email" 
              value={coachEmail} 
              onChange={(e) => setCoachEmail(e.target.value)} 
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-phone" className="text-right">
              Phone
            </Label>
            <Input 
              id="edit-phone" 
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
          <Button type="button" onClick={handleSubmitEditCoach}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCoachDialog;
