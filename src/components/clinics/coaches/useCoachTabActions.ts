
import { useState, useRef, useCallback } from 'react';
import { Coach } from '@/services/coaches';

interface UseCoachTabActionsProps {
  isRefreshing?: boolean;
  onAddCoach: () => void;
  onEditCoach: (coach: Coach) => void;
  onDeleteCoach: (coach: Coach) => void;
}

export const useCoachTabActions = ({
  isRefreshing = false,
  onAddCoach,
  onEditCoach,
  onDeleteCoach
}: UseCoachTabActionsProps) => {
  // State for action debouncing
  const [isActionPending, setIsActionPending] = useState(false);
  const actionInProgressRef = useRef(false);
  
  // Stabilized callback to prevent excessive re-renders
  const handleAddCoach = useCallback(() => {
    if (actionInProgressRef.current || isActionPending || isRefreshing) return;
    
    actionInProgressRef.current = true;
    setIsActionPending(true);
    
    // Debounce the action to prevent rapid clicks
    setTimeout(() => {
      onAddCoach();
      
      // Reset action state after a short delay
      setTimeout(() => {
        actionInProgressRef.current = false;
        setIsActionPending(false);
      }, 500);
    }, 10);
  }, [onAddCoach, isActionPending, isRefreshing]);
  
  // Stabilized edit handler
  const handleEditCoach = useCallback((coach: Coach) => {
    if (actionInProgressRef.current || isActionPending || isRefreshing) return;
    
    actionInProgressRef.current = true;
    setIsActionPending(true);
    
    // Debounce the action
    setTimeout(() => {
      onEditCoach(coach);
      
      // Reset action state after a delay
      setTimeout(() => {
        actionInProgressRef.current = false;
        setIsActionPending(false);
      }, 500);
    }, 10);
  }, [onEditCoach, isActionPending, isRefreshing]);
  
  // Stabilized delete handler
  const handleDeleteCoach = useCallback((coach: Coach) => {
    if (actionInProgressRef.current || isActionPending || isRefreshing) return;
    
    actionInProgressRef.current = true;
    setIsActionPending(true);
    
    // Debounce the action
    setTimeout(() => {
      onDeleteCoach(coach);
      
      // Reset action state after a delay
      setTimeout(() => {
        actionInProgressRef.current = false;
        setIsActionPending(false);
      }, 500);
    }, 10);
  }, [onDeleteCoach, isActionPending, isRefreshing]);

  return {
    isActionPending,
    handleAddCoach,
    handleEditCoach,
    handleDeleteCoach
  };
};
