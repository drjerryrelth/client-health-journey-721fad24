import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CoachList } from '@/components/coaches';
import { CoachService } from '@/services/coaches';
import { Coach } from '@/services/coaches';
import { useClinicNames } from '@/components/coaches/list/useClinicNames';
import CoachPasswordResetDialog from '@/components/coaches/CoachPasswordResetDialog';

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
  
  // Existing hook for clinic names
  const { getClinicName } = useClinicNames();

  useEffect(() => {
    const fetchCoaches = async () => {
      if (!clinicId) return;
      
      try {
        if (setIsRefreshing) setIsRefreshing(true);
        setLoading(true);
        setError(null);
        
        const clinicCoaches = await CoachService.getClinicCoaches(clinicId);
        setCoaches(clinicCoaches);
      } catch (err) {
        console.error('Error fetching coaches:', err);
        setError('Failed to load coaches. Please try again.');
      } finally {
        setLoading(false);
        if (setIsRefreshing) setIsRefreshing(false);
      }
    };
    
    fetchCoaches();
  }, [clinicId, refreshTrigger, setIsRefreshing]);
  
  const handleResetPassword = (coach: Coach) => {
    setSelectedCoach(coach);
    setShowPasswordResetDialog(true);
  };

  const handlePasswordReset = () => {
    // Any additional actions after password reset
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
