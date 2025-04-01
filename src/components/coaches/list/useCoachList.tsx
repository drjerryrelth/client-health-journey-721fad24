
import { useState, useEffect, useCallback, useRef } from 'react';
import { Coach, CoachService } from '@/services/coaches';
import { toast } from 'sonner';

interface UseCoachListProps {
  clinicId?: string;
  limit?: number;
  refreshTrigger?: number;
  setIsRefreshing?: (isRefreshing: boolean) => void;
}

export const useCoachList = ({ 
  clinicId, 
  limit, 
  refreshTrigger = 0,
  setIsRefreshing
}: UseCoachListProps) => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);
  
  // Use a callback to allow re-triggering the load
  const loadCoaches = useCallback(async () => {
    if (!clinicId) {
      setCoaches([]);
      setIsLoading(false);
      if (setIsRefreshing) setIsRefreshing(false);
      return;
    }
    
    // Prevent duplicate requests
    if (isLoadingRef.current) {
      console.log('Already loading coaches, skipping duplicate request');
      return;
    }
    
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
      
      // Update state without blocking the UI
      window.requestAnimationFrame(() => {
        setCoaches(coachesData);
        
        // Use setTimeout to ensure UI updates smoothly
        setTimeout(() => {
          if (setIsRefreshing) {
            setIsRefreshing(false);
          }
          setIsLoading(false);
          isLoadingRef.current = false;
        }, 300);
      });
    } catch (error) {
      console.error('Error loading coaches:', error);
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
      }, 300);
    }
  }, [clinicId, setIsRefreshing]);

  // Load coaches when dependencies change
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    const safeLoadCoaches = async () => {
      try {
        if (!clinicId || !isMounted) {
          if (isMounted) {
            setCoaches([]);
            setIsLoading(false);
            if (setIsRefreshing) setIsRefreshing(false);
          }
          return;
        }
        
        // Set loading states
        if (isMounted) {
          if (setIsRefreshing) {
            setIsRefreshing(true);
          } else {
            setIsLoading(true);
          }
          setError(null);
        }
        
        console.log('Loading coaches for clinic:', clinicId);
        const coachesData = await CoachService.getClinicCoaches(clinicId);
        
        if (isMounted) {
          // Use RAF to schedule UI updates
          window.requestAnimationFrame(() => {
            if (isMounted) {
              setCoaches(coachesData);
              setError(null);
              
              // Use setTimeout to ensure UI updates smoothly
              setTimeout(() => {
                if (isMounted) {
                  if (setIsRefreshing) {
                    setIsRefreshing(false);
                  }
                  setIsLoading(false);
                  isLoadingRef.current = false;
                }
              }, 300);
            }
          });
        }
      } catch (error) {
        console.error('Error loading coaches:', error);
        if (isMounted) {
          setError('Failed to load coaches. Please try again.');
          if (!setIsRefreshing) {
            toast.error("Error loading coaches. Please try again.");
          }
          
          setTimeout(() => {
            if (isMounted) {
              if (setIsRefreshing) {
                setIsRefreshing(false);
              }
              setIsLoading(false);
              isLoadingRef.current = false;
            }
          }, 300);
        }
      }
    };

    safeLoadCoaches();
    
    return () => {
      isMounted = false;
      controller.abort();
      isLoadingRef.current = false;
    };
  }, [clinicId, refreshTrigger, setIsRefreshing]);

  const displayedCoaches = limit ? coaches.slice(0, limit) : coaches;

  return {
    coaches: displayedCoaches,
    isLoading,
    error,
    refresh: loadCoaches
  };
};
