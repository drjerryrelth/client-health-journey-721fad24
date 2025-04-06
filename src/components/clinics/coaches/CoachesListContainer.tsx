
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CoachList } from '@/components/coaches';
import { Coach } from '@/services/coaches';
import { useClinicNames } from '@/components/coaches/list/useClinicNames';
import CoachPasswordResetDialog from '@/components/coaches/CoachPasswordResetDialog';
import { useClinicFilter } from '@/components/coaches/list/useClinicFilter';
import { useAuth } from '@/context/auth';
import { useCoachList } from '@/components/coaches/list/useCoachList';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [showPasswordResetDialog, setShowPasswordResetDialog] = useState(false);
  
  const { filterByClinic, isClinicAdmin, userClinicId } = useClinicFilter();
  const { user } = useAuth();
  
  const { getClinicName } = useClinicNames();

  // Use the useCoachList hook to fetch and manage coach data
  const { coaches, isLoading, error, refresh } = useCoachList({
    clinicId,
    refreshTrigger,
    isRefreshing,
    setIsRefreshing
  });
  
  // Log important context information for debugging
  useEffect(() => {
    if (!clinicId) {
      console.error('Missing clinic ID in CoachesListContainer');
    } else {
      console.log('CoachesListContainer with clinic ID:', clinicId);
      console.log('User role:', user?.role, 'User clinicId:', user?.clinicId);
    }
    
    if (error) {
      console.error('CoachesListContainer error:', error);
    }
  }, [clinicId, user, error]);
  
  const handleResetPassword = (coach: Coach) => {
    setSelectedCoach(coach);
    setShowPasswordResetDialog(true);
  };

  const handlePasswordReset = () => {
    toast.success(`Password reset email sent to ${selectedCoach?.name}`);
  };
  
  return (
    <div className="mt-6">
      {!clinicId && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Missing Clinic ID</AlertTitle>
          <AlertDescription>
            Unable to load coaches without a clinic ID. Please try reloading the page.
          </AlertDescription>
        </Alert>
      )}
      
      <CoachList 
        coaches={coaches} 
        loading={isLoading} 
        error={error}
        onEdit={onEdit}
        onDelete={onDelete}
        onResetPassword={handleResetPassword}
        onRetry={refresh}
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
