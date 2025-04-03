
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Coach, CoachService } from '@/services/coaches';
import ErrorDialog from '@/components/coaches/ErrorDialog';

interface DeleteCoachDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coach: Coach | null;
  onCoachDeleted?: () => void;
}

export const DeleteCoachDialog = ({ 
  open, 
  onOpenChange, 
  coach, 
  onCoachDeleted 
}: DeleteCoachDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const handleDelete = async () => {
    if (!coach) {
      toast.error('No coach selected for deletion');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorDetails(null);
      
      // Delete the coach
      await CoachService.deleteCoach(coach.id);
      
      toast.success(`${coach.name} has been removed`);
      onOpenChange(false);
      if (onCoachDeleted) onCoachDeleted();
    } catch (error) {
      console.error('Error deleting coach:', error);
      
      if (error instanceof Error) {
        setErrorDetails(error.message);
      } else {
        setErrorDetails(String(error));
      }
      
      setShowErrorDialog(true);
      toast.error(`Failed to delete coach: ${coach.name}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogChange = (open: boolean) => {
    if (!isSubmitting) {
      onOpenChange(open);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Coach</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {coach?.name}?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-destructive font-semibold">
              Warning: This action cannot be undone. All assigned clients will need to be reassigned.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Any clients assigned to this coach will need to be manually reassigned to another coach.
            </p>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleDialogChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting || !coach}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Coach'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <ErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        errorDetails={errorDetails}
        title="Error Deleting Coach"
      />
    </>
  );
};
