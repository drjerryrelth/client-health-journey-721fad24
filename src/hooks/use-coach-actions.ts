
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ClientService } from '@/services/client-service';
import { toast } from 'sonner';

export interface UseCoachActionsProps {
  addClient: () => Promise<void>;
  isLoading: boolean;
  handleDeleteCoach?: (coachId: string) => void;
  handleReassignAndDelete?: (coachId: string, replacementCoachId: string) => Promise<void>;
}

export const useCoachActions = (): UseCoachActionsProps => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const addClient = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      if (!user?.clinicId) {
        toast.error("You must be associated with a clinic to add clients");
        return;
      }
      
      // Redirect to the add client page
      window.location.href = '/coach/clients?action=add';
    } catch (error) {
      console.error("Error navigating to add client:", error);
      toast.error("Failed to navigate to add client page");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addClient,
    isLoading
  };
};
