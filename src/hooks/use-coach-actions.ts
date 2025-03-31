
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ClientService } from '@/services/client-service';
import { toast } from 'sonner';
import { Coach } from '@/services/coaches/types';

export interface UseCoachActionsProps {
  addClient: () => Promise<void>;
  isLoading: boolean;
  selectedCoach: Coach | null;
  handleDeleteCoach: (coach: Coach) => void;
  handleReassignAndDelete: (coachId: string, replacementCoachId: string) => Promise<void>;
}

export const useCoachActions = (clinicName?: string, toast?: any): UseCoachActionsProps => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const { user } = useAuth();

  const addClient = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      if (!user?.clinicId) {
        toast ? toast({
          title: "Error",
          description: "You must be associated with a clinic to add clients",
          variant: "destructive"
        }) : toast?.error("You must be associated with a clinic to add clients");
        return;
      }
      
      // Redirect to the add client page
      window.location.href = '/coach/clients?action=add';
    } catch (error) {
      console.error("Error navigating to add client:", error);
      toast ? toast({
        title: "Error",
        description: "Failed to navigate to add client page",
        variant: "destructive"
      }) : toast?.error("Failed to navigate to add client page");
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
