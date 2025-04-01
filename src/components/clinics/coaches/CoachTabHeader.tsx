
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Loader2 } from 'lucide-react';

interface CoachTabHeaderProps {
  clinicName: string;
  onAddCoach: () => void;
  isDisabled: boolean;
  isLoading: boolean;
}

const CoachTabHeader: React.FC<CoachTabHeaderProps> = ({
  clinicName,
  onAddCoach,
  isDisabled,
  isLoading
}) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <CardTitle>Coaches at {clinicName}</CardTitle>
      <div>
        <Button 
          onClick={onAddCoach} 
          className="flex items-center gap-2"
          disabled={isDisabled}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus size={18} />}
          <span>{isLoading ? "Processing..." : "Add Coach"}</span>
        </Button>
      </div>
    </div>
  );
};

export default CoachTabHeader;
