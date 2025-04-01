
import { useState, useEffect, useCallback, useRef } from 'react';
import { Coach, CoachService } from '@/services/coaches';
import { toast } from 'sonner';

interface UseCoachListProps {
  clinicId?: string;
  limit?: number;
  refreshTrigger?: number;
  setIsRefreshing?: (isRefreshing: boolean) => void;
  isRefreshing?: boolean;
}

export const useCoachList = ({ 
  clinicId, 
  limit, 
  refreshTrigger = 0,
  setIsRefreshing,
  isRefreshing = false
}: UseCoachListProps) => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Use a callback to allow re-triggering the load
  const loadCoaches = useCallback(async (signal?: AbortSignal) => {
    if (!clinicId) {
      setCoaches([]);
      setIsLoading(false);
      if (setIsRefreshing && isRefreshing) setIsRefreshing(false);
      return;
    }
    
    // Prevent duplicate requests
    if (isLoadingRef.current) {
      console.log('Already loading coaches, skipping duplicate request');
      return;
    }
    
    // Generate unique request ID for this call
    const currentRequestId = ++requestIdRef.current;
    
    try {
      // Set loading states
      isLoadingRef.current = true;
      if (setIsRefreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      
      console.log('Loading coaches for clinic:', clinicId);
      const coachesData = await CoachService.getClinicCoaches(clinicId);
      
      // Check if this is still the most recent request
      if (currentRequestId !== requestIdRef.current) {
        console.log('Newer request in progress, discarding results');
        return;
      }
      
      // Check if operation was aborted
      if (signal?.aborted) {
        console.log('Coach loading aborted');
        return;
      }

      // Schedule UI update in next animation frame
      requestAnimationFrame(() => {
        setCoaches(coachesData);
        
        // Use setTimeout to ensure UI updates smoothly
        setTimeout(() => {
          if (setIsRefreshing) {
            setIsRefreshing(false);
          }
          setIsLoading(false);
          isLoadingRef.current = false;
        }, 100);
      });
    } catch (error) {
      // Check if this is still the most recent request
      if (currentRequestId !== requestIdRef.current) {
        return;
      }
      
      // Check if operation was aborted
      if (signal?.aborted) {
        console.log('Coach loading aborted due to cleanup');
        return;
      }
      
      console.error('Error loading coaches:', error);
      
      // Schedule error state update
      requestAnimationFrame(() => {
        setError('Failed to load coaches. Please try again.');
        
        if (!setIsRefreshing) {
          toast.error("Error loading coaches. Please try again.");
        }
        
        // Ensure loading states are reset even on error
        setTimeout(() => {
          if (setIsRefreshing) {
            setIsRefreshing(false);
          }
          setIsLoading(false);
          isLoadingRef.current = false;
        }, 100);
      });
    }
  }, [clinicId, setIsRefreshing, isRefreshing]);

  // Load coaches when dependencies change
  useEffect(() => {
    // Cancel any in-progress requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new abort controller for this request
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;
    
    // Schedule loading in next frame for better UI responsiveness
    const frameId = requestAnimationFrame(() => {
      loadCoaches(signal);
    });
    
    return () => {
      // Clean up on unmount or when dependencies change
      cancelAnimationFrame(frameId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      isLoadingRef.current = false;
    };
  }, [clinicId, refreshTrigger, loadCoaches]);

  const displayedCoaches = limit ? coaches.slice(0, limit) : coaches;

  // Create a non-blocking refresh function
  const refresh = useCallback(() => {
    requestAnimationFrame(() => {
      loadCoaches();
    });
  }, [loadCoaches]);

  return {
    coaches: displayedCoaches,
    isLoading,
    error,
    refresh
  };
};
