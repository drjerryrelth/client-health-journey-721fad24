import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CoachList } from '@/components/coaches';
import { CoachService } from '@/services/coaches';
import { Coach } from '@/services/coaches';
import { useClinicNames } from '@/components/coaches/list/useClinicNames';
import CoachPasswordResetDialog from '@/components/coaches/CoachPasswordResetDialog';
import { useClinicFilter } from '@/components/coaches/list/useClinicFilter';
import { useAuth } from '@/context/auth';

interface CoachesListContainerProps {
  clinicId: string;
  onEdit?: (coach: Coach) => void;
  onDelete?: (coach: Coach) => void;
  refreshTrigger: number;
  isRefreshing?: boolean;
  setIsRefreshing?: (isRefreshing: boolean) => void;
}

const CoachesListContainer: React.FC<CoachesListContainerProps> = ({
  clinicId,
  onEdit,
  onDelete,
  refreshTrigger,
  isRefreshing,
  setIsRefreshing
}) => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [showPasswordResetDialog, setShowPasswordResetDialog] = useState(false);
  
  const { filterByClinic, isClinicAdmin, userClinicId } = useClinicFilter();
  const { user } = useAuth();
  
  const { getClinicName } = useClinicNames();

  useEffect(() => {
    const fetchCoaches = async () => {
      if (!clinicId) {
        console.error('Missing clinic ID in CoachesListContainer');
        setError('Missing clinic ID');
        setLoading(false);
        return;
      }
      
      try {
        if (setIsRefreshing) setIsRefreshing(true);
        setLoading(true);
        setError(null);
        
        console.log('Fetching coaches for clinic ID:', clinicId);
        console.log('User role:', user?.role, 'User clinicId:', user?.clinicId);
        
        const clinicCoaches = await CoachService.getClinicCoaches(clinicId);
        console.log('Fetched coaches:', clinicCoaches.length);
        
        const filteredCoaches = isClinicAdmin ? 
          filterByClinic(clinicCoaches) : 
          clinicCoaches;
          
        console.log('Filtered coaches:', filteredCoaches.length);
        
        setCoaches(filteredCoaches);
      } catch (err) {
        console.error('Error fetching coaches:', err);
        setError('Failed to load coaches. Please try again.');
      } finally {
        setLoading(false);
        if (setIsRefreshing) setIsRefreshing(false);
      }
    };
    
    fetchCoaches();
  }, [clinicId, refreshTrigger, setIsRefreshing, isClinicAdmin, filterByClinic, user]);
  
  const handleResetPassword = (coach: Coach) => {
    setSelectedCoach(coach);
    setShowPasswordResetDialog(true);
  };

  const handlePasswordReset = () => {
    toast.success(`Password reset email sent to ${selectedCoach?.name}`);
  };
  
  return (
    <div className="mt-6">
      <CoachList 
        coaches={coaches} 
        loading={loading} 
        error={error}
        onEdit={onEdit}
        onDelete={onDelete}
        onResetPassword={handleResetPassword}
      />
      
      {selectedCoach && (
        <CoachPasswordResetDialog
          open={showPasswordResetDialog}
          onOpenChange={setShowPasswordResetDialog}
          coach={selectedCoach}
          onPasswordReset={handlePasswordReset}
        />
      )}
    </div>
  );
};

export default CoachesListContainer;
