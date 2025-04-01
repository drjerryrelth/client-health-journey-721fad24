
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Loader2, Key } from 'lucide-react';
import CoachList from '@/components/coaches/CoachList';
import { Coach } from '@/services/coaches';
import ResetClinicPasswordDialog from './ResetClinicPasswordDialog';

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
  isRefreshing,
  setIsRefreshing
}: CoachesTabProps) => {
  // Use a ref to track action debouncing
  const actionTimeoutRef = useRef<number | null>(null);
  const [isActionPending, setIsActionPending] = useState(false);
  const actionInProgressRef = useRef(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);

  // Stabilized callback to prevent excessive re-renders
  const handleAddCoach = useCallback(() => {
    if (actionInProgressRef.current || isActionPending || isRefreshing) return;
    
    actionInProgressRef.current = true;
    setIsActionPending(true);
    
    // Debounce the action to prevent rapid clicks
    setTimeout(() => {
      onAddCoach();
      
      // Reset action state after a short delay
      setTimeout(() => {
        actionInProgressRef.current = false;
        setIsActionPending(false);
      }, 500);
    }, 10);
  }, [onAddCoach, isActionPending, isRefreshing]);
  
  // Stabilized edit handler
  const handleEditCoach = useCallback((coach: Coach) => {
    if (actionInProgressRef.current || isActionPending || isRefreshing) return;
    
    actionInProgressRef.current = true;
    setIsActionPending(true);
    
    // Debounce the action
    setTimeout(() => {
      onEditCoach(coach);
      
      // Reset action state after a delay
      setTimeout(() => {
        actionInProgressRef.current = false;
        setIsActionPending(false);
      }, 500);
    }, 10);
  }, [onEditCoach, isActionPending, isRefreshing]);
  
  // Stabilized delete handler
  const handleDeleteCoach = useCallback((coach: Coach) => {
    if (actionInProgressRef.current || isActionPending || isRefreshing) return;
    
    actionInProgressRef.current = true;
    setIsActionPending(true);
    
    // Debounce the action
    setTimeout(() => {
      onDeleteCoach(coach);
      
      // Reset action state after a delay
      setTimeout(() => {
        actionInProgressRef.current = false;
        setIsActionPending(false);
      }, 500);
    }, 10);
  }, [onDeleteCoach, isActionPending, isRefreshing]);

  const handlePasswordReset = () => {
    // Additional actions after password reset if needed
    console.log('Password reset initiated for clinic:', clinicId);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Coaches at {clinicName}</CardTitle>
        <div className="flex gap-2">
          {clinicEmail && (
            <Button 
              onClick={() => setShowResetPasswordDialog(true)} 
              variant="outline"
              className="flex items-center gap-2"
              disabled={isRefreshing || isActionPending}
            >
              <Key size={18} />
              <span>Reset Password</span>
            </Button>
          )}
          <Button 
            onClick={handleAddCoach} 
            className="flex items-center gap-2"
            disabled={isRefreshing || isActionPending}
          >
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus size={18} />}
            <span>{isRefreshing ? "Processing..." : "Add Coach"}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CoachList 
          clinicId={clinicId} 
          onEdit={handleEditCoach}
          onDelete={handleDeleteCoach}
          refreshTrigger={refreshTrigger}
          isRefreshing={isRefreshing}
          setIsRefreshing={setIsRefreshing}
        />
      </CardContent>

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
