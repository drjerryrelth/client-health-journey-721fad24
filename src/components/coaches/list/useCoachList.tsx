
import { useState, useEffect } from 'react';
import { Coach, CoachService } from '@/services/coaches';

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

  useEffect(() => {
    const loadCoaches = async () => {
      if (clinicId) {
        if (setIsRefreshing) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }
        
        try {
          console.log('Loading coaches for clinic:', clinicId);
          const coachesData = await CoachService.getClinicCoaches(clinicId);
          console.log('Coaches loaded:', coachesData);
          setCoaches(coachesData);
        } catch (error) {
          console.error('Error loading coaches:', error);
        } finally {
          if (setIsRefreshing) {
            setIsRefreshing(false);
          }
          setIsLoading(false);
        }
      } else {
        setCoaches([]);
        setIsLoading(false);
        if (setIsRefreshing) {
          setIsRefreshing(false);
        }
      }
    };

    loadCoaches();
  }, [clinicId, refreshTrigger, setIsRefreshing]);

  const displayedCoaches = limit ? coaches.slice(0, limit) : coaches;

  return {
    coaches: displayedCoaches,
    isLoading
  };
};
