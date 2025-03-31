
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface AddProgramDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (program: {
    name: string;
    type: 'practice_naturals' | 'chirothin' | 'nutrition' | 'fitness' | 'keto' | 'custom';
    duration: string;
    checkInFrequency: 'daily' | 'weekly';
    description: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

const AddProgramDialog = ({ isOpen, onClose, onSubmit, isSubmitting }: AddProgramDialogProps) => {
  const [programType, setProgramType] = useState<'practice_naturals' | 'chirothin' | 'nutrition' | 'fitness' | 'keto' | 'custom'>('nutrition');
  const [customName, setCustomName] = useState('');
  const [programDuration, setProgramDuration] = useState('');
  const [checkInFrequency, setCheckInFrequency] = useState<'daily' | 'weekly'>('daily');
  const [programDescription, setProgramDescription] = useState('');

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setProgramType('nutrition');
      setCustomName('');
      setProgramDuration('');
      setCheckInFrequency('daily');
      setProgramDescription('');
    }
  }, [isOpen]);

  const getProgramName = () => {
    if (programType === 'custom') {
      return customName;
    } else {
      return `${programType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Program`;
    }
  };

  const handleSubmit = async () => {
    await onSubmit({
      name: getProgramName(),
      type: programType,
      duration: programDuration,
      checkInFrequency,
      description: programDescription
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Program</DialogTitle>
          <DialogDescription>
            Create a new program for your clients. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="program-type" className="text-right">
              Type
            </Label>
            <Select 
              value={programType} 
              onValueChange={(value: 'practice_naturals' | 'chirothin' | 'nutrition' | 'fitness' | 'keto' | 'custom') => setProgramType(value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="practice_naturals">Practice Naturals</SelectItem>
                <SelectItem value="chirothin">ChiroThin</SelectItem>
                <SelectItem value="nutrition">General Nutrition</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="keto">Keto</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {programType === 'custom' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="custom-name" className="text-right">
                Name
              </Label>
              <Input
                id="custom-name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="col-span-3"
                placeholder="Enter custom program name"
              />
            </div>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="program-duration" className="text-right">
              Duration
            </Label>
            <Select value={programDuration} onValueChange={setProgramDuration}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30-days">30 Days</SelectItem>
                <SelectItem value="60-days">60 Days</SelectItem>
                <SelectItem value="6-weeks">6 Weeks</SelectItem>
                <SelectItem value="8-weeks">8 Weeks</SelectItem>
                <SelectItem value="12-weeks">12 Weeks</SelectItem>
                <SelectItem value="16-weeks">16 Weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="check-in-frequency" className="text-right">
              Check-in
            </Label>
            <Select 
              value={checkInFrequency} 
              onValueChange={(value: 'daily' | 'weekly') => setCheckInFrequency(value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select check-in frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="program-description" className="text-right align-top pt-2">
              Description
            </Label>
            <Textarea
              id="program-description"
              value={programDescription}
              onChange={(e) => setProgramDescription(e.target.value)}
              className="col-span-3"
              rows={4}
              placeholder="Describe the program and its goals"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={
              isSubmitting || 
              !programDuration || 
              !checkInFrequency || 
              (programType === 'custom' && !customName)
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Program"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProgramDialog;
