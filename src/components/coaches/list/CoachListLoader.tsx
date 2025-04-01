
import React from 'react';
import { Loader2 } from 'lucide-react';

interface CoachListLoaderProps {
  message?: string;
}

const CoachListLoader: React.FC<CoachListLoaderProps> = ({ 
  message = "Loading coaches..." 
}) => {
  return (
    <div className="flex flex-col items-center py-8 space-y-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <div className="flex flex-col items-center gap-1">
        <div className="text-sm text-muted-foreground font-medium">{message}</div>
        <div className="text-xs text-gray-400">Please wait while we process your request</div>
      </div>
    </div>
  );
};

export default CoachListLoader;
