
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Coach } from '@/services/coach-service';

interface ReassignClientsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCoach: Coach | null;
  availableCoaches: Coach[];
  replacementCoachId: string;
  setReplacementCoachId: (id: string) => void;
  onReassignAndDelete: () => void;
}

const ReassignClientsDialog = ({ 
  open, 
  onOpenChange, 
  selectedCoach, 
  availableCoaches,
  replacementCoachId,
  setReplacementCoachId,
  onReassignAndDelete
}: ReassignClientsDialogProps) => {
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reassign Clients</AlertDialogTitle>
          <AlertDialogDescription>
            {selectedCoach?.name} has {selectedCoach?.clients} client{selectedCoach?.clients !== 1 ? 's' : ''}. 
            Please select another coach to reassign these clients to before removing {selectedCoach?.name}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <Label htmlFor="replacement-coach" className="block mb-2">
            Select Replacement Coach
          </Label>
          <Select onValueChange={setReplacementCoachId} value={replacementCoachId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a coach" />
            </SelectTrigger>
            <SelectContent>
              {availableCoaches.length > 0 ? (
                availableCoaches.map(coach => (
                  <SelectItem key={coach.id} value={coach.id}>
                    {coach.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>No other coaches available</SelectItem>
              )}
            </SelectContent>
          </Select>
          
          {availableCoaches.length === 0 && (
            <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded border border-yellow-200">
              <p className="text-sm">
                There are no other coaches available in this clinic. Add another coach first, 
                or transfer clients to a different clinic before removing this coach.
              </p>
            </div>
          )}
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            onOpenChange(false);
            setReplacementCoachId('');
          }}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onReassignAndDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={!replacementCoachId || availableCoaches.length === 0}
          >
            Reassign & Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReassignClientsDialog;
