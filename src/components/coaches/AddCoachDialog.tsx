
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import CoachService from '@/services/coach-service';

interface AddCoachDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinicName: string;
  clinicId: string;
  onCoachAdded?: () => void;
}

const AddCoachDialog = ({ open, onOpenChange, clinicName, clinicId, onCoachAdded }: AddCoachDialogProps) => {
  const [coachName, setCoachName] = useState('');
  const [coachEmail, setCoachEmail] = useState('');
  const [coachPhone, setCoachPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{name?: string; email?: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {name?: string; email?: string} = {};
    
    if (!coachName.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!coachEmail.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(coachEmail)) {
      newErrors.email = "Invalid email format";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitAddCoach = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Submitting coach:', {
        name: coachName,
        email: coachEmail,
        phone: coachPhone,
        clinicId: clinicId
      });
      
      const newCoach = await CoachService.addCoach({
        name: coachName,
        email: coachEmail,
        phone: coachPhone,
        status: 'active',
        clinicId: clinicId
      });

      if (newCoach) {
        toast(`${coachName} has been added to ${clinicName}`);
        
        // Reset form and close dialog
        resetForm();
        onOpenChange(false);
        // Notify parent component to refresh coach list
        if (onCoachAdded) onCoachAdded();
      } else {
        toast.error("Failed to add coach. Please try again.");
      }
    } catch (error) {
      console.error("Error adding coach:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCoachName('');
    setCoachEmail('');
    setCoachPhone('');
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }}>
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
              Name <span className="text-red-500">*</span>
            </Label>
            <div className="col-span-3">
              <Input 
                id="name" 
                value={coachName} 
                onChange={(e) => setCoachName(e.target.value)} 
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email <span className="text-red-500">*</span>
            </Label>
            <div className="col-span-3">
              <Input 
                id="email" 
                type="email" 
                value={coachEmail} 
                onChange={(e) => setCoachEmail(e.target.value)} 
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
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
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmitAddCoach}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Coach'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCoachDialog;
