
import { useQuery } from '@tanstack/react-query';
import { CoachService } from '@/services/coaches';
import { useAuth } from '@/context/auth';

export const useClinicCoachesQuery = (clinicId?: string) => {
  const { user } = useAuth();
  
  // Use a hierarchical approach to determine the active clinic ID
  const activeClinicId = clinicId || user?.clinicId;

  return useQuery({
    queryKey: ['coaches', 'clinic', activeClinicId],
    queryFn: () => {
      if (!activeClinicId) {
        console.error('Missing clinic ID in useClinicCoachesQuery');
        return Promise.resolve([]);
      }
      console.log('Fetching coaches for clinic:', activeClinicId);
      return CoachService.getClinicCoaches(activeClinicId);
    },
    enabled: !!activeClinicId,
  });
};
