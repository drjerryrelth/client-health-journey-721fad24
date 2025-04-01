
import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { Coach } from '@/services/coaches';
import ResetClinicPasswordDialog from './ResetClinicPasswordDialog';
import CoachTabHeader from './coaches/CoachTabHeader';
import CoachesListContainer from './coaches/CoachesListContainer';
import { useCoachTabActions } from './coaches/useCoachTabActions';

interface CoachesTabProps {
  clinicName: string;
  clinicId: string;
  clinicEmail?: string;
  onAddCoach: () => void;
  refreshTrigger: number;
  onEditCoach: (coach: Coach) => void;
  onDeleteCoach: (coach: Coach) => void;
  isRefreshing?: boolean;
  setIsRefreshing?: (isRefreshing: boolean) => void;
}

const CoachesTab = ({ 
  clinicName, 
  clinicId,
  clinicEmail, 
  onAddCoach, 
  refreshTrigger,
  onEditCoach,
  onDeleteCoach,
  isRefreshing = false,
  setIsRefreshing
}: CoachesTabProps) => {
  // Password reset dialog state
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);

  // Use extracted hook for action handling
  const { 
    isActionPending,
    handleAddCoach,
    handleEditCoach,
    handleDeleteCoach 
  } = useCoachTabActions({
    isRefreshing,
    onAddCoach,
    onEditCoach,
    onDeleteCoach
  });

  const handlePasswordReset = () => {
    // Additional actions after password reset if needed
    console.log('Password reset initiated for clinic:', clinicId);
  };

  const handleResetPasswordClick = () => {
    setShowResetPasswordDialog(true);
  };

  return (
    <Card>
      <CardHeader>
        <CoachTabHeader 
          clinicName={clinicName}
          onAddCoach={handleAddCoach}
          onResetPassword={handleResetPasswordClick}
          isDisabled={isRefreshing || isActionPending}
          isLoading={isRefreshing}
        />
      </CardHeader>
      
      <CoachesListContainer 
        clinicId={clinicId}
        onEdit={handleEditCoach}
        onDelete={handleDeleteCoach}
        refreshTrigger={refreshTrigger}
        isRefreshing={isRefreshing}
        setIsRefreshing={setIsRefreshing}
      />

      {clinicEmail && (
        <ResetClinicPasswordDialog
          open={showResetPasswordDialog}
          onOpenChange={setShowResetPasswordDialog}
          clinicEmail={clinicEmail}
          onPasswordReset={handlePasswordReset}
        />
      )}
    </Card>
  );
};

export default CoachesTab;
