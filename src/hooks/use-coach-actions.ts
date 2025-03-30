
import { useState } from 'react';
import { Coach, CoachService } from '@/services/coaches';
import { toast as toastUtil } from '@/hooks/use-toast';

export interface UseCoachActionsProps {
  selectedCoach: Coach | null;
  handleDeleteCoach: (coach: Coach) => void;
  handleReassignAndDelete: (coachId: string, replacementCoachId: string) => Promise<void>;
}

export const useCoachActions = (
  clinicName: string,
  toast: typeof toastUtil
): UseCoachActionsProps => {
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);

  const handleDeleteCoach = (coach: Coach) => {
    setSelectedCoach(coach);
    
    if (coach.clients <= 0) {
      toast({
        title: "Confirm Deletion",
        description: `Are you sure you want to remove ${coach.name}? This will revoke their access to the system.`,
        action: (
          <button 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium"
            onClick={async () => {
              try {
                await CoachService.removeCoachAndReassignClients(coach.id, '');
                toast({
                  title: "Coach Removed",
                  description: `${coach.name} has been removed from ${clinicName}.`
                });
              } catch (error) {
                console.error("Error removing coach:", error);
                toast({
                  title: "Error",
                  description: "Failed to remove coach. Please try again.",
                  variant: "destructive"
                });
              }
            }}
          >
            Delete
          </button>
        ),
      });
    }
  };

  const handleReassignAndDelete = async (coachId: string, replacementCoachId: string) => {
    if (!selectedCoach || !replacementCoachId) {
      toast({
        title: "Selection Required",
        description: "Please select a coach to reassign clients to.",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await CoachService.removeCoachAndReassignClients(
        coachId, 
        replacementCoachId
      );
      
      if (result) {
        toast({
          title: "Clients Reassigned and Coach Removed",
          description: `${selectedCoach.name}'s clients have been reassigned and the coach has been removed from ${clinicName}.`
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to reassign clients and remove coach.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error reassigning clients:", error);
      toast({
        title: "Error",
        description: "Failed to reassign clients and remove coach.",
        variant: "destructive"
      });
    }
  };

  return {
    selectedCoach,
    handleDeleteCoach,
    handleReassignAndDelete
  };
};
