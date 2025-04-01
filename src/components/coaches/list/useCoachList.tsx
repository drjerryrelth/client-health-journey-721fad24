
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    let isMounted = true;
    
    const loadCoaches = async () => {
      if (!clinicId) {
        if (isMounted) {
          setCoaches([]);
          setIsLoading(false);
          if (setIsRefreshing) setIsRefreshing(false);
        }
        return;
      }
      
      try {
        // Set loading states
        if (setIsRefreshing) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }
        
        console.log('Loading coaches for clinic:', clinicId);
        const coachesData = await CoachService.getClinicCoaches(clinicId);
        
        if (isMounted) {
          console.log('Coaches loaded:', coachesData);
          setCoaches(coachesData);
          setError(null);
        }
      } catch (error) {
        console.error('Error loading coaches:', error);
        if (isMounted) {
          setError('Failed to load coaches. Please try again.');
          toast.error("Error loading coaches. Please try again.");
        }
      } finally {
        // Only update state if component is still mounted
        if (isMounted) {
          if (setIsRefreshing) {
            // Use setTimeout to ensure UI updates smoothly
            setTimeout(() => {
              if (isMounted) setIsRefreshing(false);
            }, 300);
          }
          setIsLoading(false);
        }
      }
    };

    loadCoaches();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [clinicId, refreshTrigger, setIsRefreshing]);

  const displayedCoaches = limit ? coaches.slice(0, limit) : coaches;

  return {
    coaches: displayedCoaches,
    isLoading,
    error
  };
};
