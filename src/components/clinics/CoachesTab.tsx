
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Loader2 } from 'lucide-react';
import CoachList from '@/components/coaches/CoachList';
import { Coach } from '@/services/coaches';
import { toast } from 'sonner';

interface CoachesTabProps {
  clinicName: string;
  clinicId: string;
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

  // Debounced handlers to prevent rapid clicks and UI thrashing
  const handleAddCoach = () => {
    if (isActionPending || isRefreshing) return;
    
    setIsActionPending(true);
    onAddCoach();
    
    // Reset action state after a short delay
    if (actionTimeoutRef.current) {
      clearTimeout(actionTimeoutRef.current);
    }
    
    actionTimeoutRef.current = window.setTimeout(() => {
      setIsActionPending(false);
    }, 500);
  };
  
  const handleEditCoach = (coach: Coach) => {
    if (isActionPending || isRefreshing) return;
    
    setIsActionPending(true);
    onEditCoach(coach);
    
    if (actionTimeoutRef.current) {
      clearTimeout(actionTimeoutRef.current);
    }
    
    actionTimeoutRef.current = window.setTimeout(() => {
      setIsActionPending(false);
    }, 500);
  };
  
  const handleDeleteCoach = (coach: Coach) => {
    if (isActionPending || isRefreshing) return;
    
    setIsActionPending(true);
    onDeleteCoach(coach);
    
    if (actionTimeoutRef.current) {
      clearTimeout(actionTimeoutRef.current);
    }
    
    actionTimeoutRef.current = window.setTimeout(() => {
      setIsActionPending(false);
    }, 500);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Coaches at {clinicName}</CardTitle>
        <Button 
          onClick={handleAddCoach} 
          className="flex items-center gap-2"
          disabled={isRefreshing || isActionPending}
        >
          {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus size={18} />}
          <span>{isRefreshing ? "Processing..." : "Add Coach"}</span>
        </Button>
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
    </Card>
  );
};

export default CoachesTab;
