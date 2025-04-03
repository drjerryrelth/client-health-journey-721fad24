
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Coach } from '@/services/coaches/types';
import { toast } from 'sonner';

export interface UseCoachActionsProps {
  addClient: () => Promise<void>;
  isLoading: boolean;
  selectedCoach: Coach | null;
  handleDeleteCoach: (coach: Coach) => void;
  handleReassignAndDelete: (coachId: string, replacementCoachId: string) => Promise<void>;
}

export const useCoachActions = (): UseCoachActionsProps => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const { user } = useAuth();

  const addClient = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      if (!user?.clinicId) {
        toast.error("You must be associated with a clinic to add clients");
        return;
      }
      
      // Instead of navigating, we'll return a success so the dialog can be opened
      // The dialog is now controlled by the ClientsPage component
      return;
    } catch (error) {
      console.error("Error in add client action:", error);
      toast.error("Failed to prepare add client action");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCoach = (coach: Coach) => {
    setSelectedCoach(coach);
    // The implementation will depend on whether we're in the admin context or not
    // For the Coach Dashboard, this might be empty or different
  };

  const handleReassignAndDelete = async (coachId: string, replacementCoachId: string) => {
    // Implementation will depend on context
    // For the Coach Dashboard, this might be empty or different
  };

  return {
    addClient,
    isLoading,
    selectedCoach,
    handleDeleteCoach,
    handleReassignAndDelete
  };
};
