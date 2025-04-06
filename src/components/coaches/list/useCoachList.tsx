
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
  // Use a ref for the coaches to prevent unnecessary renders
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const coachesRef = useRef<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);
  const initialLoadCompleteRef = useRef(false);
  const retryCountRef = useRef(0);
  
  // Use a callback to allow re-triggering the load
  const loadCoaches = useCallback(async (signal?: AbortSignal) => {
    if (!clinicId) {
      setCoaches([]);
      setIsLoading(false);
      if (setIsRefreshing && isRefreshing) setIsRefreshing(false);
      initialLoadCompleteRef.current = true;
      return;
    }
    
    // Prevent duplicate requests
    if (isLoadingRef.current && !isRefreshing) {
      console.log('Already loading coaches, skipping duplicate request');
      return;
    }
    
    // Generate unique request ID for this call
    const currentRequestId = ++requestIdRef.current;
    
    try {
      // Set loading states
      isLoadingRef.current = true;
      if (setIsRefreshing && isRefreshing) {
        setIsRefreshing(true);
      } else if (!initialLoadCompleteRef.current) {
        setIsLoading(true);
      }
      setError(null);
      
      const currentRetry = ++retryCountRef.current;
      console.log(`Loading coaches for clinic: ${clinicId} (attempt ${currentRetry})`);
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

      // Update the ref first to avoid re-renders
      coachesRef.current = coachesData;
      
      // Schedule UI update in next animation frame for smoother transition
      requestAnimationFrame(() => {
        // Always update state even if apparently the same to ensure proper renders
        setCoaches([...coachesData]);
        initialLoadCompleteRef.current = true;
        
        // Use setTimeout to ensure UI updates smoothly
        setTimeout(() => {
          if (setIsRefreshing && isRefreshing) {
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
        
        if (!isRefreshing) {
          toast.error("Error loading coaches. Please try again.");
        }
        
        // Ensure loading states are reset even on error
        setTimeout(() => {
          if (setIsRefreshing) {
            setIsRefreshing(false);
          }
          setIsLoading(false);
          isLoadingRef.current = false;
          initialLoadCompleteRef.current = true;
        }, 100);
      });
      
      // Setup automatic retry with exponential backoff if under retry limit
      if (retryCountRef.current < 3) {
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }
        
        const backoffMs = Math.min(1000 * Math.pow(2, retryCountRef.current - 1), 5000);
        console.log(`Automatically retrying failed coach load in ${backoffMs}ms`);
        
        retryTimeoutRef.current = window.setTimeout(() => {
          if (!signal?.aborted) {
            loadCoaches();
          }
        }, backoffMs);
      } else {
        console.log('Maximum retry attempts reached');
        retryCountRef.current = 0; // Reset for manual retries
      }
    }
  }, [clinicId, setIsRefreshing, isRefreshing]);

  // Load coaches when dependencies change
  useEffect(() => {
    // Reset retry counter
    retryCountRef.current = 0;
    
    // Cancel any in-progress requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new abort controller for this request
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;
    
    // Reset state for fresh data
    initialLoadCompleteRef.current = false;
    
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
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      isLoadingRef.current = false;
    };
  }, [clinicId, refreshTrigger, loadCoaches]);

  const displayedCoaches = limit ? coaches.slice(0, limit) : coaches;

  // Create a non-blocking refresh function
  const refresh = useCallback(() => {
    if (isLoadingRef.current) {
      console.log('Refresh requested but load in progress, skipping');
      return;
    }
    
    // Reset retry counter for manual refresh
    retryCountRef.current = 0;
    requestIdRef.current++; // Increment to invalidate current request
    
    // Cancel any pending retries
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    // Schedule in next frame for better UI responsiveness
    requestAnimationFrame(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      loadCoaches(abortControllerRef.current.signal);
    });
  }, [loadCoaches]);

  return {
    coaches: displayedCoaches,
    isLoading: isLoading || !initialLoadCompleteRef.current,
    error,
    refresh
  };
};
